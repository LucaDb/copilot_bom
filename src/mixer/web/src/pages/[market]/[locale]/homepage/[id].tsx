import { IHomepage } from '@copilot_bom/models';
import { LayoutDefault } from '@copilot_bom/ui';
import { IStaticContext, PageProps, asEquatable } from '@websolutespa/bom-core';
import { IconGithub, IconWebhook } from '@websolutespa/bom-mixer-icons';
import { getLayout, getPage, getPageProps, getStaticPathsForSchema } from '@websolutespa/bom-mixer-models';
import { Box, Breadcrumb, Button, Container, Flex, LazyLoader, Main, OpenGraph, Section, StructuredData, Text } from '@websolutespa/bom-mixer-ui';
import { GetStaticPropsResult } from 'next';
import styled from 'styled-components';

const StyledPre = styled.pre`
  max-height: 18rem;
  overflow-y: auto;
  padding: 1em;
  margin-top: 1em;
  white-space: pre-wrap;
  background-color: var(--color-neutral-200);
  color: var(--color-neutral-700);
`;

const DataInspector = (props: { title: string, data: {} }) => {
  return (
    <Section padding="0 0 2rem 0">
      <Container maxWidthMd="80ch">
        <Box padding="2rem" border="2px solid var(--color-neutral-200)" borderRadius="var(--border-radius)">
          <Text variant="heading40" borderBottom="2px solid var(--color-neutral-200)">{props.title}</Text>
          <StyledPre>{JSON.stringify(props.data, null, 2)}</StyledPre>
        </Box>
      </Container>
    </Section>
  );
};

export default function Homepage({ layout, page, params }: PageProps<IHomepage>) {
  return (
    <>
      <Main minHeight="100vh">

        <Section className="print-none">
          <Container>
            <Breadcrumb.Group items={page.breadcrumb} />
          </Container>
        </Section>

        <Section padding="3rem 0" textAlign="center">
          <Container maxWidthMd="80ch">
            {page.title && (
              <Text variant="paragraph10" as="h1" fontWeight="700" marginBottom="2rem" dangerouslySetInnerHTML={{ __html: page.title }} />
            )}
            {page.abstract && (
              <Text variant="display30" as="h2" fontWeight="700" marginBottom="2rem" lineHeight="1.15" gradient dangerouslySetInnerHTML={{ __html: page.abstract }} />
            )}
            <Flex.Row paddingTop="2rem" gap="1rem" justifyContent="center">
              <Button as="a"href="https://bom-storybook.vercel.app/" variant="primary" target="_blank"><span>Storybook</span> <IconWebhook /></Button>
              <Button as="a" href="https://github.com/websolutespa/bom/tree/main/sample/basic/src/mixer/web" variant="primary" target="_blank"><span>Github</span> <IconGithub /></Button>
            </Flex.Row>
          </Container>
        </Section>

        <LazyLoader components={page.components} />

        <DataInspector title="Page" data={page} />
        <DataInspector title="Layout" data={layout} />

      </Main>
      <StructuredData />
      <OpenGraph />
    </>
  );
}

Homepage.Layout = LayoutDefault;

export async function getStaticProps(context: IStaticContext): Promise<GetStaticPropsResult<PageProps<IHomepage>>> {
  const id = asEquatable(context.params.id);
  const market = context.params.market;
  const locale = context.params.locale;
  const layout = await getLayout(market, locale);
  const page = await getPage<IHomepage>('homepage', id, market, locale, context);
  if (!page) {
    return {
      notFound: true,
      revalidate: true,
    };
  }
  const props = await getPageProps({ ...context, layout, page });
  return {
    props,
    /*
    * Next.js will attempt to re-generate the page when a request comes in at most once every 60 seconds
    */
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const paths = await getStaticPathsForSchema('homepage');
  return {
    paths,
    fallback: 'blocking', // runs before initial render
    // fallback: true, // runs in the background
  };
}
