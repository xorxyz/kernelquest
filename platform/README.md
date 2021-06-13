# Platform Infrastructure

## Dependencies

1. `cdk`
2. `aws-cli`
4. an AWS identity with CloudFormation admin permissions
5. an AWS access key for that identity

## Bootstrapping an AWS account

1. Login as root user
1. Go to [My Security Credentials](https://console.aws.amazon.com/iam/home#/security_credentials)
1. Create a new Access key
1. [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
1. Run `aws configure`. You will need your user's Access Key ID and Secret Access Key. Default region name should be `ca-central-1`. Use `json` for default output format.
1. Run `export WF_ENV=qa` with the actual account env (look in [lib/constants.ts](lib/constants.ts) for a list of existing environments)
1. Run `cdk bootstrap`. This will create a CloudFormation stack allowing you to use the CDK.

## Getting a shell

You can also do this in the browser in the [Session Manager AWS console](https://ca-central-1.console.aws.amazon.com/systems-manager/session-manager/start-session?region=ca-central-1).

1. Install [the Session Manager plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)
1. Find the instance id of the VM you want to access: `aws ec2 describe-instances`
1. Get a shell: `aws ssm start-session --target $INSTANCE_ID`

## Useful commands

 * `npm run test`    perform the jest unit tests
 * `cdk diff`        compare deployed stack with current state
 * `cdk deploy`      deploy this stack to your default AWS account/region

## Environment variables

 * `ENV`              see `lib/constants.ts` for values.
 * `AWS_REGION`       defaults to `ca-central-1`. overwrite to deploy to different regions.
