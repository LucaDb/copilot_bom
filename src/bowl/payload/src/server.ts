import bomEnv from '@websolutespa/bom-env';
import { payloadInit } from '@websolutespa/payload-plugin-seed';
import express from 'express';
import * as path from 'path';
import payload from 'payload';

bomEnv().then(async () => {

  const basePath = process.env.PAYLOAD_PUBLIC_BASE_PATH || '';

  const app = express();

  app.use(`${basePath}/assets`, express.static(path.resolve(__dirname, './assets')));

  app.get(`${basePath}/`, (_, res) => {
    res.redirect(`${basePath}/admin`);
  });

  await payloadInit({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  app.listen(port);

});
