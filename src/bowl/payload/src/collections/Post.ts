import { BowlCollection } from '@websolutespa/payload-plugin-bowl';
import { slug } from '../config';

export const Post: BowlCollection = {
  type: 'withPage',
  slug: slug.post,
  fields: [
    // inherited fields: id, title, slug, category, markets, template, meta, status, createdAt, updatedAt
    { type: 'withAbstract', required: true },
  ],
};

