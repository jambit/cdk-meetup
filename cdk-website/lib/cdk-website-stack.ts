import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {BlockPublicAccess, Bucket} from "aws-cdk-lib/aws-s3";

export class CdkWebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const destinationBucket = new Bucket(this, `cdk-website-s3-bucket`, {
      publicReadAccess: true, // public read access für alle objekte
      websiteIndexDocument: 'index.html', // + aktiviert static hosting
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS, // blockt bspw. PUT Requests, aber Read ist immer noch public
    })

    new BucketDeployment(this, 'cdk-website-s3-deployment', {
      sources: [Source.asset('./build')], // ref auf das statische app bundle
      destinationBucket, // Angabe des buckets als deployment Ziel
    });

    // Konsolen ausgabe + Output-Variable für CloudformationStack
    new CfnOutput(this, 'cdk-website-url', {
      value: destinationBucket.bucketWebsiteUrl
    })

  }
}
