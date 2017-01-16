const express = require('express');
const router = express.Router();
const RiotAPI = require('./riot_api.js');
const summFuncs = require('./app/summoner.js');

router.get('/', function(req, res) {
  var data = {
    title: "learn2play"
  };
  res.render('index', data);
});

router.get('/:region/:name', function(req, res) {
  var summoner = summonerCache.get(`${req.params.region.toUpperCase()}/${req.params.name.toLowerCase()}`);

  if(summoner === undefined) {
    RiotAPI.SummByName(req.params.region, req.params.name)
      .then(function(body) {
        if(body === undefined) {
          res.render('notFound', req.params);
          return;
        }
        summoner = body[req.params.name.toLowerCase().replace(/ /g,'')];
        summoner.region = req.params.region.toUpperCase();

        RiotAPI.RecentGames(summoner.region, summoner.id)
          .then(function(recentGames) {
            summoner.recentGames = recentGames;
            summoner.recentPerformance = summFuncs.recentPerformance(recentGames);

            RiotAPI.SummRank(summoner.region, summoner.id)
              .then(function(ranked) {
                if(ranked.status === undefined) {
                  ranked = ranked[summoner.id].find(function(queue) {
                    return queue.queue === "RANKED_SOLO_5x5";
                  });
                } else {
                  ranked = null;
                }
                if(ranked === null) {
                  summoner.ranked = { ranked: "unranked" };
                } else {
                  summoner.ranked = {
                    ranked: "ranked",
                    name: ranked.name,
                    tier: ranked.tier,
                    leaguePoints: ranked.entries[0].leaguePoints,
                    division: ranked.entries[0].division,
                    wins: ranked.entries[0].wins,
                    losses: ranked.entries[0].losses
                  };
                }
                res.render('summoner', summoner);
                summonerCache.set(`${summoner.region}/${summoner.name.toLowerCase()}`, summoner, function(err, success) {
                  if(!err && success) {
                    console.log(`Cached ${summoner.region}/${summoner.name}`);
                  } else {
                    console.log(`Error caching ${summoner.region}/${summoner.name}`);
                  }
                });
              });
          });
      });
  } else {
    res.render('summoner', summoner);
  }
});

module.exports = router;
