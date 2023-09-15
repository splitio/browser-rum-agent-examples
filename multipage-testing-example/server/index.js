const express = require('express');
const app = express();
const dataRouter = require('./data');
const appRouter = require('./app');

app.use(dataRouter);
app.use(appRouter);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
