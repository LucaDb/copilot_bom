import { getClassNames } from '@websolutespa/bom-core';
import { ILazyableProps } from '@websolutespa/bom-mixer-models';
import { Container, Media, Section, Text } from '@websolutespa/bom-mixer-ui';

export type VideoTestItem = {
};

export const VideoTest = ({ item, index = 0, ...props }: ILazyableProps<VideoTestItem>) => {
  const classNames = getClassNames('video-test');
  return (
    <Section className={classNames} padding="3rem 0" textAlign="center">
      <Container maxWidthMd="80ch">
        <Text variant="heading40">Video</Text>
        <Media margin="2rem 0" item={{ type: 'video', src: 'https://videos.pexels.com/video-files/1390942/1390942-uhd_2732_1440_24fps.mp4' }} />
      </Container>
    </Section>
  );
};
