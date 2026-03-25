import { BowlCollection, isRole } from '@websolutespa/payload-plugin-bowl';
import { roles, slug } from '../../config';

export const NewsletterAction: BowlCollection = {
  type: 'withAction',
  slug: slug.newsletter_action,
  admin: {
    defaultColumns: [
      'email',
    ],
  },
  access: {
    read: isRole(roles.Admin, roles.Contributor),
  },
  custom: {
    createEndUser: 'guest',
  },
  fields: [
    /*
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
    */
  ],
};
