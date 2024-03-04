import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {Bucket, BucketAccessControl} from "aws-cdk-lib/aws-s3";
import {
  Distribution,
  GeoRestriction,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol
} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";

export class CdkSecurityStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const destinationBucket = new Bucket(this, `cdk-security-s3-bucket`, {
      accessControl: BucketAccessControl.PRIVATE,
      enforceSSL: true,
    })

    const originAccessIdentity = new OriginAccessIdentity(this, 'cdk-security-origin-access-id');
    const distribution = new Distribution(this, 'cdk-security-cdn', {
      // Objects are served from location that has the lowest latency for viewer.
      // Higher price-class = additional locations = lower latency
      priceClass: PriceClass.PRICE_CLASS_100,
      // CloudFront distribution may require Geo restrictions.
      geoRestriction: GeoRestriction.allowlist('DE'), // Two-letter, uppercase country code for a country that you want to allow.
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(destinationBucket, {originAccessIdentity}),
      },
      // CloudFront distribution allows for SSLv3 or TLSv1 for HTTPS viewer connections.
      // Vulnerabilities have been and continue to be discovered in the deprecated SSL and TLS protocols.
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      // CloudFront distribution does not have access logging enabled.
      enableLogging: true // FIXME: try commenting me out
    })

    new BucketDeployment(this, 'cdk-security-s3-deployment', {
      sources: [Source.asset('./build')],
      destinationBucket,
      distribution
    });

    new CfnOutput(this, 'cdk-security-url', {
      value: distribution.domainName
    })

  }
}
