import { ICategorized, IMedia } from '@websolutespa/bom-core';

export type IPostDetail = ICategorized & {
  slug: string;
  title: string;
  abstract: string;
  description: string;
  href: string;
  media: IMedia;
};
