#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { CdkWebsiteStack } from '../lib/cdk-website-stack';

const app = new App();

new CdkWebsiteStack(app, 'cdk-website', {
  env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: 'eu-central-1'
  },
});