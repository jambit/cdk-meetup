#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkFunctionStack } from './cdk-function-stack';

const app = new cdk.App();
new CdkFunctionStack(app, 'cdk-function', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'eu-central-1'
    },
});