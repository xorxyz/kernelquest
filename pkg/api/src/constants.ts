export const isProd = process.env.NODE_ENV === 'production';

const sessionSecret = isProd
  ? process.env.SESSION_SECRET
  : '3A7BPfyKYCgoyw3u6-0stcYXtjbeVJkMH2.ugAKHZpf';
if (!sessionSecret) throw new Error('missing value for session secret');

export const SESSION_SECRET = sessionSecret;

cleanEnvironment();

function cleanEnvironment() {
  const keys = Object.keys(process.env);

  keys.forEach((key) => {
    process.env[key] = undefined;
  });
}
