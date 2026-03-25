import { getClassNames } from '@websolutespa/bom-core';
import { usePagination, useSearchParamsQs } from '@websolutespa/bom-mixer-hooks';
import { IconChevronLeft, IconChevronRight } from '@websolutespa/bom-mixer-icons';
import { ILazyableProps, resolveHref } from '@websolutespa/bom-mixer-models';
import { Container, Flex, Grid, Pagination, RelPrevNext, Section, StructuredData, Text } from '@websolutespa/bom-mixer-ui';
import { ListItem } from 'schema-dts';

const ITEMS = new Array(100).fill(0).map((_, i) => ({
  id: `id-${i}`,
  title: `Title-${i}`,
  href: '/',
}));

export type TestPaginationItem = {
  affectsMetaData?: boolean;
};

export const TestPagination = ({ item }: ILazyableProps<TestPaginationItem>) => {

  // deserialize queryString encoded params
  const { params, replaceParamsSilently } = useSearchParamsQs();

  // initialize pagination with items and queryString params
  const pagination = usePagination(ITEMS, params?.pagination);

  // fires when user make a change on pagination
  function onPaginationChange(page: number) {
    pagination.goToPage(page);
    // serializing querystring pagination
    replaceParamsSilently({ pagination: { page } });
  }

  const classNames = getClassNames('test-pagination');
  return (
    <Section className={classNames} id={item.anchor?.hash} padding="0 0 2rem 0">
      <Container>
        <Flex.Col rowGap="2rem">
          <Text variant="heading10">Pagination</Text>
          <Grid.Row rowGap="2rem">
            {pagination.items.map((x) => (
              <Grid key={x.id} md={4}>
                <Flex.Row justifyContent="center" alignItems="center" aspectRatio={16 / 9} background="var(--color-neutral-200)">
                  <Text variant="heading10" textAlign="center">{x.title}</Text>
                </Flex.Row>
              </Grid>
            ))}
          </Grid.Row>
          {pagination.items && pagination.pages > 1 &&
            <Pagination margin="2rem 0" count={pagination.pages} initialPage={pagination.page} page={pagination.page} onChange={onPaginationChange}>
              <Pagination.Previous><IconChevronLeft /></Pagination.Previous>
              <Pagination.Next><IconChevronRight /></Pagination.Next>
            </Pagination>
          }
        </Flex.Col>
      </Container>
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
            })) as ListItem[],
          })} />
        </>
      )}
    </Section>
  );
};
