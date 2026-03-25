import { GlobalStyle, theme } from '@copilot_bom/ui';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { CartProvider, LabelProvider, LayoutProvider, PageProvider } from '@websolutespa/bom-mixer-hooks';
import { LayoutDefaults, PageDefaults } from '@websolutespa/bom-mixer-mock';
import Head from 'next/head';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { createCustomTheme } from './theme';

const PreviewStyle = createGlobalStyle`

  .sb-show-main.sb-main-padded {
    padding: 0;
  }

  .sbdocs-content {

    &>h1, &>h2, &>h3, &>h4, &>h5 {
      line-height: 1.2;
      margin: 0.5em 0;
    }

    &>h1 {
      font-size: 30px;
      font-weight: bold;
    }

    &>h2 {
      font-size: 17px;
      font-weight: 500;
    }

    &>h3 {
      font-size: 17px;
    }

    &>h4 {
      font-size: 16px;
    }

    &>h5 {
      font-size: 15px;
    }

    &>code {
      font-family: monospace;
    }

    &>pre {
      padding: 1rem;
      margin-bottom: 1rem;
      font-size: 0.8rem;
      border: 1px solid #eee;
      border-left: 3px solid var(--color-primary-500);
    }

    &>p {
      margin-bottom: 1em;

      &>code {
        font-family: monospace;
        border: 1px solid #eee;
        border-radius: 3px;
        padding: 0 0.25em;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
      }

      &>a {
        font-size: 0.8rem;
        color: var(--color-primary-500);
        text-decoration: underline;
      }
    }
  }

`;

const themeJson = theme;

const layout = LayoutDefaults;

const page = PageDefaults;

export const decorators = [
  (story) => (
    <>
      <LayoutProvider layout={ layout }>
        <LabelProvider>
          <PageProvider page={ page }>
            <Head>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;700&display=swap" rel="stylesheet"></link>
            </Head>
            <GlobalStyle />
            <PreviewStyle />
            <CartProvider>
              { story() }
            </CartProvider>
          </PageProvider>
        </LabelProvider>
      </LayoutProvider>
    </>
  ),
  withThemeFromJSXProvider({
    Provider: ThemeProvider,
    defaultTheme: 'light',
    themes: {
      light: theme,
    },
  })];

export const parameters = {
  docs: {
    theme: createCustomTheme({ theme: themeJson, options: { base: 'light' } }),
  },
  options: {
    storySort: {
      method: 'alphabetical',
      // order: ['Introduction', 'Styleguide', 'Atoms', 'Molecules', 'Organisms'],
      order: ['Introduction', 'Styleguide', 'Typography', 'Colors', 'Icons', 'Components', 'Forms', 'Sections', 'Pages'],
      locales: 'en-US',
    },
    showPanel: false,
  },
  backgrounds: {
    disable: true,
    grid: {
      disable: true,
    }
  },
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: false,
  },
  nextRouter: {
    query: {
      foo: 'this-is-a-global-override',
    },
  },
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
