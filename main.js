var Udpio = require('Udpio')
   ,Door  = require('./components/Door');

var doorcontrol = new Door();
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
