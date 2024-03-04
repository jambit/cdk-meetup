import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {Bucket, BucketAccessControl} from "aws-cdk-lib/aws-s3";
import {
  Distribution,
  GeoRestriction,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol,
} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";

type Options = StackProps & {
  stage: 'dev' | 'prod'
}

export class CdkStagesStack extends Stack {
  constructor(scope: Construct, id: string, props: Options) {
    super(scope, id, props);

    const { stage } = props

    const destinationBucket = new Bucket(this, `cdk-stages-s3-bucket-${stage}`, {
      accessControl: BucketAccessControl.PRIVATE,
      enforceSSL: true,
    })

    const originAccessIdentity = new OriginAccessIdentity(this, `cdk-stages-origin-access-id-${stage}`);
    const distribution = new Distribution(this, `cdk-security-cdn-${stage}`, {
      priceClass: PriceClass.PRICE_CLASS_100,
      geoRestriction: GeoRestriction.allowlist('DE'),
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(destinationBucket, {originAccessIdentity}),
      },
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      enableLogging: true
    })

    new BucketDeployment(this, `cdk-stages-s3-deployment-${stage}`, {
      sources: [Source.asset('./build')],
      destinationBucket,
      distribution,
    });

    new CfnOutput(this, `cdk-stages-url-${stage}`, {
      value: distribution.domainName
    })

  }
}
