import * as Ariakit from '@ariakit/react';
import { isMenuHref } from '@websolutespa/bom-core';
import { useLayout } from '@websolutespa/bom-mixer-hooks';
import { Button, Flex, Link } from '@websolutespa/bom-mixer-ui';

export type MenuProps = {};

export const Menu = (props: MenuProps) => {
  const layout = useLayout();
  const mainMenu = layout.menu.main;
  return (
    <>
      {mainMenu.items && (
        <Ariakit.Menubar render={(
          <Flex.Row gapSm="2rem" gapLg="3rem"></Flex.Row>
        )}>
          {mainMenu.items.map((main, m) => isMenuHref(main) ? (
            <Ariakit.MenuItem
              key={m}
              tabbable
              render={(props) => (
                <Link href={main.href}>
                  <Button as="a" variant="nav" title={main.title} {...props}>
                    {main.title}
                  </Button>
                </Link>
              )}
            />
          ) : (
            <Ariakit.MenuProvider
              key={m}>
              <Ariakit.MenuGroup>
                <Ariakit.MenuButton render={
                  <Button as="a" variant="nav" title={main.title}>
                    {main.title}
                  </Button>
                } />
                <Ariakit.Menu>
                  {main.items?.map((sub,s) => isMenuHref(sub) ? (
                    <Ariakit.MenuItem
                      key={s}
                      tabbable
                      render={(props) => (
                        <Link href={sub.href}>
                          <Button as="a" variant="nav" title={sub.title as string} {...props}>
                            {sub.title as string}
                          </Button>
                        </Link>
                      )}
                    />
                  ) : (<></>))}
                </Ariakit.Menu>
              </Ariakit.MenuGroup>
            </Ariakit.MenuProvider>
          ))}
        </Ariakit.Menubar>
      )}
    </>
  );
};

