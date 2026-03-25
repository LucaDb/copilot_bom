import { options } from '@websolutespa/payload-plugin-bowl';
import { Resource } from 'i18next';

export const locales = ['en', 'it'] as const;

export const defaultLocale = process.env.DEFAULT_LOCALE || 'en';

export const defaultMarket = process.env.DEFAULT_MARKET || 'ww';

export const group = {
  content: 'content',
  nav: 'nav',
  actions: 'actions',
  gdpr: 'gdpr',
  users: 'users',
  config: 'config',
  i18n: 'i18n',
};

export const slug = {
  homepage: 'homepage',
  post: 'post',
  media: 'media',
  users: 'users',
  endUsers: 'end_users',
  consentPreference: 'consent_preference',
  contact_action: 'contact_action',
  newsletter_action: 'newsletter_action',
  register_action: 'register_action',
};

export const pages = [
  slug.homepage,
  slug.post,
];

export const roles = {
  // Admin, Contributor, Editor, User, Guest,
  ...options.roles,
  Translator: 'translator',
  Press: 'press',
} as const;

export const rolesUser = [roles.Admin, roles.Contributor, roles.Editor, roles.Translator];
export const rolesEndUser = [roles.User, roles.Press, roles.Guest];

export const translations: Resource = {
  en: {
    collection: {
      singular: {
        contact_action: 'Contacts',
        homepage: 'Homepage',
        post: 'Post',
        newsletter_action: 'Newsletter',
        register_action: 'Register',
        users: 'User',
        description: 'Description',
      },
      plural: {
        contact_action: 'Contacts',
        homepage: 'Homepages',
        post: 'Posts',
        newsletter_action: 'Newsletters',
        register_action: 'Register',
        users: 'Users',
        description: 'Description',
      },
    },
    field: {
      firstName: 'First Name',
      lastName: 'Last Name',
      password: 'Password',
      message: 'Message',
      navs: 'Navs',
    },
  },
  it: {
    collection: {
      singular: {
        contact_action: 'Contatti',
        homepage: 'Homepage',
        post: 'Post',
        newsletter_action: 'Newsletter',
        register_action: 'Registrazione',
        users: 'Utente',
        description: 'Descrizione',
      },
      plural: {
        contact_action: 'Contatti',
        homepage: 'Homepage',
        post: 'Posts',
        newsletter_action: 'Newsletter',
        register_action: 'Registrazioni',
        users: 'Utenti',
        description: 'Descrizione',
      },
    },
    field: {
      firstName: 'Nome',
      lastName: 'Cognome',
      password: 'Password',
      message: 'Messaggio',
      navs: 'Navs',
    },
  },
};
