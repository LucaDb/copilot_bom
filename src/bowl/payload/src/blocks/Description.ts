import { BowlBlock } from '@websolutespa/payload-plugin-bowl';

export const Description: BowlBlock = {
  type: 'withBlock',
  slug: 'text-description',
  fields: [
    { type: 'withDescription', required: true },
  ],
};
