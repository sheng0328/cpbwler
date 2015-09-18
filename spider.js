var async = require('async');
var crawler = require('./crawler');

async.auto({
  mining: function(callback) {
    mining(callback);
  }
}, function(err, results) {
  //console.log(JSON.stringify(results.mining));
});

function mining(callback) {
  var startYear = 1990;
  var endYear = 1990
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
