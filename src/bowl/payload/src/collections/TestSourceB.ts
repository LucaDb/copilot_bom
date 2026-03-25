import { BowlCollection } from '@websolutespa/payload-plugin-bowl';

export const TestSourceB: BowlCollection = {
  type: 'withCollection',
  slug: 'test_source_b',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'number',
      index: true,
      unique: true,
      required: true,
    },
    {
      type: 'withTitle',
    },
  ],
};
