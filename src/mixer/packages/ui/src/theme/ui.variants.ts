import { IPartial } from '@websolutespa/bom-core';
import { CssActive, CssDisabled, CssFocus, CssResponsive, CssSvg, IVariants } from '@websolutespa/bom-mixer-ui';
import { css } from 'styled-components';

export const uiVariants: IPartial<IVariants> = {
  button: {
    primary: css`
      padding: 0.4em 1em;
      border-radius: var(--button-border-radius);
      border: 2px solid transparent;

      border-color: var(--color-primary-500);
      background-color: var(--color-primary-500);
      color: var(--color-neutral-100);

      // .card:hover &,
      &:hover,
      &.active {
        border-color: var(--color-primary-600);
        background-color: var(--color-primary-600);
        color: var(--color-neutral-100);
      }

      ${CssSvg}
      ${CssFocus}
      ${CssActive}
      ${CssDisabled}
      ${CssResponsive}
    `,
  },
};
