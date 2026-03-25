import { getClassNames } from '@websolutespa/bom-core';
import { updateSearchParamsQs, usePagination, useSearchParamsQs } from '@websolutespa/bom-mixer-hooks';
import { ILazyableProps, resolveHref } from '@websolutespa/bom-mixer-models';
import { Button, Container, Flex, Grid, InfiniteLoader, RelPrevNext, Section, StructuredData, Text } from '@websolutespa/bom-mixer-ui';
import { useRouter } from 'next/router';

const ITEMS = new Array(100).fill(0).map((_, i) => ({
  id: `id-${i}`,
  title: `Title-${i}`,
  href: '/',
}));

export type TestPaginationInfiniteItem = {
  affectsMetaData?: boolean;
};

export const TestPaginationInfinite = ({ item }: ILazyableProps<TestPaginationInfiniteItem>) => {
  const router = useRouter();

  // deserialize queryString encoded params
  const { params, replaceParamsSilently } = useSearchParamsQs();

  // initialize pagination with items and queryString params
  const pagination = usePagination(ITEMS, { ...params?.pagination, mode: 'infinite' });

  function urlResolver(page: number) {
    const { pathname, query } = updateSearchParamsQs(router.asPath,
      {
        pagination: { page },
      }
    );
    return pathname + (query ? `?${query}` : '');
  }

  // fires when user make a change on pagination
  function onMore() {
    const page = pagination.loadMore();
    // serializing querystring pagination
    replaceParamsSilently({ pagination: { page } });
  }

  const classNames = getClassNames('test-infinite-loader');
  return (
    <Section className={classNames} id={item.anchor?.hash} padding="0 0 2rem 0">
      <Container>
        <Flex.Col rowGap="2rem">
          <Text variant="heading10">PaginationInfinite</Text>
          <Grid.Row rowGap="2rem">
            {pagination.items.map((x) => (
              <Grid key={x.id} md={4}>
                <Flex.Row justifyContent="center" alignItems="center" aspectRatio={16 / 9} background="var(--color-neutral-200)">
                  <Text variant="heading10" textAlign="center">{x.title}</Text>
                </Flex.Row>
              </Grid>
            ))}
          </Grid.Row>
          {true && pagination.hasMore &&
            <Flex.Row justifyContent="center" paddingTop="2rem" paddingBottom="2rem">
              <Button variant="underline" as="a" rel="next" href={urlResolver(pagination.nextPage!)} onClick={onMore}>View More</Button>
            </Flex.Row>
          }
          {false && pagination.hasMore &&
            <Flex.Row justifyContent="center">
              <InfiniteLoader onMore={onMore} href={urlResolver(pagination.nextPage!)}>more</InfiniteLoader>
            </Flex.Row>
          }
          {item.affectsMetaData && pagination.pages > 0 && (
            <>
              <RelPrevNext {...pagination} />
              <StructuredData item={({ meta: { title, description, url }, brand }) => ({
                '@type': 'ItemList',
                name: title,
                description: description,
                url: url,
                numberOfItems: pagination.total,
                itemListElement: pagination.items.map((item, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  item: {
                    '@type': 'Product',
                    name: item.title,
                    url: resolveHref(item.href),
                    brand: {
                      '@type': 'Brand',
                      name: brand.name,
                    },
                  },
                })),
              })} />
            </>
          )}
        </Flex.Col>
      </Container>
    </Section>
  );
};
