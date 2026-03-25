import { BowlCollection } from '@websolutespa/payload-plugin-bowl';
import { slug } from '../../config';

export const Users: BowlCollection = {
  type: 'withUser',
  slug: slug.users,
  fields: [
    {
      type: 'withRoles',
    },
    /*
    {
      type: 'withTenants',
      relationTo: ['someCollection'],
    },
    */
  ],
};
