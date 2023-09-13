import {Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {PublicHostedZone} from "../dns/public-hosted-zone";
import {IHostedZone} from "aws-cdk-lib/aws-route53";


interface DnsStageProps extends StageProps {
    appName: string
    zoneName: string
}

export class DnsStackStage extends Stage {
    private hostedZone: IHostedZone;


    constructor(scope: Construct, id: string, props: DnsStageProps) {
        super(scope, id, props);

        this.hostedZone = new PublicHostedZone(this, `${props.appName}-public-hosted-zone-stack`, {
            zoneName: props.zoneName
        }).getHostedZone();
    }

    public getHostedZone = (): IHostedZone => {
        return this.hostedZone
    }
}