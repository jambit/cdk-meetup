#!/usr/bin/env node
import 'source-map-support/register';
import {App, Aspects} from 'aws-cdk-lib';
import { CdkStagesStack } from './cdk-stages-stack';
import {AwsSolutionsChecks, NagSuppressions} from "cdk-nag";

const app = new App();

new CdkStagesStack(app, 'cdk-stages-dev', {
    stage: "dev",
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'eu-central-1'
    },
});

const prod = new CdkStagesStack(app, 'cdk-stages-prod', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'eu-central-1'
    },
    stage: "prod"
});

Aspects.of(prod).add(new AwsSolutionsChecks())
NagSuppressions.addStackSuppressions(prod, [
    { id: 'AwsSolutions-S1', reason: 'The bucket should have server access logging enabled to provide detailed records for the requests that are made to the bucket.' },
    { id: 'AwsSolutions-S10', reason: 'Use HTTPS (TLS) to help prevent potential attackers from eavesdropping on or manipulating network traffic using person-in-the-middle or similar attacks.' },
    { id: 'AwsSolutions-CFR2', reason: 'Web Application Firewall can help protect against application-layer attacks that can compromise the security of the system or place unnecessary load on them.' },
    { id: 'AwsSolutions-CFR4', reason: 'Vulnerabilities have been and continue to be discovered in the deprecated SSL and TLS protocols. Help protect viewer connections by specifying a viewer certificate that enforces a minimum of TLSv1.1 or TLSv1.2 in the security policy.' },
    { id: 'AwsSolutions-IAM4', reason: 'Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies' },
    { id: 'AwsSolutions-IAM5', reason: 'The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission.' },
    { id: 'AwsSolutions-L1', reason: 'Use the latest available runtime for the targeted language to avoid technical debt. Runtimes specific to a language or framework version are deprecated when the version reaches end of life.' },
]);
