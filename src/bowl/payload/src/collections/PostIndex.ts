
import { BowlCollection } from '@websolutespa/payload-plugin-bowl';

export const PostIndex: BowlCollection = {
  type: 'withPage',
  slug: 'post_index',
  fields: [
    // inherited fields: id, title, slug, category, markets, template, meta, status, createdAt, updatedAt
    { type: 'withAbstract', required: true },
    { type: 'withDescription', required: true },
    { type: 'withMedia', required: true },
  ],
};
