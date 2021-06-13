import { App, Stack, StackProps } from '@aws-cdk/core';
import { Env } from './constants';

export class XorApp extends App {
  readonly env: Env
  readonly defaultProps: StackProps

  constructor(env: Env, defaultProps: StackProps) {
    super();
    this.env = env;
    this.defaultProps = defaultProps;
  }
}

export class XorStack extends Stack {
  readonly env: Env

  constructor(app: XorApp, id: string) {
    super(app, id, app.defaultProps);
    this.env = app.env;
  }
}
