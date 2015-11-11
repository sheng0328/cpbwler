var _ = require('lodash');
var url = require('url');

var performRequest = function(uri, callback) {
	var http = require(_.startsWith(url.protocol, 'https')? 'https' : 'http');

	var requestBody = {};

	var options = url.parse(uri);
	options.method = 'POST';
	options.headers = {
		//'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Type': 'text/html',
		'Content-Length': Buffer(JSON.stringify(requestBody), 'utf-8').length,
	};

  console.log(options);

  var data = {};
	var req = http.request(options, function(res) {
    var body = '';
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      console.log('Successfully processed HTTPS response');
			data.status = res.statusCode;
			if (res.headers.location) {
				data.location = res.headers.location;
			}
      data.body = body;

      callback(null, data);
    });
  });
  req.on('error', function(err) {
    callback(err);
  });

  if (requestBody) {
    req.write(JSON.stringify(requestBody));
  }
  req.end();
}

//var uri = 'http://pchome.megatime.com.tw/stock/sid2330.html?is_check=1';
//var uri = 'http://stock.pchome.com.tw/set_cookie.php?is_need_login=0&key=YToyOntzOjI6Iml2IjtzOjg6IjhpNZ7oCzo_IjtzOjU6ImNyeXB0IjtzOjE0ODoiG%2ASj6D0BLKvl3s61z9hi5h5ZhNgXjWIuHuqrf7rRrzQIm0au%2AsAF7Kaq2RX80tnHz9k4LtC5Xf0tmSQzUHFalzfc8yWjzMQSSI_Bgo7nVgFebJD7i7cVCjqM7isDfcXikm8%2AygJyap01b3DF1t05RdpojTGvx%2AMIiAEZ23srRtT24CI_e4YIekWijXuoP2IWVyhi5iI7fQ%3D%3D';
//var uri = 'http://stock.pchome.com.tw/set_cookie.php?is_need_login=0&key=YToyOntzOjI6Iml2IjtzOjg6ImIei3%2AYy458IjtzOjU6ImNyeXB0IjtzOjE1OToim%2AIPBuoOlKhs36Rtscces0TevvusHSRTzX4NtlExRGR2I0MPDFm_maItM3hS6DK86zk1vEkOv4vYjjXyreYKwArFIc4knPAfWZigQbNjioxU5rw3N%2A4dw4JKy4Oxsi86SZLivqIA7ni2bcmfHUZ42AmEET20Jd63LlRfL%2AliYVD61XQn0zBbKrtj1mEA_j45YbSgBdt5us7t2IS9iumJIjt9';
//var uri = 'http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2353.tw';
var uri = 'http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2330.tw&json=1&delay=0';
performRequest(uri, function(err, data) {
  console.log(data);
});
