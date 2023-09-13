#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {StaticSite} from "./stacks/static-site/static-site";
import {Config} from "./config/config";
import {PublicHostedZone} from "./stacks/dns/public-hosted-zone";
import {CloudfrontCertificate} from "./stacks/dns/cloudfront-certificate";
import {InfraPipeline} from "./stacks/infra-pipeline/infra-pipeline";
import {Stage} from "aws-cdk-lib";
import {DnsStackStage} from "./stacks/infra-pipeline/dns-stack-stage";
import {CloudfrontCertificateStackStage} from "./stacks/infra-pipeline/cloudfront-certificate-stack-stage";
import {StaticSiteStackStage} from "./stacks/infra-pipeline/static-site-stack-stage";
import {ApplicationStackStage} from "./stacks/infra-pipeline/application-stack-stage";

const app = new cdk.App();
// const env = app.node.tryGetContext("env");
//
// if (!env) {
//     throw new Error("Env not found");
// }

const config = Config.getConfig("dev");
const appName = config.appName.toLowerCase();
const appEnv = {account: config.account, region: config.region};


const pipeline = new InfraPipeline(app, `${appName}-pipeline-stack`, {
    env: appEnv
})

const stage = new ApplicationStackStage(app, 'ApplicationStage', {
    env: appEnv,
    config: config
})

pipeline.pipeline.addStage(stage)

// const dnsStage = new DnsStackStage(app, `${appName}-dns-stack-stage`, {
//     env: appEnv,
//     appName: appName,
//     zoneName: config.domainName
// })
//
// const cloudfrontCertificateStage =new CloudfrontCertificateStackStage(app, `${appName}-acm-stack`, {
//     env: {account: config.account, region: "us-east-1"},
//     appName: config.appName,
//     domainName: config.domainName,
//     hostedZone: dnsStage.getHostedZone()
// });
//
// const staticSiteStackStage = new StaticSiteStackStage(app, `${appName}-static-site-stack`, {
//     env: appEnv,
//     appName: config.appName,
//     bucketName: config.bucketName,
//     zone: dnsStage.getHostedZone(),
//     certificate: cloudfrontCertificateStage.getCloudfrontCertificate(),
//     domainName: config.domainName,
//     websiteErrorDocument: config.websiteErrorDocument,
//     websiteIndexDocument: config.websiteIndexDocument
// })
//
// pipeline.pipeline.addStage(dnsStage);
// pipeline.pipeline.addStage(cloudfrontCertificateStage);
// pipeline.pipeline.addStage(staticSiteStackStage);



// const publicHostedZone = new PublicHostedZone(app, `${appName}-public-hosted-zone-stack`, {
//     env: appEnv,
//     zoneName: config.domainName
// });

// const cloudfrontCertificate = new CloudfrontCertificate(app, `${appName}-acm-stack`, {
//     env: {account: config.account, region: "us-east-1"},
//     crossRegionReferences: true,
//     appName: config.appName,
//     domainName: config.domainName,
//     hostedZone: dnsStage.getHostedZone()
//
// });

// const staticSiteStack = new StaticSite(app, `${appName}-static-site-stack`, {
//     env: appEnv,
//     crossRegionReferences: true,
//     appName: config.appName,
//     bucketName: config.bucketName,
//     zone: dnsStage.getHostedZone(),
//     certificate: cloudfrontCertificateStage.getCloudfrontCertificate(),
//     domainName: config.domainName,
//     websiteErrorDocument: config.websiteErrorDocument,
//     websiteIndexDocument: config.websiteIndexDocument
// });