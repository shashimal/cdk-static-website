import {Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {PublicHostedZone} from "../dns/public-hosted-zone";
import {CloudfrontCertificate} from "../dns/cloudfront-certificate";
import {IHostedZone} from "aws-cdk-lib/aws-route53";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";

interface CloudfrontCertificateStackStageProps extends StageProps {
    appName: string
    domainName: string
    hostedZone: IHostedZone

}

//            env: {account: config.account, region: "us-east-1"},
export class CloudfrontCertificateStackStage extends Stage {
    private certificate: ICertificate;

    constructor(scope: Construct, id: string, props: CloudfrontCertificateStackStageProps) {
        super(scope, id, props);
        this.certificate = new CloudfrontCertificate(this, `${props.appName}-acm-stack`, {
            crossRegionReferences: true,
            appName: props.appName,
            domainName: props.domainName,
            hostedZone: props.hostedZone

        }).getCloudfrontCertificate();
    }

    public getCloudfrontCertificate = (): ICertificate => {
        return this.certificate;
    }
}