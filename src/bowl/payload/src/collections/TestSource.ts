import { BowlCollection } from '@websolutespa/payload-plugin-bowl';

export const TestSource: BowlCollection = {
  type: 'withCollection',
  slug: 'test_source',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'withTitle',
    },
  ],
};
