import { ICategorized, IRoute, PageProps } from '@websolutespa/bom-core';
import { useLabel } from '@websolutespa/bom-mixer-hooks';
import { getErrorPageLayout, getPageProps, getPublicUrl } from '@websolutespa/bom-mixer-models';
import { localApiPost, storeApiPost, StoreStrategy, storeStrategy } from '@websolutespa/bom-mixer-store';
import { Button, Container, Flex, Link, Main, OpenGraph, Section, StructuredData, Text } from '@websolutespa/bom-mixer-ui';
import { GetServerSideProps } from 'next';

export default function Gone410({ layout, page, params }: PageProps<ICategorized & { statusCode: number; statusMessage: string; }>) {
  // console.log('Gone410.params', page, params);
  const label = useLabel();
  return (
    <>
      <Main>
        <Section minHeight="calc(100vh - 130px)">
          <Container>
            <Flex.Col justifyContent="center" alignItems="center" gap="2rem">
              <Flex.Col justifyContent="center" alignItems="center">
                <Text variant="heading10">{page.statusCode}</Text>
                <Text variant="heading10">{page.title}</Text>
              </Flex.Col>
              <Flex.Col justifyContent="center" alignItems="center">
                <Text variant="paragraph30">{page.abstract}</Text>
                {page.statusCode !== 410 && (
                  <Text variant="paragraph30">{page.statusMessage}</Text>
                )}
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

export const getServerSideProps = (async (context) => {
  const { params, req, resolvedUrl } = context;
  const { headers } = req;
  const host = headers.host;
  const xForwardedProto = headers['x-forwarded-proto'];
  const xForwardedHost = headers['x-forwarded-host'];
  const xForwardedPort = headers['x-forwarded-port'];
  const xForwardedFor = headers['x-forwarded-for'];
  console.log(`
CatchAll.getServerSideProps
host            ${host}
xForwardedProto ${xForwardedProto}
xForwardedHost  ${xForwardedHost}
xForwardedPort  ${xForwardedPort}
xForwardedFor   ${xForwardedFor}
slug            ${params?.slug}
resolvedUrl     ${resolvedUrl}
`);
  const href = `${xForwardedProto}://${xForwardedHost}${resolvedUrl}`;
  try {
    // console.log('CatchAll.getServerSideProps request.cookies', request.cookies);
    // console.log('CatchAll.getServerSideProps', url.pathname);
    let route: IRoute | undefined;
    if (storeStrategy === StoreStrategy.DecoratedApi) {
      route = await localApiPost('/route', { pathname: resolvedUrl, href, hrefBeforeRedirect:href });
    } else {
      route = await storeApiPost('/route', { pathname: resolvedUrl, href, hrefBeforeRedirect:href });
    }
    // console.log('route', route);
    if (!route) {
      console.log('CatchAll.getServerSideProps.route.notfound', resolvedUrl);
      return {
        notFound: true,
      };
    }
  } catch (error: any) {
    const { status, statusText, url } = error;
    if (status >= 300 && status < 400) {
      console.log(`CatchAll.getServerSideProps.${status}`, statusText, resolvedUrl);
      try {
        const { redirectUrl } = await error.json();
        console.log('CatchAll.getServerSideProps.redirectUrl', redirectUrl);
        return {
          redirect: {
            statusCode: status,
            destination: redirectUrl,
          },
        };
      } catch (parseError) {
        const publicUrl = getPublicUrl();
        console.log(`CatchAll.getServerSideProps.${status}.error`, parseError, `cannot parse response, redirecting to ${publicUrl}`);
        return {
          redirect: {
            statusCode: 307,
            destination: publicUrl,
          },
        };
      }
    } else if (status === 404) {
      console.log('CatchAll.getServerSideProps.404', statusText, resolvedUrl);
      return {
        notFound: true,
      };
    } else {
      console.log('CatchAll.getServerSideProps.410', url, status, statusText);
      const { layout, page } = await getErrorPageLayout();
      const params = context.params as any;
      const query = context.query;
      context.res.statusCode = status;
      context.res.statusMessage = statusText || 'Gone';
      page.statusCode = status;
      page.statusMessage = statusText || 'Gone';
      const props = await getPageProps({ params, query, layout, page });
      return {
        props,
      };
    }
    /*
    console.log('CatchAll.getServerSideProps.error', resolvedUrl, url, status, statusText || error);
    return {
      props: {
        slug: params?.slug,
      },
    };
    */
  }
  return {
    redirect: {
      statusCode: 307, // 301 | 302 | 303 | 307 | 308
      destination: '/',
    },
  };
}) satisfies GetServerSideProps;
