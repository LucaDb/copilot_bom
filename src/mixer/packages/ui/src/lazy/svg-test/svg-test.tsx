import { getClassNames } from '@websolutespa/bom-core';
import { ILazyableProps } from '@websolutespa/bom-mixer-models';
import { Box, Container, Section, SvgAnimation, SvgAnimationRef, Text } from '@websolutespa/bom-mixer-ui';
import { useRef } from 'react';

export type SvgTestItem = {
};

export const SvgTest = ({ item, index = 0, ...props }: ILazyableProps<SvgTestItem>) => {
  const animationRef = useRef<SvgAnimationRef>(null);
  const classNames = getClassNames('svg-test');
  return (
    <Section className={classNames} padding="3rem 0" textAlign="center">
      <Container maxWidthMd="80ch">
        <Text variant="heading40">Href</Text>
        <Box margin="2em 0" border="1px solid var(--color-neutral-200)">
          <SvgAnimation aspectRatio={750 / 420} href="/assets/svg-animation.json" />
        </Box>
        <Text variant="heading40">Default</Text>
        <Box margin="2em 0" border="1px solid var(--color-neutral-200)">
          <SvgAnimation mode="default" aspectRatio={750 / 420} animation={() => import('./svg-animation.json')} />
        </Box>
        <Text variant="heading40">Once</Text>
        <Box margin="2em 0" border="1px solid var(--color-neutral-200)">
          <SvgAnimation mode="once" aspectRatio={750 / 420} animation={() => import('./svg-animation.json')} />
        </Box>
        <Text variant="heading40">Over</Text>
        <Box margin="2em 0" border="1px solid var(--color-neutral-200)">
          <SvgAnimation mode="over" aspectRatio={750 / 420} href="https://assets4.lottiefiles.com/datafiles/zc3XRzudyWE36ZBJr7PIkkqq0PFIrIBgp4ojqShI/newAnimation.json" />
        </Box>
        <Text variant="heading40">OverOut</Text>
        <Box margin="2em 0" border="1px solid var(--color-neutral-200)">
          <SvgAnimation mode="overOut" aspectRatio={750 / 420} href="https://assets4.lottiefiles.com/datafiles/zc3XRzudyWE36ZBJr7PIkkqq0PFIrIBgp4ojqShI/newAnimation.json" />
        </Box>
        <Text variant="heading40">Scroll</Text>
        <Box margin="2em 0" border="1px solid var(--color-neutral-200)">
          <SvgAnimation mode="scroll" aspectRatio={750 / 420} animation={() => import('./svg-animation.json')} />
        </Box>
        <Text variant="heading40">Controlled</Text>
        <Box margin="2em 0" border="1px solid var(--color-neutral-200)">
          <SvgAnimation
            ref={animationRef}
            mode="controlled"
            aspectRatio={750 / 420}
            animation={() => import('./svg-animation.json')}
            onClick={() => animationRef.current?.play()}
          />
        </Box>
      </Container>
    </Section >
  );
};
