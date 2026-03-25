import { IEquatable, IPaginationResult, QueryParams } from '@websolutespa/bom-core';
import { IModelStore } from '@websolutespa/bom-mixer-models';
import { getStore } from '@websolutespa/bom-mixer-store';
import { IPostDetail } from './post_detail';

export async function getPostDetail(id: IEquatable, params: QueryParams = {}): Promise<IPostDetail | undefined> {
  const store = await getStore<IModelStore>();
  const item = await store.post_detail.findOne<IPostDetail>(id, params);
  return item;
}

export async function getPostDetails(params: QueryParams = {}): Promise<IPostDetail[]> {
  const store = await getStore<IModelStore>();
  const items = await store.post_detail.findMany<IPostDetail>(params);
  return items;
}

export async function getPostDetailsPagination(params: QueryParams = {}): Promise<IPaginationResult<IPostDetail>> {
  const store = await getStore<IModelStore>();
  const pagination = await store.post_detail.findPaged<IPostDetail>(params);
  return pagination;
}
