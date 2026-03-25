import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const extend = {
  brandTitle: 'Stories',
  brandUrl: 'https://github.com/websolutespa/bom',
  brandImage: '/favicon-32x32.png',
  brandTarget: '_self',
};

const extendDark = {
  colorPrimary: '#00ea4e',
  colorSecondary: '#00a2ed',
  appBg: '#09090A',
  appContentBg: '#09090A',
  // appBorderColor: 'rgba(255,255,255,.1)',
  // appBorderRadius: 4,
  // fontBase: '"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
  // fontCode: 'ui-monospace, Menlo, Monaco, "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Droid Sans Mono", "Courier New", monospace',
  textColor: '#bcbcbe',
  textInverseColor: '#09090A',
  textMutedColor: '#7E7E8B',
  barTextColor: '#7E7E8B',
  barSelectedColor: '#00a2ed',
  barBg: '#09090A',
  buttonBg: '#09090A',
  // buttonBorder: 'rgba(255,255,255,.1)',
  booleanBg: '#09090A',
  booleanSelectedBg: '#2E3438',
  inputBg: '#09090A',
  // inputBorder: 'rgba(255,255,255,.1)',
  // inputTextColor: '#FFFFFF',
  // inputBorderRadius: 4,
};

const extendLight = {
  colorPrimary: '#00ea4e',
  colorSecondary: '#00a2ed',
  appBg: '#fcfdff',
  appContentBg: '#FFFFFF',
  // appBorderColor: 'hsla(203, 50%, 30%, 0.15)',
  // appBorderRadius: 4,
  // fontBase: '"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
  // fontCode: 'ui-monospace, Menlo, Monaco, "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Droid Sans Mono", "Courier New", monospace',
  textColor: '#2E3438',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#73828C',
  barTextColor: '#73828C',
  barSelectedColor: '#00a2ed',
  barBg: '#FFFFFF',
  buttonBg: '#F6F9FC',
  // buttonBorder: '#D9E8F2',
  booleanBg: '#ECF4F9',
  booleanSelectedBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  // inputBorder: 'hsla(203, 50%, 30%, 0.15)',
  inputTextColor: '#2E3438',
  // inputBorderRadius: 4,
};

const darkTheme = create({
  base: 'dark',
  ...extend,
  ...extendDark,
});

console.log('darkTheme', darkTheme);

const lightTheme = create({
  base: 'light',
  ...extend,
  ...extendLight,
});

console.log('lightTheme', lightTheme);

addons.setConfig({

  theme: lightTheme,

  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: false,
    collapsedRoots: ['other'],
    renderLabel: ({ name, type }) => (type === 'story' ? name : name),
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },

});
