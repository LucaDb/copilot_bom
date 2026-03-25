import { ITheme } from '@websolutespa/bom-mixer-ui';
import 'styled-components';
import { CSSObject, CSSProp } from 'styled-components';

declare module 'react' {
  interface Attributes {
    css?: CSSProp | CSSObject;
  }
}

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme { }

  export type RuleSet<T> = SimpleInterpolation<T>;
}
