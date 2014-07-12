var Udpio = require('./Udpio')
   ,Door  = require('./components/Door')
   ,DatabaseLog = require('./components/DatabaseLog')
   ,winston = require('winston')
   ,settings = require('./settings')
   ,StatusAPI = require('bckspc-status')
   ,Schild = require('./Schild');

require('winston-syslog').Syslog;


process.title = 'bckspc-magic';


var logger = new winston.Logger;

logger.add(winston.transports.Syslog);
logger.add(winston.transports.Console, {
  colorize: true,
  timestamp: true
});

var status_api = new StatusAPI(settings.status_api, 120);

var doorcontrol = new Door(logger);

var dblog = new DatabaseLog(logger);

var schild = new Schild('schild', 10003, logger);

var udp_events = new Udpio('AIO0', settings.udpio.port, settings.udpio.ip, logger);

// Request packages on init
udp_events.init();

// Doorcontrol
udp_events.on('doorlock', function(val) {
    doorcontrol.lock(val);
    dblog.logEvent('SCHLOSS', val);
});

udp_events.on('doorframe', function(val){
    doorcontrol.frame(val);
    dblog.logEvent('RAHMEN', val);
});

udp_events.on('doorbutton', function(val){
    doorcontrol.button(val);
    dblog.logEvent('TASTER', val);
});

udp_events.on('backlock', function(val){
    dblog.logEvent('BACKLOCK', val);
});

// Heater
status_api.on('space_closed', function() {
    schild.standBy();
});

status_api.on('space_opened', function() {
    schild.on();
});
