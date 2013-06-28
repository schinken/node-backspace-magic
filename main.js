var Udpio = require('./Udpio')
   ,Door  = require('./components/Door')
   ,Heater = require('./components/Heater');

var status_api = new StatusAPI(settings.status_api, 120);

var doorcontrol = new Door();
var heater = new Heater();

var udp_events = new Udpio('AIO0');

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
