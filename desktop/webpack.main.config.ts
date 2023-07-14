import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
  entry: {
    app: './src/index.ts',
  },
  devtool: 'eval',
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json', '.ink', '.kqj', '.woff2'],
  },
};
