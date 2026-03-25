// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-websolute`
  extends: ['websolute'],
  settings: {
    next: {
      rootDir: ['.'],
    },
  },
  overrides: [
    {
      files: [
        '*.{js,jsx,ts,tsx}',
      ],
      plugins: [
        '@next/eslint-plugin-next',
      ],
      extends: [
        'next/core-web-vitals',
      ],
      rules: {
        '@next/next/no-html-link-for-pages': ['error', path.join(__dirname, 'src')],
      },
    },
  ],
};
