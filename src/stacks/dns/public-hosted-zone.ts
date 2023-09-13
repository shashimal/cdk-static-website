import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {HostedZone, IHostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";

interface HostedZoneProps extends StackProps {
    zoneName: string
}

export class PublicHostedZone extends Stack {

    private readonly hostedZone: IHostedZone
    constructor(scope: Construct, id: string, props: HostedZoneProps) {
        super(scope, id, props);

        this.hostedZone = new HostedZone(this, `${props.zoneName}-hosted-zone`, {
            zoneName: props.zoneName
        });
    }

    public getHostedZone = (): IHostedZone => {
        return this.hostedZone
    }
}