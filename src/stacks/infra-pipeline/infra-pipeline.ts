import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";

export class InfraPipeline extends Stack {

    public pipeline: CodePipeline;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.pipeline = new CodePipeline(this, 'Pipeline', {
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection(
                    'shashimal/cdk-static-website',
                    'main',
                    {
                        connectionArn:
                            'arn:aws:codestar-connections:us-east-1:793209430381:connection/8420d4e9-3f0d-4251-a1f6-ad8fa7997807',
                    }
                ),
                commands: ['npm ci', 'npm run build', 'npx cdk synth'],
            }),
            dockerEnabledForSynth: true,
        });
    }
}