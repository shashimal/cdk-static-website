import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {IHostedZone} from "aws-cdk-lib/aws-route53";
import {Certificate, CertificateValidation, ICertificate} from "aws-cdk-lib/aws-certificatemanager";

interface CloudfrontCertificateProps extends StackProps {
    appName: string
    domainName: string
    hostedZone: IHostedZone
}
export class CloudfrontCertificate extends Stack{

    public certificate:ICertificate;
    constructor(scope: Construct, id: string, props: CloudfrontCertificateProps) {
        super(scope, id, props);
        this.certificate = new Certificate(this, `${props.appName}-cloudfront-acm`, {
            domainName: props.domainName,
            validation: CertificateValidation.fromDns(props.hostedZone)
        });
    }
    public getCloudfrontCertificate= (): ICertificate => {
        return this.certificate;
    }
}