/* eslint-disable @typescript-eslint/no-var-requires */
const packagejson = require('./package.json');
const dependencies = Object.keys(packagejson.dependencies).filter(x =>
  x.indexOf('@websolutespa') === 0 ||
  x.indexOf('@copilot_bom') === 0
);
const bomEnv = require('@websolutespa/bom-env');

/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  const config = await bomEnv();
  // console.log('NextConfigJs.bomEnv', config.parsed);
  return {
    env: config.parsed,
    reactStrictMode: true,
    transpilePackages: [...dependencies],
    compiler: {
      styledComponents: {
        ssr: true,
        pure: true,
        displayName: false,
      },
    },
    images: {
      domains: (process.env.IMAGE_DOMAINS || '').split(','),
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: { and: [/\.(js|ts|md)x?$/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: {
                plugins: [{
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false },
                  },
                }],
              },
              titleProp: true,
            },
          },
        ],
      });
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
      return config;
    },
    experimental: {
      largePageDataBytes: 250 * 1000,
      forceSwcTransforms: true,
      esmExternals: 'loose',
    },
  };
};

module.exports = nextConfig;
