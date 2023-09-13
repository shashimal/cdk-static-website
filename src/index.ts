#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {StaticSite} from "./stacks/static-site/static-site";
import {Config} from "./config/config";
import {PublicHostedZone} from "./stacks/dns/public-hosted-zone";
import {CloudfrontCertificate} from "./stacks/dns/cloudfront-certificate";

const app = new cdk.App();
const env = app.node.tryGetContext("env");

if (!env) {
    throw new Error("Env not found");
}

const config = Config.getConfig(env);
const appName = config.appName.toLowerCase();
const appEnv = {account: config.account, region: config.region};


const publicHostedZone = new PublicHostedZone(app, `${appName}-public-hosted-zone-stack`, {
    env: appEnv,
    zoneName: config.domainName
});

const cloudfrontCertificate = new CloudfrontCertificate(app, `${appName}-acm-stack`, {
    env: {account: config.account, region: "us-east-1"},
    crossRegionReferences: true,
    appName: config.appName,
    domainName: config.domainName,
    hostedZone: publicHostedZone.getHostedZone()

});

const staticSiteStack = new StaticSite(app, `${appName}-static-site-stack`, {
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