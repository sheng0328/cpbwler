var async = require('async');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');
var phantom = require('phantom');

var imageName = 'cpbl.png';

var options = {
  parameters: {
    "ignore-ssl-errors": true,
    "ssl-protocol": "any"
  }
};

exports.mining = function(params, callback) {
  phantom.create(options, function (ph) {
    ph.createPage(function (page) {
      var url = 'http://www.cpbl.com.tw/game/box.aspx?gameno=01&year=' + params.year + '&game=' + params.game;
      //var url = 'http://www.cpbl.com.tw/game/box.aspx?gameno=01&year=2015&game=1';
      page.set('viewportSize', { width: 1024, height: 768 });
      //page.set('clipRect', { top: 70, left: 268, width: 1024, height: 1080 });
      page.open(url, function (status) {
        //console.log(page);
        //console.log('processing...');

        setTimeout(function() {
          async.auto({
            status: function(callback) {
              callback(null, status);
            },
            title: function(callback) {
              getTitle(page, callback);
            },
            content: function(callback) {
              getContent(page, callback);
            },
            // info: function(callback) {
            //   getInfo(page, callback);
            // },
            render: function(callback) {
              renderImage(page, callback);
            }
          }, function(err, results) {
            setTimeout(function() {
              var data = {
                year: params.year,
                game: params.game
                date: '',
                day: '',
                team1: '',
                score1: '',
                team2: '',
                score2: '',
                location: '',
                time: '',
                att: '',
              };

              if (results.title === '系統錯誤') {
                data = null;
              } else {
                $ = cheerio.load(results.content, { ignoreWitespace: true });
                if (_.trim($('.main').find('p').text())) {
                  var a = $('.info01').find('td').text().split('\n');
                  var _1 = _.trim(a[1]);
                  var _3 = _.trim(a[3]);
                  var _4 = _.trim(a[4]);
                  var _6 = _.trim(a[6]);
                  var _7 = _.trim(a[7]);
                  var _9 = _.trim(a[9]);

                  data.date = _1.split('．')[0].replace(/ /g, '');
                  data.day = _1.split('．')[1];
                  data.team1 = _3;
                  data.score1 = _4;
                  data.team2 = _6;
                  data.score2 = _7;
                  data.location = _9;

                  var b = $('.main').find('p').text().split('\n');
                  var _tt = '';
                  var _time = '';
                  var _att = '';
                  for (var i = 0; i < b.length; i++) {
                    if (_.startsWith(_.trim(b[i]), 'TIME')) {
                      _tt = _.trim(b[i]);
                    }
                  }
                  var _temp = _tt.split('TIME: ')[1].split('ATT: ');
                  _time = _temp[0];
                  _att = _temp[1];
                  data.time = _time;
                  data.att = _att;

                  //console.log(data);
                }
              }
              ph.exit();
              callback(null, data);
            }, 500);

          });
        }, 2000);
      });
    });
  });
};

function getTitle(page, callback) {
  page.evaluate(function() {
    return document.title;
  },
  function(result) {
    callback(null, result);
  });
}

function getContent(page, callback) {
  page.getContent(function(data) {
    callback(null, data);
  });
}

function getInfo(page, callback) {
  page.evaluate(function() {
    var info = document.getElementsByClassName("info01");

    return info[0].innerText;
  },
  function(result) {
    callback(null, result);
  });
}

function renderImage(page, callback) {
  //console.log('=== render image ===');
  //page.sendEvent('mousemove', 899, 500);
  //page.sendEvent('click');

  //page.render(imageName);

  callback(null, imageName);
}
