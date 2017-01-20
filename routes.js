const express = require('express');
const router = express.Router();
const RiotAPI = require('./riot_api.js');
const summTools = require('./app/summonerTools.js');

router.get('/', function(req, res) {
  var data = {
    title: "Learn2play"
  };
  res.render('index', data);
});

router.get('/about', function(req, res) {
  res.render('about');
});

router.get('/:region/:name/refresh', function(req, res) {
  summonerCache.del(`${req.params.region.toUpperCase()}/${req.params.name.toLowerCase()}`);
  res.redirect(`/${req.params.region}/${req.params.name}`);
});

router.get('/:region/:name', function(req, res) {
  var region = req.params.region;
  var name = req.params.name;
  var summoner = summonerCache.get(`${req.params.region.toUpperCase()}/${req.params.name.toLowerCase()}`);

  if(summoner === undefined) {
    var id;
    RiotAPI.SummByName(region, name)
      .then(function(summ) {
        summoner = summ[req.params.name.toLowerCase().replace(/ /g,'')];
        summoner.region = region.toUpperCase();
        id = summoner.id;
        return RiotAPI.RecentGames(region, id);
      })
      .then(function(recentGames) {
        summoner.recentGames = recentGames;
        summoner.recentPerformance = summTools.recentPerformance(recentGames);
        return RiotAPI.SummRank(region, id);
      })
      .then(function(ranked) {
        ranked = ranked.status === undefined
          ? ranked[summoner.id].find((queue) => queue.queue === "RANKED_SOLO_5x5")
          : null;
        summoner.ranked = ranked === null
          ? { ranked: "unranked" }
          : {
              ranked: "ranked",
              name: ranked.name,
              tier: ranked.tier,
              leaguePoints: ranked.entries[0].leaguePoints,
              division: ranked.entries[0].division,
              wins: ranked.entries[0].wins,
              losses: ranked.entries[0].losses
            };
        return RiotAPI.TopChamps(region, id);
      })
      .then(function(topChamps) {
        summoner.topChamps = topChamps;
      })
      .then(function() {
        summoner.lastUpdated = Date.now();
        res.render('summoner', summoner);
        summonerCache.set(`${summoner.region}/${summoner.name.toLowerCase()}`, summoner, function(err, success) {
          if(!err && success) {
            console.log(`Cached ${summoner.region}/${summoner.name}`);
          } else {
            console.log(`Error caching ${summoner.region}/${summoner.name}`);
          }
        });
      });
  } else {
    render('summoner', summoner);
  }
});

router.get('/*', function(req, res) {
  res.redirect('/');
});

module.exports = router;
