require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();

const { SplitFactory } = require('@splitsoftware/splitio');

const client = SplitFactory({
  core: {
    authorizationKey: process.env.SERVER_SIDE_SDK_KEY,
  },
  debug: 'ERROR'
}).client();

// Split traffic to serve two variants of the Web page, using `id` query param as user key for feature flag evaluations
// Web page variants are located at different folders: `dist/sync` (OFF treatment) and `dist/async` (ON treatment)
app.use('/on', express.static(path.join(__dirname, '..', 'dist', 'async')));
app.use('/off', express.static(path.join(__dirname, '..', 'dist', 'sync')));
app.use('/', (req, res, next) => {
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

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
