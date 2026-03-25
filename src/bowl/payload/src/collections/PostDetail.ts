
import { BowlCollection } from '@websolutespa/payload-plugin-bowl';

export const PostDetail: BowlCollection = {
  type: 'withPage',
  slug: 'post_detail',
  fields: [
    // inherited fields: id, title, slug, category, markets, template, meta, status, createdAt, updatedAt
    { type: 'withAbstract', required: true },
    { type: 'withDescription', required: true },
    { type: 'withMedia', required: true },
  ],
};
