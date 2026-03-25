import { IPostDetail, IPostIndex, getPostDetails } from '@copilot_bom/models';
import { IEquatable, IFeatureType, IServerSideContext, PageProps, asEquatable } from '@websolutespa/bom-core';
import { Filter, IFilter, IPaginationInfo, filtersToParams, getFilters, getPaginationInfo, getSearchParamsQs, setFilters, updateSearchParamsQs, useMounted } from '@websolutespa/bom-mixer-hooks';
import { IconChevronLeft, IconChevronRight } from '@websolutespa/bom-mixer-icons';
import { getLayout, getPage, getPageProps, resolveHref } from '@websolutespa/bom-mixer-models';
import { Breadcrumb, Button, Card, Container, Field, Flex, Grid, Input, Label, Link, Main, Media, Pagination, RelPrevNext, Section, StructuredData, Text } from '@websolutespa/bom-mixer-ui';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function PostIndex({ layout, page, filters: serializedFilters, pagination }: PageProps<IPostIndex> & {
  filters: IFilter[];
  pagination: IPaginationInfo<IPostDetail>;
}) {
  const router = useRouter();
  const mounted = useMounted();

  const filters = useMemo(() => {
    return serializedFilters.map(x => new Filter<IPostDetail>(x));
  }, [serializedFilters]);

  function onFilterChange(filter: IFilter, values?: IEquatable[]) {
    filter.values = values || [];
    const { pathname, query } = updateSearchParamsQs(router.asPath,
      {
        filters: filtersToParams(filters),
        pagination: { page: 1 },
      }
    );
    router.replace({ pathname, query });
  }

  function onPaginationChange(page: number) {
    const { pathname, query } = updateSearchParamsQs(router.asPath,
      {
        pagination: { page },
      }
    );
    // console.log('onPaginationChange', pathname, query);
    router.push({ pathname, query });
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

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const values = event.target.value ? [event.target.value.toLowerCase()] : undefined;
    if (searchFilter) {
      onFilterChange(searchFilter, values);
    }
  };

  const hasAnyFilters = filters.reduce((p,c) => p || c.hasAny(), false);
  const showIntroText = pagination.page === 1 || hasAnyFilters || mounted;
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
            {pagination.items.map((item, i) => (
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
            {/* pagination */}
            {pagination.pages > 1 && (
              <>
                <Grid alignItems="center">
                  <Pagination margin="2rem 0"
                    count={pagination.pages} initialPage={pagination.page} page={pagination.page}
                    onChange={onPaginationChange}
                    urlResolver={urlResolver}
                  >
                    <Pagination.Previous><IconChevronLeft /></Pagination.Previous>
                    <Pagination.Next><IconChevronRight /></Pagination.Next>
                  </Pagination>
                </Grid>
                <RelPrevNext {...pagination} />
                <StructuredData item={({ meta: { title, description, url }, brand }) => ({
                  '@type': 'ItemList',
                  name: title,
                  description: description,
                  url: url,
                  numberOfItems: pagination.total,
                  itemListElement: pagination.items.map((item, i) => ({
                    '@type': 'ListItem',
                    position: (pagination.prevPage || 0) * pagination.perPage + i + 1,
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
            {/* no results */}
            {pagination.pages == 0 && (
              <Grid alignItems="center" className="pt80 pb80">
                There are no results match your search criteria.
              </Grid>
            )}
          </Grid.Row>
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
  pagination = getPaginationInfo<IPostDetail>(filteredItems, { page: pagination.page, perPage: pagination.perPage || 12 });

  const props = await getPageProps({ params, query, layout, page, filters, pagination });
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
