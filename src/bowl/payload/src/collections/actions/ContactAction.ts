import { BowlCollection, isRole, options } from '@websolutespa/payload-plugin-bowl';
import { roles, slug } from '../../config';

export const ContactAction: BowlCollection = {
  type: 'withAction',
  slug: slug.contact_action,
  admin: {
    defaultColumns: [
      'email',
      'firstName',
      'lastName',
    ],
  },
  access: {
    read: isRole(roles.Admin, roles.Editor),
    update: (accessArgs) => isRole(roles.Admin)(accessArgs),
  },
  custom: {
    createEndUser: false,
  },
  fields: [
    {
      name: 'firstName',
      type: 'withText',
      required: true,
    },
    {
      name: 'lastName',
      type: 'withText',
      required: true,
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: options.slug.country,
      required: true,
    },
    {
      name: 'province',
      type: 'relationship',
      relationTo: options.slug.province,
    },
    {
      name: 'message',
      type: 'withText',
    },
  ],
};
