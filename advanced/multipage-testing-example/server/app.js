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
  debug: 'ERROR'
}, (modules) => {
  modules.platform.getOptions = () => ({ agent: false });
}).client();


// Split traffic to serve two variants of the Web page, using `id` query param as user key for feature flag evaluations
// Web page variants are located at different folders: `dist/sync` (OFF treatment) and `dist/async` (ON treatment)
appRouter.use('/on', express.static(path.join(__dirname, '..', 'dist', 'async')));
appRouter.use('/off', express.static(path.join(__dirname, '..', 'dist', 'sync')));
appRouter.use('/', (req, res, next) => {
  if (req.query.id) {
    const treatment = client.getTreatment(req.query.id, process.env.FEATURE_FLAG_NAME);
    console.log('serving treatment ' + treatment);
    if (treatment === 'on') {
      return res.redirect('/on' + req.url)
    } else {
      return res.redirect('/off' + req.url);
    }
  }

  next();
});

module.exports = appRouter;
