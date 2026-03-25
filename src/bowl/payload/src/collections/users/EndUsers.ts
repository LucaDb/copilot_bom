import { BowlCollection } from '@websolutespa/payload-plugin-bowl';
import { slug } from '../../config';

/**
 * EndUsers
 * ATTENTION!
 * to all required fields will be assigned a default value when created as role 'guest'
 */
export const EndUsers: BowlCollection = {
  type: 'withEndUser',
  slug: slug.endUsers,
  admin: {
    defaultColumns: [
      'email',
      'firstName',
      'lastName',
    ],
  },
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'withText',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'withText',
      required: true,
    },
  ],
};
