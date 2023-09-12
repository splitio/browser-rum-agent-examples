This example requires `npm`, in order to install dependencies and run scripts.

It uses [Webpack](https://webpack.js.org/) to build a simple Web page, and [http-server](https://www.npmjs.com/package/http-server) to serve it.

# How to run

- Update `src/index.js` with your own client-side SDK key.
- Run `npm install` to install dependencies.
- Run `npm run build` to build the app. This script uses Webpack to bundle the application sources at `src` folder, into optimized production-ready assets (HTML and JS files) in the `dist` folder.
- Run `npm run serve` to start http-server to serve the `dist` folder.
- Open `http://localhost:8080` in your browser.
- Check tracked events in Split UI, or in the Network tab of your Browser Dev Tools. You should see POST requests to `https://events.split.io/api/events/beacon` with the tracked events.
