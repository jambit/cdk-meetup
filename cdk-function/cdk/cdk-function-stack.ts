import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Code, Function, Handler, Runtime} from 'aws-cdk-lib/aws-lambda'
import {DockerImageAsset} from "aws-cdk-lib/aws-ecr-assets";
import * as path from "path";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {Rule, Schedule} from "aws-cdk-lib/aws-events";
import {LambdaFunction} from "aws-cdk-lib/aws-events-targets";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkFunctionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, `cdk-function-data-sink`, {})

    const dockerImage = new DockerImageAsset(
        this,
        'cdk-function-image',
        {
          directory: path.join(__dirname, '../'),
        }
    )

    const servicePrincipal = new ServicePrincipal("lambda.amazonaws.com")
    const role = new Role(this, `cdk-function-role`, {
      assumedBy: servicePrincipal,
      managedPolicies: [
        {
          managedPolicyArn: 'arn:aws:iam::aws:policy/AmazonS3FullAccess'
        }
      ],
    })

    const lambda = new Function(this, 'cdk-function', {
      runtime: Runtime.FROM_IMAGE,
      handler: Handler.FROM_IMAGE,
      code: Code.fromEcrImage(dockerImage.repository, {
        tagOrDigest: dockerImage.imageTag,
      }),
      environment: {
        BUCKET: `${bucket.bucketName}`,
      },
      role
    });

    new Rule(this, 'cdk-function-schedule', {
      description: "Schedule a Lambda that creates a price report every 1st of the month",
      schedule: Schedule.cron({
        year: "*",
        month: "*",
        day: "1",
        hour: "1",
        minute: "1",
      }),
      targets: [new LambdaFunction(lambda)],
    });
  }
}
