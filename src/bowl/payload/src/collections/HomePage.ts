import { BowlCollection, options } from '@websolutespa/payload-plugin-bowl';
import { withThron, withThronGroup, withThronTabs } from '@websolutespa/payload-plugin-thron';
import { Description } from '../blocks/Description';
import { ThronGallery } from '../blocks/ThronGallery';
import { slug } from '../config';

export const Homepage: BowlCollection = {
  type: 'withPage',
  slug: slug.homepage,
  fields: [
    withThron({
      contentTypes: ['IMAGE', 'VIDEO'],
    }),
    withThronGroup({
      name: 'group',
      thron: {
        contentTypes: ['IMAGE', 'VIDEO'],
      },
      media: {
        relationTo: options.slug.media,
      },
    }),
    withThronTabs({
      name: 'group2',
      thron: {
        contentTypes: ['IMAGE', 'VIDEO'],
      },
      media: {
        relationTo: options.slug.media,
      },
    }),

    // inherited fields: id, title, slug, category, markets, template, meta, status, createdAt, updatedAt
    { type: 'withAbstract', required: true },
    { type: 'withMedia' },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Layout',
          fields: [
            {
              type: 'withComponents',
              blocks: [Description, ThronGallery],
            },
          ],
        },
      ],
    },
  ],
};

