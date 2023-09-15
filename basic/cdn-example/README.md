# RUM Agent example using the Split CDN

This example consists of self-contained HTML files with JavaScript.

All files consist of the same Web page but employ different approaches to load the RUM-Agent from the Split CDN: `https://cdn.split.io/rum-agent/browser-rum-agent-0.3.0.min.js`

- `index.html` - The RUM-Agent is loaded using an HTML script tag, which is synchronous by default. This blocks the page load until the script is loaded and executed.
- `index-async.html` - The RUM-Agent is loaded using an **asynchronous** HTML script tag. This doesn't block the page load, but some events may be lost if they are tracked before the script is loaded and executed.
- `index-async-v2.html` - Similar to `index-async.html`, but the asynchronous script tag is created programmatically using JavaScript.

## How to run

Replace `<YOUR-CLIENT-SIDE-SDK-KEY>` in the HTML files with your Split SDK key.

Then, you can either open these files directly in your browser, or host them on a web server, for example, by running `npx http-server public` if using NPM.

To check tracked events, go to the Split UI or look in the Network tab of your Browser Dev Tools. You should see POST requests to `https://events.split.io/api/events/beacon` containing the tracked events.
