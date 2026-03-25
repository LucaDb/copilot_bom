import { GlobalStyle, LAZY_MODULES, LayoutDefault, theme, uiVariants } from '@copilot_bom/ui';
import { isDevelopment } from '@websolutespa/bom-core';
import { ExtraProvider, LabelProvider, LayoutProvider, LazyModulesProvider, MetaDataProvider, PageProvider } from '@websolutespa/bom-mixer-hooks';
import { IApplication } from '@websolutespa/bom-mixer-models';
import { Breakpoint, BreakpointPlacement, ErrorHandler, VariantsProvider, accessibility } from '@websolutespa/bom-mixer-ui';
import { useLivePreview } from '@websolutespa/payload-bowl-live-preview';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { StyleSheetManager, ThemeProvider } from 'styled-components';

export default function Application({ Component, pageProps }: IApplication) {
  const { layout, page, ...extra } = pageProps;
  const { data } = useLivePreview({ initialData: page });
  pageProps.page = data;
  if (!layout || !page) {
    return;
  }
  const LayoutComponent = Component.Layout || LayoutDefault;
  return (
    <StyleSheetManager>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <VariantsProvider variants={uiVariants}>
          <ErrorBoundary FallbackComponent={ErrorHandler}>
            <LayoutProvider layout={layout}>
              <LabelProvider>
                <PageProvider page={page}>
                  <ExtraProvider extra={extra}>
                    {/*
                      // StructuredData validator https://validator.schema.org/
                      // OpenGraph validator https://www.opengraph.xyz/
                    */}
                    <MetaDataProvider metaData={{
                      brand: {
                        name: 'Mixer',
                        businessName: 'Mixer Spa',
                        appName: 'Mixer',
                        logo: '/assets/Mixer.jpg',
                        email: 'info@websolute.it',
                        telephone: '+39 0721 411112',
                        address: 'Strada della Campanara, 15',
                        city: 'Pesaro',
                        provinceCode: 'PU',
                        zipCode: '61122',
                        countryCode: 'IT',
                        twitterName: '@websolute',
                        social: {
                          facebook: 'https://www.facebook.com/websolute',
                          instagram: 'https://www.instagram.com/websolute',
                          linkedin: 'https://www.linkedin.com/company/websolute',
                          twitter: 'https://x.com/websolute',
                          youtube: 'https://www.youtube.com/@WebsoluteIt',
                        },
                      },
                    }}>
                      <LazyModulesProvider modules={LAZY_MODULES}>
                        <LayoutComponent>
                          <Component {...pageProps} />
                        </LayoutComponent>
                      </LazyModulesProvider>
                    </MetaDataProvider>
                  </ExtraProvider>
                </PageProvider>
              </LabelProvider>
            </LayoutProvider>
          </ErrorBoundary>
        </VariantsProvider>
        {isDevelopment && <Breakpoint placement={BreakpointPlacement.BottomLeft} />}
      </ThemeProvider>
    </StyleSheetManager>
  );
}

const ENABLE_ACCESSIBILITY_CHECK = false;
if (ENABLE_ACCESSIBILITY_CHECK) {
  accessibility(React);
}
