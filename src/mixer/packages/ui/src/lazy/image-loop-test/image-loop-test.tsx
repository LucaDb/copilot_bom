import { getClassNames, IMedia } from '@websolutespa/bom-core';
import { ILazyableProps } from '@websolutespa/bom-mixer-models';
import { Container, Section, Text } from '@websolutespa/bom-mixer-ui';
import { ImageLoop } from '../../components/image-loop/image-loop';

export type ImageLoopTestItem = {
};

export const ImageLoopTest = ({ item, index = 0, ...props }: ILazyableProps<ImageLoopTestItem>) => {
  const items: IMedia[] = [
    'https://picsum.photos/id/10/1600/900',
    'https://picsum.photos/id/20/1600/900',
    'https://picsum.photos/id/30/1600/900',
    'https://picsum.photos/id/40/1600/900',
    'https://picsum.photos/id/50/1600/900',
  ].map(x => ({
    type: 'image',
    src: x,
    alt: 'I\'m an alt',
  }));
  const classNames = getClassNames('image-loop-test');
  return (
    <Section className={classNames} padding="3rem 0" textAlign="center">
      <Container maxWidthMd="80ch">
        <Text variant="heading40">ImageLoop</Text>
        {items && (
          <ImageLoop items={items} aspectRatio={16 / 9} speed={600} />
        )}
      </Container>
    </Section>
  );
};
