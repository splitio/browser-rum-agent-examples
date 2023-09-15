# Split Browser RUM Agent examples

This repo contains a collection of examples using the Split Browser RUM Agent:

- `/basic/cdn-example/`: examples of HTML files with inline JavaScript that load the RUM Agent from the Split CDN.
- `/basic/npm-example/`: a simple NPM project with the RUM Agent installed via NPM. Webpack is used to bundle the JavaScript code.
- `/advanced/nextjs-example/`: a more complex NPM project with the RUM Agent installed via NPM. The project consists of a Single Page Application (SPA) built using Next.js, React and [The Movie Database (TMDB)](https://www.themoviedb.org/) API. It features user authentication, which is used to demonstrate how to handle RUM Agent identities.
- `/advanced/multipage-testing-example`: a NPM project for a NodeJS application that serves two variants of a web page behind a feature flag. Built with Webpack, the web pages use the Browser RUM Agent. An automation script navigates both variants, capturing events and impressions. These are saved in a JSON file, and the server exposes an endpoint for statistical analysis of the events per treatment captured by the RUM Agent.
