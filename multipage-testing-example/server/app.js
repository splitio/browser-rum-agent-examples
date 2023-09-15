const path = require('path');
const express = require('express');
const appRouter = express.Router();

const { SplitFactory } = require('@splitsoftware/splitio');
require('dotenv').config();

const client = SplitFactory({
  core: {
    authorizationKey: process.env.SERVER_SIDE_SDK_KEY,
  },
  urls: Object.assign(process.env.IS_STAGING ? {
    sdk: 'https://sdk.split-stage.io/api',
    events: 'https://events.split-stage.io/api',
    auth: 'https://auth.split-stage.io/api',
    telemetry: 'https://telemetry.split-stage.io/api',
  } : {},
    process.env.EVENTS_URL ? { events: process.env.EVENTS_URL, } : {}
  ),
  scheduler: {
    impressionsRefreshRate: 5,
  },
  debug: 'INFO'
}, (modules) => {
  modules.platform.getOptions = () => ({ agent: false });
}).client();


// Split traffic to serve assets from two different folders, `dist/sync` (OFF treatment) and `dist/async` (ON treatment), using id from query parameters
appRouter.use((req, res, next) => {
  if (req.query.id && client.getTreatment(req.query.id, process.env.FEATURE_FLAG_NAME) === 'on') {
    req.url = '/on' + req.url;
  } else {
    req.url = '/off' + req.url;
  }

  next();
});

appRouter.use('/on', express.static(path.join(__dirname, '..', 'dist', 'async')));
appRouter.use('/off', express.static(path.join(__dirname, '..', 'dist', 'sync')));

module.exports = appRouter;
