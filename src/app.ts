#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { XorCdkStack } from './lib/xor-cdk-stack';

const app = new App();
new XorCdkStack(app, 'XorCdkStack');
