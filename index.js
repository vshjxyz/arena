const express = require('express');
const path = require('path');
const Arena = require('./src/server/app');
const routes = require('./src/server/views/routes');

function run(config, listenOpts = {}) {
  const {app, Queues} = Arena();

  if (config) Queues.setConfig(config);
  Queues.useCdn = typeof listenOpts.useCdn !== 'undefined' ? listenOpts.useCdn : true;

  app.locals.basePath = listenOpts.basePath || app.locals.basePath;

  app.use(app.locals.basePath, express.static(path.join(__dirname, 'public')));
  app.use(app.locals.basePath, routes);

  const port = listenOpts.port || process.env.ARENA_PORT ||  4567;
  const host= listenOpts.host || process.env.ARENA_HOST || '0.0.0.0'; // Default: listen to all network interfaces.
  if (!listenOpts.disableListen) {
    app.listen(port, host, () => console.log(`Arena is running on port ${port} at host ${host}`));
  }

  return app;
}

if (require.main === module) run();

module.exports = run;
