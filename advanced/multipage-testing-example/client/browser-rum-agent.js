// The following imports are not recommended, because they don't let bundlers, like Webpack and Rollup, trim unused code from the final bundle:
// - `import * as SplitRumAgentModule from '@splitsoftware/browser-rum-agent';`
// - `const { SplitRumAgent } = require('@splitsoftware/browser-rum-agent');`

export { SplitRumAgent, webVitals } from '@splitsoftware/browser-rum-agent';
