import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {BlockPublicAccess, Bucket, BucketAccessControl, IBucket} from "aws-cdk-lib/aws-s3";
import {
    AllowedMethods,
    Distribution, IDistribution, OriginAccessIdentity,
    SecurityPolicyProtocol,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {ARecord, IHostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {CloudFrontTarget} from "aws-cdk-lib/aws-route53-targets";
import {CanonicalUserPrincipal, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";

interface StaticSiteProps extends StackProps {
    appName: string
    bucketName: string
    domainName: string
    websiteIndexDocument: string
    websiteErrorDocument: string
    certificate: ICertificate
    zone: IHostedZone
}

export class StaticSite extends Stack {

    props: StaticSiteProps;
    private readonly cloudfrontDistribution: IDistribution;

    constructor(scope: Construct, id: string, props: StaticSiteProps) {
        super(scope, id, props);
        this.props = props;

        const originAccessIdentity = new OriginAccessIdentity(this, `${this.props.appName}-cloudfront-oai`, {
            comment: `OAI for ${this.props.appName}`
        });

        const s3Bucket = this.createS3Bucket();

        this.cloudfrontDistribution = this.createCloudfrontDistribution(s3Bucket, originAccessIdentity);

        s3Bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [s3Bucket.arnForObjects('*')],
            principals: [new CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));

        new ARecord(this, `${this.props.appName}-cloudfront-alias-record`, {
            recordName: this.props.domainName,
            target: RecordTarget.fromAlias(new CloudFrontTarget(this.cloudfrontDistribution)),
            zone: this.props.zone
        })

        new BucketDeployment(this, `${this.props.appName}-bucket-deployment`, {
            sources: [Source.asset('site-contents')],
            destinationBucket: s3Bucket,
            distribution: this.cloudfrontDistribution,
            distributionPaths: ['/*'],
        });

    }

    private createS3Bucket = (): IBucket => {
        return new Bucket(this, `${this.props.domainName}-${this.props.bucketName}-bucket`, {
            bucketName: this.props.bucketName,
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL
        })
    }

    private createCloudfrontDistribution = (s3Bucket: IBucket, originAccessIdentity: OriginAccessIdentity): IDistribution => {
        return new Distribution(this, `${this.props.appName}-cloudfront`, {
            defaultRootObject: "index.html",
            enableLogging: false,
            domainNames: [this.props.domainName],
            certificate: this.props.certificate,
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,

            defaultBehavior: {
                origin: new S3Origin(s3Bucket, {
                    originAccessIdentity: originAccessIdentity
                }),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            },
        });
    }
}