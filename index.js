var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var accountSid = 'AC5f2391649a6b0d4c7819a336efb47041';
var authToken = '46ab3eb0b47adc2d4357981557dd9c3d';
var client = require('twilio')(accountSid, authToken);

var port = 80;

app.use(morgan('combined'));

app.use(bodyParser.text({ type: 'text/html' }));

var xmlParser = bodyParser.text({ type: 'text/xml' });

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/play', xmlParser, function (req, res) {
	res.sendFile(path.join(__dirname + '/public/assets/voice.xml'));
});

app.post('/call', urlencodedParser, function(req, res) {

	var fromNumber = req.body.from;
	var toNumber = req.body.to;

	client.calls.create({
		url: 'https://app-gemidao.wedeploy.io/play',
		from: '+55' + fromNumber,
		to: '+55' + toNumber
	}, function(err, call) {

		if( call.sid ) {
			res.send('Mensagem enviada com sucesso!');
		} else {
			res.send('Houve um erro ao enviar a mensagem!');
		}

		res.status(200).end();

		console.log(err);
		console.log(call);
	});

});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
