var summonerTools = function () {};

function avg(numsArray) {
  numsArray = numsArray.map((num) => isNaN(num)  ? 0 : num);
  return {
    most: Math.round(Math.max(...numsArray) * 100) / 100,
    least: Math.round(Math.min(...numsArray) * 100) / 100,
    avg: Math.round(numsArray.reduce((a,b) => a + b) / numsArray.length * 100) / 100
  };
}

summonerTools.recentPerformance = function(games) {
  var result = games.reduce(function(result, game) {
    return game.win ? result.wins++ : result.losses++;
  }, {wins: 0, losses: 0});
  result.avg = result.wins / result.losses;

  var _kills = games.map(game => game.kills);
  var kills = avg(_kills);

  var _deaths = games.map(game => game.deaths);
  var deaths = avg(_deaths);

  var _assists = games.map(game => game.assists);
  var assists = avg(_assists);

  var _cs = games.map(game => game.cs);
  var cs = avg(_cs);

  var _timePlayed = games.map(game => game.timePlayed);
  var timePlayed = avg(_timePlayed);

  return {
    result,
    kills,
    deaths,
    assists,
    cs,
    timePlayed
  };
};

module.exports = summonerTools;
