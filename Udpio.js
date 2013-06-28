var events = require('events')
   ,dgram = require('dgram')
   ,util = require('util');

var UDPIO = function(namespace, ip, port, logger) {

    this.ip = ip || '0.0.0.0';
    this.port = port || 5042;
    this.namespace = namespace;

    this.logger = logger;

    this.udp_client = dgram.createSocket('udp4');

    this.setup();

    logger.log('info', 'Listing on %s:%d', this.ip, this.port);

    this.udp_client.bind(this.port, this.ip);
};

util.inherits(UDPIO, events.EventEmitter);

UDPIO.prototype.setup = function() {
    var that = this;
    this.udp_client.on('message', function(msg) {
        msg = msg.toString();
        var m = msg.match(/\<(\w+):(\w+):([0-9.]+)\>/);
        if(m) {
            var key = m[2];
            var val = (m[3].indexOf('.') !== -1)? parseFloat(m[3]) : parseInt(m[3], 10);

            that.logger.log('info', 'received package %s: %d', key, val);
            that.emit(key, val);
        }
    });
};

UDPIO.prototype.init = function() {
    var msg = new Buffer('<'+this.namespace+':init>');
    this.logger.info('requested init package');
    this.udp_client.send(msg, 0, msg.length, this.port, this.ip);
};

module.exports = UDPIO;
