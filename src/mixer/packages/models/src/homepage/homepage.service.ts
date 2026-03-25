import { IEquatable, IPaginationResult, QueryParams } from '@websolutespa/bom-core';
import { IModelStore } from '@websolutespa/bom-mixer-models';
import { getStore } from '@websolutespa/bom-mixer-store';
import { IHomepage } from './homepage';

export async function getHomepages(params: QueryParams = {}): Promise<IHomepage[]> {
  const store = await getStore<IModelStore>();
  const items = await store.homepage.findMany<IHomepage>(params);
  return items;
}

export async function getHomepage(id: IEquatable, params: QueryParams = {}): Promise<IHomepage | undefined> {
  const store = await getStore<IModelStore>();
  const item = await store.homepage.findOne<IHomepage>(id, params);
  return item;
}

export async function getHomepagesPagination(params: QueryParams = {}): Promise<IPaginationResult<IHomepage>> {
  const store = await getStore<IModelStore>();
  const pagination = await store.homepage.findPaged<IHomepage>(params);
  return pagination;
}
