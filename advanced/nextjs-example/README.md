# RUM Agent example using NPM package in a Next.js project

This project is a fork of the [next-movies](https://github.com/tastejs/next-movies) project, a Web App demo built using Next.js, React and [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

The project is a Single Page Application (SPA) that features user authentication, and was modified to use the Split RUM Agent to track events out-of-the-box.

## Quick setup

1. Install dependencies: `npm install`
2. Take a copy of `.env.local.example` and re-name to `.env.local`
3. Get your TMDb API key and TMDB API read access token from [TMDB](https://www.themoviedb.org/), and enter the details into the `.env.local` file. You will need to create an account if you don't have one. If you don't set these values, the app will still work but it will serve an error page instead of the movie list.
4. Get your Split client-side SDK key from the Split UI and enter it into the `.env.local` file. If you don't set this value, the app will still work but the RUM Agent will fail to initialize.
5. Build and run the app locally: `npm run build && npm run start`.

### Available scripts

* `npm run dev`: dev build
* `npm run build`: production build
* `npm run static-build`: production static build
* `npm run start`: start the project
* `npm run vercel-deploy`: deploy to vercel
* `npm run netlify-deploy`: deploy to netlify
* `npm run analyze`: bundle analysis
* (`analyze:server` and `analyze:browser` are available too)

## How to setup the RUM Agent in a Next.js project with authentication

Since this is an NPM project, using the NPM package is the recommended approach.

1. Install the Split Browser RUM Agent package: `npm install @splitsoftware/browser-rum-agent`.
2. Create a source file to import and set up the Agent. In this project, `config/rumAgent.js` is used for that purpose.
3. Import the file and add logic for handling RUM Agent identities. We use `utils/AuthProvider/index.js` for this. The RUM Agent is dynamically imported when the `AuthProvider` component mounts. On user login, we call `SplitRumAgent.addIdentity()` with the user's `accountId`. On logout, we call `SplitRumAgent.removeIdentities()`.

Alternatively, you can also use the Split CDN to load the RUM Agent, for example, by adding the corresponding script tag in the `pages/_document.js` file.

## Tech Stack

Built with:

* Next.js
* Redux and Redux Thunk
* react-glider
* react-lazyload
* react-modal-video
* react-scroll
* react-select-search
* redaxios
* use-dark-mode
* @artsy/fresnel
* @loadable/component
* @splitsoftware/browser-rum-agent
