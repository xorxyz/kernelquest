#!/usr/bin/env node

import 'source-map-support/register';
import BaseStack from '../lib/base';
import { XorApp } from '../lib/constructs';
import findAccount from './find-account';
const { accountId, env } = findAccount();

const app = new XorApp(env, {
  env: {
    account: accountId,
    region: process.env.AWS_REGION || 'ca-central-1',
  },
});

new BaseStack(app, 'BaseStack');
