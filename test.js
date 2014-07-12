var Ledboard = require('./Ledboard.js');

var led = new Ledboard('api.ledboard.bckspc.de');
led.send_text('test');
