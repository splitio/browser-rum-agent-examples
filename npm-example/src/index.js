/**
 * Statically import '@splitsoftware/browser-rum-agent' from NPM.
 * Tools like Webpack trim unused imports from the final bundle: https://webpack.js.org/guides/tree-shaking/
 */
import { SplitRumAgent, webVitals } from '@splitsoftware/browser-rum-agent';

// Register additional event collectors, like Web Vitals
SplitRumAgent.register(webVitals());

// Setup the Split RUM agent whenever identity information is available.
// Once the setup is done, the agent will start sending tracked events to Split services.
SplitRumAgent
  .setup('<YOUR-CLIENT-SIDE-SDK-KEY>',
    // Uncomment next line if you are using a proxy or an SDK Key from stage
    // { url: 'https://events.split-stage.io/api' }
  )
  .addIdentities([
    { key: 'user_id', trafficType: 'user' }
  ]);
