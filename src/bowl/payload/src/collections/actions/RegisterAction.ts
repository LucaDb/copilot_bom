import { BowlCollection, isRole } from '@websolutespa/payload-plugin-bowl';
import { roles, slug } from '../../config';

export const RegisterAction: BowlCollection = {
  type: 'withAction',
  slug: slug.register_action,
  admin: {
    defaultColumns: [
      'email',
      /*
      'firstName',
      'lastName',
      */
    ],
  },
  access: {
    read: isRole(roles.Admin, roles.Contributor),
  },
  custom: {
    createEndUser: 'user',
  },
  fields: [
    /*
    {
      name: 'password',
      type: 'withText',
      access: {
        read: (): boolean => false,
      },
      custom: {
        encrypted: true,
      },
      required: true,
    },
    {
      name: 'firstName',
      type: 'withText',
      custom: {
        updateEndUser: true,
      },
      required: true,
    },
    {
      name: 'lastName',
      type: 'withText',
      custom: {
        updateEndUser: true,
      },
      required: true,
    },
    */
  ],
};




