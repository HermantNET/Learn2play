const fetch = require('node-fetch');
const key = require('./confidential.json').RiotApiKey;

// api request tracking
var requestsRemaining = 500;
var requestTimer = setInterval(function() {
  requestsRemaining = 500;
}, 600000);

function MakeRequest(count = 1) {
  if (requestsRemaining === 0) return Promise.resolve("Maximum Riot API requests exceeded.");
  requestsRemaining -= count;
  console.log(`${requestsRemaining} request remaining.`);
}
// *-------------------------------------------------------------------------*

// Riot API interfacing object
// Methods should return a Promise
const RiotAPI = [];

RiotAPI.Champions = function() {
  fetch(`https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?locale=en_US&champData=image&api_key=${key}`)
    .then(function(res) {
        return res.json();
    })
    .then(function(champions) {
      summonerCache.set('champions', champions.data, function(err, success) {
        if(!err && success) {
          console.log('Cached champions');
        } else {
          console.log('Error caching champions');
        }
      });
    });
};

RiotAPI.SummByName = function(region, name) {
  MakeRequest();
  return fetch(`https://${region}.api.pvp.net/api/lol/${region}/v1.4/summoner/by-name/${name}?api_key=${key}`)
    .then(function(res) {
      return res.json();
    })
    .then(function(body) {
      if (body.status !== undefined) return undefined;
      return body;
    });
};

RiotAPI.RecentGames = function(region, id) {
  MakeRequest();
  return fetch(`https://${region}.api.pvp.net/api/lol/${region}/v1.3/game/by-summoner/${id}/recent?api_key=${key}`)
    .then(function(res) {
      return res.json();
    })
    .then(function(body) {
      body.champions = summonerCache.get('champions');
      return body;
    })
    .then(function(body) {
      var games = body.games;
      var gameList = [];
      for(var i = 0; i < games.length; i++) {
        var game = games[i];
        var champion = null;

        for(var champ in body.champions) {
          if(game.championId === body.champions[champ].id) {
            champion = body.champions[champ];
            break;
          }
        }

        gameList.push({
          champion: champion,
          win: game.stats.win,
          kills: game.stats.championsKilled || 0,
          assists: game.stats.assists || 0,
          deaths: game.stats.numDeaths || 0,
          timePlayed: Math.floor(game.stats.timePlayed / 60),
          cs: (game.stats.minionsKilled || 0) + (game.stats.neutralMinionsKilled || 0),
          mode: game.gameMode,
          type: game.subType,
          date: game.createDate
        });
      }
      return gameList;
    });
};

RiotAPI.SummRank = function(region, id) {
  MakeRequest();
  return fetch(`https://${region}.api.pvp.net/api/lol/${region}/v2.5/league/by-summoner/${id}/entry?api_key=${key}`)
  .then(function(res) {
    return res.json();
  });
};

module.exports = RiotAPI;
