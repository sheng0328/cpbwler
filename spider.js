var async = require('async');
var crawler = require('./crawler');

async.auto({
  mining: function(callback) {
    miningSync(callback);
  }
}, function(err, results) {
  console.log(JSON.stringify(results.mining));
});


function miningSync(callback) {
  var result = {
    'records': []
  };

  var year = 1990;
  var lastYear = 2015;
  var game = 0;
  var lastGame = 400;

  async.whilst(
    function () {
      return year <= lastYear && game < lastGame;
    },
    function (callback) {
      game ++;
      //console.log('perform');
      var params = {
        year: year,
        game: game
      };
      crawler.mining(params, function(err, data) {
        if (data) {
          //console.log('=== ' + data.year + ', ' + data.game + ' ===');
          console.log(JSON.stringify(data));
          result.records.push(data);
          callback(null, data);
        } else {
          if (year < lastYear) {
            console.log('');
            year ++;
            game = 0;
            callback(null, data);
          } else {
            game = lastGame;
          }
        }
      });
    },
    function (err) {
      callback(err);
    }
  );
}

function mining(callback) {
  var startYear = 1990;
  var endYear = 1990;
  var startGame = 1;
  var endGame = 10;

  var total = (endYear - startYear + 1) * (endGame - startGame + 1);
  var current = 0;
  //console.log(total);
  var result = {
    'records': []
  };

  for (var y = startYear; y <= endYear; y++) {
    for (var g = startGame; g <= endGame; g++) {
      var params = {
        year: y,
        game: g
      };
      crawler.mining(params, function(err, data) {
        if (data) {
          //console.log('=== ' + data.year + ', ' + data.game + ' ===');
          console.log(JSON.stringify(data));
          result.records.push(data);

          current ++;

          if (current === total) {
            callback(null, result);
          }
        }
      });
    }
  }
}
