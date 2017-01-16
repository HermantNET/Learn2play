// dependencies
const express = require('express');
const app = express();
const hbs = require('express-hbs');
const path = require('path');
const ncache = require('node-cache');
// *-------------------------------------------------------------------------*

// settings
const port = 3000;
global.summonerCache = new ncache({
  stdTTL: 1209600, // 2 Weeks
  checkperiod: 86400 // 24 hours
});
// *-------------------------------------------------------------------------*

// View Engine
app.set('view engine', 'hbs');

app.engine('hbs', hbs.express4({
  defaultLayout: './views/layouts/default.hbs',
  partialsDir: './views/partials',
  layoutsDir: './views/layouts'
}));

app.set('views', path.join(__dirname, '/views'));
// *-------------------------------------------------------------------------*

// routing
const routes = require('./routes.js');

app.use('/', routes);
// *-------------------------------------------------------------------------*

// start server
app.listen(port, function() {
  console.log(`Running on port ${port}. Ctrl-c to exit.`);
});
