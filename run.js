// dependencies
const express = require('express');
const app = express();
const hbs = require('express-hbs');
const path = require('path');
const ncache = require('node-cache');
const RiotAPI = require('./riot_api.js');
// *-------------------------------------------------------------------------*

// config
const port = 4000;
global.summonerCache = new ncache({
  stdTTL: 1209600, // 2 Weeks
  checkperiod: 86400 // 24 hours
});

app.set('views', path.join(__dirname, '/views'));
app.use(express.static('public'));

RiotAPI.Champions();
// *-------------------------------------------------------------------------*

// View Engine
app.set('view engine', 'hbs');

app.engine('hbs', hbs.express4({
  defaultLayout: './views/layouts/default.hbs',
  partialsDir: './views/partials',
  layoutsDir: './views/layouts'
}));

hbs.registerHelper('section', function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    });
// *-------------------------------------------------------------------------*

// routing
const routes = require('./routes.js');

app.use('/', routes);
// *-------------------------------------------------------------------------*

// start server
app.listen(port, function() {
  console.log(`Running on port ${port}. Ctrl-c to exit.`);
});
