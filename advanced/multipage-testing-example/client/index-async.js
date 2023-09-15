/* Dynamically import a local module, which in turn imports '@splitsoftware/browser-rum-agent' for tree-shaking, resulting in a smaller app */
import('./browser-rum-agent').then(({ SplitRumAgent, webVitals }) => {
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
      { key: new URLSearchParams(window.location.search).get('id') || 'anonymous', trafficType: 'user' }
    ]);
  SplitRumAgent.register(webVitals());
}).catch(error => {
  console.log('An error occurred while loading the module: ' + error);
});
