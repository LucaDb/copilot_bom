import { IStaticContext, PageProps } from '@websolutespa/bom-core';
import { useLabel } from '@websolutespa/bom-mixer-hooks';
import { getErrorPageLayout, getPageProps } from '@websolutespa/bom-mixer-models';
import { Button, Container, Flex, Link, Main, OpenGraph, Section, StructuredData, Text } from '@websolutespa/bom-mixer-ui';

export default function Error404({ layout, page, params }: PageProps) {
  // console.log('Error404.params', page, params);
  const label = useLabel();
  return (
    <>
      <Main>
        <Section minHeight="calc(100vh - 130px)">
          <Container>
            <Flex.Col justifyContent="center" alignItems="center" gap="2rem">
              <Flex.Col justifyContent="center" alignItems="center">
                <Text variant="heading10">404</Text>
                <Text variant="heading10">{page.title}</Text>
              </Flex.Col>
              <Flex.Col justifyContent="center" alignItems="center">
                <Text variant="paragraph30">{page.abstract}</Text>
              </Flex.Col>
              <Link href={layout.topLevelHrefs.homepage || '/'}>
                <Button as="a" variant="underline">
                  <Text variant="paragraph30">{label('navigation.home')}</Text>
                </Button>
              </Link>
            </Flex.Col>
          </Container>
        </Section>
      </Main>
      <StructuredData item={({ organization }) => organization} />
      <OpenGraph />
    </>
  );
}

export async function getStaticProps(context: IStaticContext) {
  const { layout, page } = await getErrorPageLayout();
  // console.log('404.getStaticProps', { layout, page });
  const props = await getPageProps({ ...context, layout, page });
  return {
    props,
  };
}
