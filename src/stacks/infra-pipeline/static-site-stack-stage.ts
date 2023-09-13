import {Stage, StageProps} from "aws-cdk-lib";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {IHostedZone} from "aws-cdk-lib/aws-route53";
import {Construct} from "constructs";
import {StaticSite} from "../static-site/static-site";

interface StaticSiteStageProps extends StageProps {
    appName: string
    bucketName: string
    domainName: string
    websiteIndexDocument: string
    websiteErrorDocument: string
    certificate: ICertificate
    zone: IHostedZone
}
export class StaticSiteStackStage extends Stage {

    constructor(scope: Construct, id: string, props: StaticSiteStageProps) {
        super(scope, id, props);

        new StaticSite(this, `${props.appName}-static-site-stack`, {
            crossRegionReferences: true,
            appName: props.appName,
            bucketName: props.bucketName,
            zone: props.zone,
            certificate: props.certificate,
            domainName: props.domainName,
            websiteErrorDocument: props.websiteErrorDocument,
            websiteIndexDocument: props.websiteIndexDocument
        });
    }

}