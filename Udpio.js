var events = require('events')
   ,dgram = require('dgram')
   ,util = require('util');

var INIT_ID_UNAVAILABLE = -1;
var INIT_TOKEN = 'init';

var UDPIO = function(namespace, port, logger) {

    this.reMessage = new RegExp(namespace+",(\\d+),(\\w+),(\\d+)", 'i');

    this.ip = '255.255.255.255';
    this.port = port || 5042;
    this.namespace = namespace;

    this.initId = INIT_ID_UNAVAILABLE;
    this.logger = logger;

    var udp_client = dgram.createSocket('udp4');
    udp_client.bind(this.port, this.ip, function() {
        udp_client.setBroadcast(true);    
    });

    this.udp_client = udp_client;

    this.setup();

    logger.log('info', 'Listing on %s:%d', this.ip, this.port);
};

util.inherits(UDPIO, events.EventEmitter);

UDPIO.prototype.setup = function() {
    var that = this;
    this.udp_client.on('message', function(msg) {

        var m = msg.toString().match(that.reMessage);
        if(m && (m[1] == 0 || m[1] == that.initId)) {
            this.initId = INIT_ID_UNAVAILABLE;

            var key = m[2];
            var val = (m[3].indexOf('.') !== -1)? parseFloat(m[3]) : parseInt(m[3], 10);

            that.logger.log('info', 'received package %s: %d', key, val);
            that.emit(key, val);
        }
    });
};

UDPIO.prototype.init = function() {
    this.initId = parseInt(Math.random()*10000, 10);
    var msg = new Buffer([this.namespace, this.initId, INIT_TOKEN, 1].join());
    this.logger.info('requested init package');
    this.udp_client.send(msg, 0, msg.length, this.port, this.ip);
};

module.exports = UDPIO;
