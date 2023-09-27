/* Statically import '@splitsoftware/browser-rum-agent' from NPM */
import { SplitRumAgent, webVitals } from '@splitsoftware/browser-rum-agent';

SplitRumAgent
  .setup(process.env.CLIENT_SIDE_SDK_KEY,
    process.env.EVENTS_URL ?
      { url: process.env.EVENTS_URL } :
      process.env.IS_STAGING ?
        { url: 'https://sdk.split-stage.io/api' } :
        {}
  )
  .addIdentities([
    // get key from URL query parameter `id`
    { key: new URLSearchParams(window.location.search).get('id'), trafficType: 'user' }
  ]);

SplitRumAgent.register(webVitals());
