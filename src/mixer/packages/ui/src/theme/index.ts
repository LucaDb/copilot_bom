import { ITheme } from '@websolutespa/bom-mixer-ui';
import theme from './theme.json';
const customTheme: ITheme = theme;
export * from './global.style';
export * from './ui.variants';
export { customTheme as theme };

