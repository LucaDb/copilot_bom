import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { azureBlobStorageAdapter } from '@payloadcms/plugin-cloud-storage/azure';
import seo from '@payloadcms/plugin-seo';
import { slateEditor } from '@payloadcms/richtext-slate';
import { IMarket } from '@websolutespa/bom-core';
import bomEnv from '@websolutespa/bom-env';
import bowl, { BowlCollection, BowlGlobal, Icon, Logo, isAdmin, setMixerContext } from '@websolutespa/payload-plugin-bowl';
import '@websolutespa/payload-plugin-bowl/dist/index.css';
import { fsStorageAdapter } from '@websolutespa/payload-plugin-cloud-storage-fs';
import { clearLogs, cronJob } from '@websolutespa/payload-plugin-cron-job';
import { localization } from '@websolutespa/payload-plugin-localization';
import '@websolutespa/payload-plugin-localization/dist/index.css';
import search from '@websolutespa/payload-plugin-search';
import seoWebsolute, { getDataField } from '@websolutespa/payload-plugin-seo';
import thron from '@websolutespa/payload-plugin-thron';
import * as path from 'path';
import { Payload } from 'payload';
import { buildConfig } from 'payload/config';
import { CollectionConfig, GlobalConfig } from 'payload/types';
import { Configuration } from 'webpack';
import { Homepage } from './collections/HomePage';
import { Post } from './collections/Post';
import { ContactAction } from './collections/actions/ContactAction';
import { NewsletterAction } from './collections/actions/NewsletterAction';
import { RegisterAction } from './collections/actions/RegisterAction';
import { EndUsers } from './collections/users/EndUsers';
import { Users } from './collections/users/Users';
import { defaultLocale, defaultMarket, group, locales, pages, roles, rolesEndUser, rolesUser, slug, translations } from './config';

/**
 * todo:
 * MONGODB_URI -> DATABASE_URI
 * migration -> see readme
 */

export default bomEnv().then(() => {

  const cors = process.env.PAYLOAD_PUBLIC_CORS_URLS || '*';
  const csrf = process.env.PAYLOAD_PUBLIC_CSRF_URLS ? process.env.PAYLOAD_PUBLIC_CSRF_URLS.split(',') : [];
  const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || '';
  const basePath = process.env.PAYLOAD_PUBLIC_BASE_PATH || '';
  const mongoDbUri = process.env.MONGODB_URI || '';

  const collections: BowlCollection[] = [
    // pages
    Homepage,
    Post,

    // users
    Users,
    EndUsers,

    // actions
    ContactAction,
    NewsletterAction,
    RegisterAction,
  ];

  const globals: BowlGlobal[] = [
  ];

  return buildConfig({
    serverURL,
    cors: cors === '*' ? cors : cors.split(','),
    csrf,
    telemetry: false,
    rateLimit: {
      window: 90000, // Time in milliseconds to track requests per IP. Defaults to 90000 (15 minutes).
      max: 100000, // Number of requests served from a single IP before limiting. Defaults to 500.
      skip: () => true, // Express middleware function that can return true (or promise resulting in true) that will bypass limit.
      trustProxy: true, // True or false, to enable to allow requests to pass through a proxy such as a load balancer or an nginx reverse proxy.
    },
    ...(process.env.PAYLOAD_SMTP_HOST !== 'PAYLOAD_SMTP_HOST' ? {
      email: {
        transportOptions: {
          host: process.env.PAYLOAD_SMTP_HOST || '',
          auth: {
            user: process.env.PAYLOAD_SMTP_USER || '',
            pass: process.env.PAYLOAD_SMTP_PASS || '',
          },
          port: Number(process.env.PAYLOAD_SMTP_PORT || ''),
          secure: Number(process.env.PAYLOAD_SMTP_PORT || '') === 465, // true for port 465, false (the default) for 587 and others
          requireTLS: true,
        },
        fromName: 'Mixer', // !!! todo override from app settings in send mail
        fromAddress: 'noreply@mixer.com', // !!! todo override from app settings in send mail
      },
    } : {}),
    admin: {
      user: Users.slug,
      meta: {
        titleSuffix: '- Bowl',
        favicon: `${basePath}/assets/bowl-favicon.svg`,
        ogImage: `${basePath}/assets/bowl-logo.svg`,
      },
      components: {
        graphics: {
          Logo,
          Icon,
        },
      },
      css: path.resolve(__dirname, './styles.scss'),
      bundler: webpackBundler(),
      webpack: (config: Configuration) => {
        const newConfig: Configuration = {
          ...config,
          resolve: {
            ...(config.resolve || {}),
            fallback: Array.isArray(config.resolve.fallback) ? [
              ...(config.resolve.fallback || []),
              { alias: false, name: 'fs' },
              { alias: false, name: 'stream' },
            ] : {
              ...(config.resolve.fallback || {}),
              fs: false,
              stream: false,
            },
          },
        };
        return newConfig;
      },
    },
    editor: slateEditor({
      admin: {
        elements: [
          'blockquote',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'indent',
          'link',
          'ol',
          'relationship',
          'textAlign',
          'ul',
          'upload',
        ],
      },
    }),
    db: mongooseAdapter({
      url: mongoDbUri,
      // see issue https://github.com/payloadcms/payload/issues/4350
      transactionOptions: false,
    }),
    localization: {
      locales: [...locales],
      defaultLocale,
      fallback: true,
    },
    i18n: {
      resources: translations,
      fallbackLng: defaultLocale,
      debug: false,
    },
    collections: collections as CollectionConfig[],
    globals: globals as GlobalConfig[],
    express: {
      preMiddleware: [(req, res, next) => {
        // console.log('preMiddleware.request', req.url);
        next();
      }],
    },
    plugins: [
      bowl({
        defaultMarket,
        slug: slug,
        group: group,
        roles: roles,
        rolesUser: rolesUser,
        rolesEndUser: rolesEndUser,
      }),
      // payloadCloud(),
      cloudStorage({
        collections: {
          [slug.media]: {
            adapter: process.env.PAYLOAD_STORAGE_ADAPTER === 'azure' ?
              azureBlobStorageAdapter({
                connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
                containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
                allowContainerCreate: process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === 'true',
                baseURL: process.env.AZURE_STORAGE_ACCOUNT_BASEURL,
              }) :
              fsStorageAdapter({
                baseDir: process.env.FS_STORAGE_BASEDIR,
                baseURL: process.env.FS_STORAGE_BASEURL,
              }),
            disablePayloadAccessControl: process.env.FS_STORAGE_DISABLE_PAYLOAD_ACCESS_CONTROL == 'true' ? true : undefined,
            generateFileURL: process.env.FS_STORAGE_ENABLE_GENERATE_FILE_URL == 'true' ? ({ filename }) => `${process.env.FS_STORAGE_BASEURL}/${filename}` : undefined,
          },
        },
      }),
      seo({
        collections: pages,
        globals: [],
        uploadsCollection: slug.media,
        tabbedUI: false,
      }),
      localization(),
      cronJob({
        access: {
          create: isAdmin,
          read: isAdmin,
          update: isAdmin,
          delete: isAdmin,
        },
        jobs: {
          alwaysOn: {
            execute: (payload: Payload) => {
              // console.log('ScheduledTask.alwaysOn every 5 minutes');
            },
            cron: '*/5 * * * *',
          },
          clearLogs: {
            execute: async (payload: Payload) => {
              console.log('ScheduledTask.clearLogs every sunday at 01:00');
              return await clearLogs(payload);
            },
            cron: '0 1 * * 0',
          },
        },
      }),
      seoWebsolute({
        collections: [...pages],
        additionalFields: [
          {
            name: 'robots',
            type: 'text',
          },
        ],
        customTokens: [
          {
            name: 'uppercase-title',
            replacementFunction: async (req, collection, doc: { title?: string }, locale) => {
              if (!doc.title) {
                return '';
              }
              if (locale) {
                const field = getDataField(collection.fields, 'title');
                return field.localized ? doc.title[locale.code]?.toUpperCase() : doc.title.toUpperCase();
              } else {
                return doc.title.toUpperCase();
              }
            },
          },
        ],
        metatagsRulesAccess: {
          read: isAdmin,
          create: isAdmin,
          update: isAdmin,
          delete: isAdmin,
        },
      }),
      search({
        searchIndex: {
          admin: { group: 'SEARCH' },
          access: {
            read: isAdmin,
            create: isAdmin,
            update: isAdmin,
            delete: isAdmin,
          },
        },
        defaults: {
          fields: [
            { name: 'title', weight: 100 },
            { name: 'abstract', weight: 80 },
            { name: 'components', weight: 60 },
          ],
        },
        collections: [...pages],
        api: {
          updateRequest: async (req) => {
            const { market, locale } = req.query;
            if (typeof market === 'string' && typeof locale === 'string') {
              await setMixerContext(req, market, locale);
            }
            return req;
          },
          extraParams: [{
            fieldName: 'market',
            serializer: (doc) => doc?.markets?.map((market: IMarket) => market.id).join(' | ') ?? '',
            whereCondition: (req) => ({
              or: [
                { 'market': { equals: '' } },
                { 'market': { contains: req.query.market } },
              ],
            }),
          }],
        },
      }),
      thron({
        clientId: process.env.THRON_CLIENT_ID,
        appId: process.env.THRON_APP_ID,
        appKey: process.env.THRON_APP_KEY,
        publicKey: process.env.THRON_PUBLIC_KEY,
      }),
    ],
    typescript: {
      outputFile: path.resolve(__dirname, 'generated-types.ts'),
    },
    graphQL: {
      schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
    routes: {
      api: `${basePath}/api`,
      admin: `${basePath}/admin`,
      graphQL: `${basePath}/graphql`,
      graphQLPlayground: `${basePath}/graphql-playground`,
    },
    // indexSortableFields: true
  });

});
