import { Accounts, Env } from '../lib/constants';

export default function findAccount() {
  const env = process.env.ENV as Env;

  if (!env) {
    process.stdout.write('missing value for ENV');
    process.exit(1);
  }

  if (!Accounts[env]) {
    process.stdout.write(`no account found for env "${env}"`);
    process.exit(1);
  }

  return {
    env,
    accountId: Accounts[env],
  };
}
