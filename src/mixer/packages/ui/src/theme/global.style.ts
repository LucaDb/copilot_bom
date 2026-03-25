import { CssBase, CssDebug, CssPrint, CssReset, CssScrollbar, CssTypography } from '@websolutespa/bom-mixer-ui';
import { createGlobalStyle } from 'styled-components';
import { CssVars } from './global.vars';

export const GlobalStyle = createGlobalStyle`
  ${CssReset}
  ${CssVars}
  ${CssBase}
  ${CssTypography}
  ${CssScrollbar}
  ${CssPrint}
  ${CssDebug}
`;
