import { BowlCollection } from '@websolutespa/payload-plugin-bowl';

export const TestTarget: BowlCollection = {
  type: 'withCollection',
  slug: 'test_target',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'withTitle',
    },
    {
      name: 'polymorphic',
      type: 'relationship',
      relationTo: ['test_source', 'test_source_b'],
    },
    {
      name: 'polymorphicMany',
      type: 'relationship',
      relationTo: ['test_source', 'test_source_b'],
      hasMany: true,
    },
    {
      name: 'hasMany',
      type: 'relationship',
      relationTo: 'test_source',
      hasMany: true,
    },
    {
      name: 'hasManyB',
      type: 'relationship',
      relationTo: 'test_source',
      hasMany: true,
    },
    {
      name: 'simpleRelation',
      type: 'relationship',
      relationTo: 'test_source',
    },
    {
      name: 'simpleRelationB',
      type: 'relationship',
      relationTo: 'test_source',
    },
  ],
};
