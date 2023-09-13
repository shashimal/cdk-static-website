import {DevConfig} from "./dev-config";
import {PrdConfig} from "./prd-config";

export interface IConfig {
    account: string
    region: string
    envName: string
    appName: string
    bucketName: string
    domainName: string
    websiteIndexDocument: string
    websiteErrorDocument: string
}

export class Config {

    public static getConfig = (env: string): IConfig => {
        if (env === "prd") {
            return PrdConfig;
        }
        return DevConfig;
    }
}