import { IconActivity, IconMoon, IconPersonStanding, IconSun, IconWebhook } from '@copilot_bom/icons';
import { getClassNames } from '@websolutespa/bom-core';
import { useColorScheme, useDrawer, useLayout, useMounted, useReducedMotion, useScrollDirection, useScrolled } from '@websolutespa/bom-mixer-hooks';
import { IconChevronDown } from '@websolutespa/bom-mixer-icons';
import { Button, Container, Flex, MarketsAndLanguagesDrawer, NavLink, Text, UIComponentProps, getCssResponsive } from '@websolutespa/bom-mixer-ui';
import styled from 'styled-components';
import { Menu } from './menu';

export type HeaderProps = UIComponentProps<{
  fixed?: boolean;
  sticky?: boolean;
  scrolled?: boolean;
}>;

const StyledHeader = styled.header<HeaderProps>`
  position: relative;
  display: flex;
  align-items: center;
  background: transparent;
  border-bottom: 1px solid transparent;
  transform: translateY(0);
  transition: var(--transition-smooth);
  transition-property: transform;
  // transition-property: transform, background-color, color, border-color;

  &.sticky {
    color: var(--color-neutral-900);
  }

  &.fixed {
    color: var(--color-neutral-100);
  }

  &.scrolled {
    transform: translateY(-100%);

    &.scrolled-up {
      transform: translateY(0);

      &.sticky {
        background: var(--color-neutral-100);
        color: var(--color-neutral-900);
      }

      &.fixed {
        background: var(--color-neutral-100);
        color: var(--color-neutral-900);
        border-bottom-color: var(--color-neutral-200);
      }
    }
  }

  &.fixed {
    position: fixed;
    min-height: 80px;
    top: 0;
    left: 0;
    right: var(--locked-padding-right, 0);
    z-index: 1000;
  };

  &.sticky {
    position: sticky;
    min-height: 80px;
    top: 0;
    right: var(--locked-padding-right, 0);
    z-index: 1000;
    background: var(--color-neutral-100);
    border-bottom-color: var(--color-neutral-200);
  }

  ${props => getCssResponsive(props)}
`;

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const layout = useLayout();
  const [drawer, openDrawer, closeDrawer] = useDrawer();
  const mounted = useMounted();
  const colorScheme = useColorScheme(state => state.colorScheme);
  const { toggleColorScheme } = useColorScheme(state => state.actions);
  const reducedMotion = useReducedMotion(state => state.reducedMotion);
  const { toggleReducedMotion } = useReducedMotion(state => state.actions);
  const scrolled = useScrolled((top) => top > 200);
  const direction = useScrollDirection();

  const classNames = getClassNames('header', {
    sticky: props.sticky,
    fixed: props.fixed,
    scrolled,
    'scrolled-up': direction === -1,
  });
  return (
    <>
      <StyledHeader className={classNames} {...props}>
        <Container.Fluid>
          <Flex.Row
            gap="1rem" gapMd="2rem" gapLg="3rem"
            as="nav" role="navigation" aria-label="Main menu"
          >
            <Flex flex="0 0 140px">
              <NavLink href={layout.topLevelHrefs.homepage || '/'}>
                <Button as="a">
                  <IconWebhook width="3rem" height="3rem" />
                  <Text variant="heading30" padding="0 0.5rem">Mixer</Text>
                </Button>
              </NavLink>
            </Flex>
            <Flex className="print-none" flex="1" justifyContent="center">
              <Menu />
            </Flex>
            <Flex flex="0 0 140px" justifyContent="flex-end" columnGap="1rem">
              {mounted && (
                <>
                  <Button
                    variant="circle"
                    title={colorScheme === 'light' ? 'Light mode' : 'Dark mode'}
                    onClick={() => toggleColorScheme()}
                  >
                    {colorScheme === 'light' ? <IconSun /> : <IconMoon />}
                  </Button>
                  <Button
                    variant="circle"
                    title={reducedMotion ? 'Reduced motion' : 'Animations enabled'}
                    onClick={() => toggleReducedMotion()}
                  >
                    {reducedMotion ? <IconPersonStanding /> : <IconActivity />}
                  </Button>
                </>
              )}
              <Button gap="0.2rem" onClick={() => openDrawer('markets-and-languages')}>
                <Text>{layout.locale.toUpperCase()}</Text> <IconChevronDown />
              </Button>
            </Flex>
          </Flex.Row>
        </Container.Fluid>
        {props.children}
      </StyledHeader>
      <MarketsAndLanguagesDrawer visible={drawer == 'markets-and-languages'} onClose={closeDrawer} />
    </>
  );
};

