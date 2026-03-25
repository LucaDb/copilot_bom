import { BowlBlock } from '@websolutespa/payload-plugin-bowl';
import { withThron, withThronMultiple } from '@websolutespa/payload-plugin-thron';

export const ThronGallery: BowlBlock = {
  type: 'withBlock',
  slug: 'thron-gallery',
  fields: [
    withThronMultiple({
      contentTypes: ['IMAGE'],
      targetArrayField: 'items',
    }),
    {
      type: 'array',
      name: 'items',
      fields: [
        withThron({ contentTypes: ['IMAGE'] }),
      ],
    },
  ],
};
