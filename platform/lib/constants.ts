// eslint-disable-next-line no-shadow
export enum Env {
    // eslint-disable-next-line no-unused-vars
    qa = 'qa', staging = 'staging', prod = 'prod'
  }
  
export const RootAccountId = '???';

export const Accounts: Record<Env, string> = {
  [Env.qa]: '736567635709',
  [Env.staging]: '???',
  [Env.prod]: '???',
};
