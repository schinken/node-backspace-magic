var Udpio = require('./Udpio')
   ,Door  = require('./components/Door')
   ,Heater = require('./components/Heater')
   ,winston = require('winston')
   ,settings = require('./settings')
   ,StatusAPI = require('bckspc-status');

var status_api = new StatusAPI(settings.status_api, 120);

var doorcontrol = new Door(winston);
var heater = new Heater(winston);

var udp_events = new Udpio('AIO0', '0.0.0.0', settings.udpio.port, winston);

// Doorcontrol
udp_events.on('doorlock', function(val) {
    doorcontrol.lock(val);
});

udp_events.on('doorframe', function(val){
    doorcontrol.frame(val);
});

udp_events.on('doorbutton', function(val){
    doorcontrol.button(val);
});

// Heater
status_api.on('space_closed', function() {
    header.switch_off();
});

status_api.on('space_opened', function() {
    heater.switch_on();
});
