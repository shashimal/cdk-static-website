import {Construct} from "constructs";
import {Stage, StageProps} from "aws-cdk-lib";
import {IConfig} from "../../config/config";
import {PublicHostedZone} from "../dns/public-hosted-zone";
import {CloudfrontCertificate} from "../dns/cloudfront-certificate";
import {StaticSite} from "../static-site/static-site";

interface ApplicationStackStageProps extends StageProps {
    config: IConfig
}

export class ApplicationStackStage extends Stage {

    constructor(scope: Construct, id: string, props: ApplicationStackStageProps) {
        super(scope, id, props);

        const config = props.config
        const appEnv = {account: config.account, region: config.region};
        const appName = config.appName.toLowerCase();


        const publicHostedZone = new PublicHostedZone(this, `${appName}-public-hosted-zone-stack`, {
            env: appEnv,
            zoneName: config.domainName
        });

        const cloudfrontCertificate = new CloudfrontCertificate(this, `${appName}-acm-stack`, {
            env: {account: config.account, region: "us-east-1"},
            crossRegionReferences: true,
            appName: config.appName,
            domainName: config.domainName,
            hostedZone: publicHostedZone.getHostedZone()

        });

        const staticSiteStack = new StaticSite(this, `${appName}-static-site-stack`, {
            env: appEnv,
            crossRegionReferences: true,
            appName: config.appName,
            bucketName: config.bucketName,
            zone: publicHostedZone.getHostedZone(),
            certificate: cloudfrontCertificate.getCloudfrontCertificate(),
            domainName: config.domainName,
            websiteErrorDocument: config.websiteErrorDocument,
            websiteIndexDocument: config.websiteIndexDocument
        });
    }
}