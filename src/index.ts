#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {Config} from "./config/config";
import {InfraPipeline} from "./stacks/infra-pipeline/infra-pipeline";
import {ApplicationStackStage} from "./stacks/infra-pipeline/application-stack-stage";


const app = new cdk.App();
// const env = app.node.tryGetContext("env");
//
// if (!env) {
//     throw new Error("Env not found");
// }

const deployEnv = process.env.DEPLOY_ENV || "dev"

console.log(deployEnv)

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