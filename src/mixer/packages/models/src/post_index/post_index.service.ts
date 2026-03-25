import { IEquatable, IPaginationResult, QueryParams } from '@websolutespa/bom-core';
import { IModelStore } from '@websolutespa/bom-mixer-models';
import { getStore } from '@websolutespa/bom-mixer-store';
import { IPostIndex } from './post_index';

export async function getPostIndex(id: IEquatable, params: QueryParams = {}): Promise<IPostIndex | undefined> {
  const store = await getStore<IModelStore>();
  const item = await store.post_index.findOne<IPostIndex>(id, params);
  return item;
}

export async function getPostIndices(params: QueryParams = {}): Promise<IPostIndex[]> {
  const store = await getStore<IModelStore>();
  const items = await store.post_index.findMany<IPostIndex>(params);
  return items;
}

export async function getPostIndicesPagination(params: QueryParams = {}): Promise<IPaginationResult<IPostIndex>> {
  const store = await getStore<IModelStore>();
  const pagination = await store.post_index.findPaged<IPostIndex>(params);
  return pagination;
}
