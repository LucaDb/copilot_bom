/* eslint-disable @typescript-eslint/no-var-requires */
const packagejson = require('./package.json');
const dependencies = Object.keys(packagejson.dependencies).filter(
  (x) => x.indexOf('@websolutespa') === 0 || x.indexOf('@copilot_bom') === 0
);
const mixer = require('./src/mixer.json');
const store = require('./.mixer/store.json');
const bomEnv = require('@websolutespa/bom-env');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isDevelopment = process && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
const isProduction = process && process.env && String(process.env.PRODUCTION) === 'true';
const isNotStrategyMock = process && (!process.env || String(process.env.STORE_STRATEGY) != 'mock');
const isVercel = process && process.env && String(process.env.VERCEL) === '1';

/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  const config = await bomEnv();
  const env = {
    STORE_: JSON.stringify((isDevelopment || isNotStrategyMock) ? {} : store),
    COLLECTIONS: [...mixer.pages, ...mixer.collections].join(','),
    MOCKS: [...mixer.mocks].join(','),
    PAGES: mixer.pages.join(','),
    ...config.parsed,
  };
  // console.log('NextConfigJs.bomEnv', config.parsed);
  return withBundleAnalyzer({
    env,
    reactStrictMode: true,
    poweredByHeader: !isProduction,
    transpilePackages: [...dependencies],
    compiler: {
      styledComponents: {
        ssr: true,
        pure: true,
        displayName: false,
      },
    },
    async headers() {
      return [
        {
          // matching all API routes
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          ],
        },
      ];
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
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: { removeViewBox: false },
                    },
                  },
                ],
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
      config.externals.push('sharp');
      return config;
    },
    // trailingSlash: true,
    output: isVercel ? undefined : 'standalone',
    experimental: {
      largePageDataBytes: 250 * 1000,
      forceSwcTransforms: true,
      esmExternals: 'loose',
      outputFileTracingIncludes: {
        '/api/_image': ['./public/**/*'],
      },
    },
  });
};

module.exports = nextConfig;
