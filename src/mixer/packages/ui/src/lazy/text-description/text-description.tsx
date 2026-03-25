import { getClassNames } from '@websolutespa/bom-core';
import { ILazyableProps } from '@websolutespa/bom-mixer-models';
import { Box, Container, Section, Text } from '@websolutespa/bom-mixer-ui';

export type TextDescriptionItem = {
  description?: string;
};

export const TextDescription = ({ item }: ILazyableProps<TextDescriptionItem>) => {
  const classNames = getClassNames('text-description');
  return (
    <Section className={classNames} id={item.anchor?.hash} padding="0 0 2rem 0">
      <Container maxWidthMd="80ch">
        {item.description &&
          <Box padding="2rem" border="2px solid var(--color-neutral-200)" borderRadius="var(--border-radius)">
            <Text variant="paragraph20" lineHeight="1.5" color="var(--color-neutral-700)" dangerouslySetInnerHTML={{ __html: item.description }} />
          </Box>
        }
      </Container>
    </Section>
  );
};

/**
 * !!! executed server side
import { ILazyFuncProps, withLazyProps } from '@websolutespa/bom-mixer-models';
withLazyProps('description', async function ({ component }: ILazyFuncProps<TextDescriptionItem>) {
  // add custom props here;
  return component;
});
*/
