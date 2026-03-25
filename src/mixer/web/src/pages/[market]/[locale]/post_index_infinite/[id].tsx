import { IPostDetail, IPostIndex, getPostDetails } from '@copilot_bom/models';
import { IEquatable, IFeatureType, IServerSideContext, PageProps, asEquatable } from '@websolutespa/bom-core';
import { Filter, IFilter, IPaginationInfo, filtersToParams, getFilters, getPaginationInfo, getSearchParamsQs, setFilters, updateSearchParamsQs, useFilters, useMounted, usePagination, useSearchParamsQs } from '@websolutespa/bom-mixer-hooks';
import { getLayout, getPage, getPageProps, resolveHref } from '@websolutespa/bom-mixer-models';
import { Breadcrumb, Button, Card, Container, Field, Flex, Grid, InfiniteLoader, Input, Label, Link, Main, Media, RelPrevNext, Section, StructuredData, Text } from '@websolutespa/bom-mixer-ui';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

// this is the actual filtering function
function filterPostIndexInfinite(key: string, item: IPostDetail, value: IEquatable) {
  switch (key) {
    case 'search':
      return item.title.toLowerCase().includes(value.toString().toLowerCase());
    default:
      return false;
  }
}

export default function PostIndexInfinite({
  layout,
  page,
  filters: serializedFilters,
  pagination: serializedPagination,
  featureTypes,
  items,
}: PageProps<IPostIndex> & {
  filters: IFilter[];
  pagination: IPaginationInfo<IPostDetail>;
  featureTypes: IFeatureType[];
  items: IPostDetail[];
}) {
  const router = useRouter();
  const mounted = useMounted();

  // deserialize queryString encoded params
  const { params, pushParamsSilently } = useSearchParamsQs();

  // using item filter callback from service
  const filterItem = useCallback(filterPostIndexInfinite, []);

  const filters = useMemo(() => {
    return serializedFilters.map(x => new Filter<IPostDetail>(x));
  }, [serializedFilters]);

  // initialize filters with items, featureTypes and queryString params
  const { filteredItems, filters: mountedFilters, setFilter } = useFilters<IPostDetail>(items, featureTypes, filterItem, params?.filter);

  // initialize pagination with filteredItems and serializedPagination params
  const pagination = usePagination(filteredItems, { ...serializedPagination, mode: 'infinite' });

  // fires when user make a change on filters
  const onFilterChange = (filter: Filter<IPostDetail>, values?: IEquatable[]) => {
    setFilter(filter, values);
    // serializing querystring filter
    const filterParams = filtersToParams(mountedFilters);
    pagination.goToPage(1);
    pushParamsSilently({ filter: filterParams, pagination: { page: 1 } });
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.toLowerCase();
    const filter = mountedFilters.find(x => x.id === 'search');
    if (filter) {
      onFilterChange(filter, [search]);
    }
  };

  // fires when user make a change on pagination
  function onMore() {
    const page = pagination.loadMore();
    // serializing querystring pagination
    pushParamsSilently({ pagination: { page } });
  }

  function urlResolver(page: number) {
    const { pathname, query } = updateSearchParamsQs(router.asPath,
      {
        pagination: { page },
      }
    );
    return pathname + (query ? `?${query}` : '');
  }

  const searchFilter = filters.find(x => x.id === 'search');

  const hasAnyFilters = filters.reduce((p,c) => p || c.hasAny(), false);
  const showIntroText = pagination.page === 1 || hasAnyFilters || mounted;
  const visibleItems = mounted ? pagination.items : serializedPagination.items;
  return (
    <Main>
      <Section minHeight="calc(100vh - 135px)">
        <Container>
          {/* breadcrumb */}
          <Breadcrumb.Group items={page.breadcrumb} />
          {/* headline */}
          <Grid.Row margin="3rem 0">
            <Grid md={8} gridColumnEndMd={11} textAlign="center">
              {showIntroText && (
                // !important seo text should be present on first page only
                <>
                  <Text variant="display30" as="h1">{page.title}</Text>
                  {page.abstract && (
                    <Text variant="heading30" dangerouslySetInnerHTML={{ __html: page.abstract }} />
                  )}
                  {page.description && (
                    <Text variant="paragraph10" dangerouslySetInnerHTML={{ __html: page.description }} />
                  )}
                </>
              )}
            </Grid>
          </Grid.Row>
          {/* filters */}
          <Flex.Row marginBottom="3rem" gap="3rem" alignItems="center">
            {searchFilter && (
              <Flex.Row flex="1 0 auto">
                <Label flex="0" htmlFor="search" fontWeight="700" textTransform="uppercase">Search</Label>
                <Field flex="1 0 auto">
                  <Input name="search" id="search" placeholder="start typing..." onChange={onSearch} defaultValue={searchFilter.values.join(',')} />
                </Field>
              </Flex.Row>
            )}
          </Flex.Row>
          {/* results */}
          <Grid.Row columnGap="1rem" rowGap="2.5rem">
            {visibleItems.map((item, i) => (
              <Grid key={i} sm={6} md={4} lg={3}>
                <Link href={item.href}>
                  <Card as="a" hoverable width="100%">
                    <Media aspectRatio={96 / 54} marginBottom="2rem" item={item.media} />
                    <Card.Content>
                      <Text variant="heading40" lineHeight="1.2" dangerouslySetInnerHTML={{ __html: item.title }}></Text>
                      <Button variant="nav">
                        <Text variant="paragraph50" textTransform="uppercase">View More</Text>
                      </Button>
                    </Card.Content>
                  </Card>
                </Link>
              </Grid>
            ))}
            {/* no results */}
            {pagination.pages == 0 && (
              <Grid alignItems="center" className="pt80 pb80">
                There are no results match your search criteria.
              </Grid>
            )}
          </Grid.Row>
          {/* pagination */}
          {pagination.pages > 1 && (
            <>
              {pagination.hasMore && (
                <Flex.Row justifyContent="center" paddingTop="4rem" paddingBottom="2rem">
                  <Button variant="underline" as="a" rel="next" href={urlResolver(pagination.nextPage!)} onClick={(event) => {
                    event.preventDefault();
                    onMore();
                  }}>View More</Button>
                </Flex.Row>
              )}
              {false && pagination.hasMore &&
                  <Flex.Row justifyContent="center" paddingTop="4rem" paddingBottom="2rem">
                    <InfiniteLoader onMore={onMore} href={urlResolver(pagination.nextPage!)}>more</InfiniteLoader>
                  </Flex.Row>
              }
              <RelPrevNext {...pagination} />
              <StructuredData item={({ meta: { title, description, url }, brand }) => ({
                '@type': 'ItemList',
                name: title,
                description: description,
                url: url,
                numberOfItems: pagination.total,
                itemListElement: serializedPagination.items.map((item, i) => ({
                  '@type': 'ListItem',
                  position: (serializedPagination.prevPage || 0) * serializedPagination.perPage + i + 1,
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
        </Container>
      </Section>
    </Main>
  );
}

export async function getServerSideProps(context: IServerSideContext) {
  const params = context.params;
  const query = context.query;

  const id = asEquatable(params.id);
  const market = params.market;
  const locale = params.locale;
  const layout = await getLayout(market, locale);
  const page = await getPage<IPostIndex>('post_index', id, market, locale);

  const items = await getPostDetails({ market, locale });
  const featureTypes = await getPostDetailFeatureTypes({ market, locale });

  // querystring
  const searchParams = getSearchParamsQs(context.resolvedUrl);

  // filters
  const filters = getFilters(items, featureTypes, filterPostDetail, searchParams.filters);
  const filteredItems = setFilters(items, filters);

  // pagination
  let pagination = searchParams.pagination || {};
  pagination = getPaginationInfo<IPostDetail>(filteredItems, { page: pagination.page, perPage: pagination.perPage || 4 });

  const props = await getPageProps({ params, query, layout, page, filters, pagination, featureTypes, items });
  return {
    props,
  };
}

/**
 * this method retrieves filter datas.
 */
export async function getPostDetailFeatureTypes({ market, locale }: { market: string, locale: string }): Promise<IFeatureType[]> {
  const featureTypes: IFeatureType[] = [{
    id: 'search',
    schema: 'featureType',
    title: 'Search',
    mode: 'query',
    features: [],
  }];
  return featureTypes;
}

/**
 * this method is the actual filtering function.
 */
function filterPostDetail(key: string, item: IPostDetail, value: IEquatable) {
  switch (key) {
    case 'search':
      return item.title.toLowerCase().includes(value.toString().toLowerCase());
    default:
      return false;
  }
}
