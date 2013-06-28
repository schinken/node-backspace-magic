var Udpio = require('./Udpio')
   ,Door  = require('./components/Door')
   ,Heater = require('./components/Heater');

var doorcontrol = new Door();
var heater = new Heater();

var udp_events = new Udpio('AIO0');

udp_events.on('doorlock', function(val) {
    doorcontrol.lock(val);
});

udp_events.on('doorframe', function(val){
    doorcontrol.frame(val);
});

udp_events.on('doorbutton', function(val){
    doorcontrol.button(val);
});
