var dgram = require('dgram');

var Schild = function(host, port, logger) {
    this.host = host;
    this.port = port;
    this.logger = logger;
};

Schild.prototype.off = function() {
    this.logger.info('Switching schild off');
    this._sendMessage('0');
};

Schild.prototype.on = function() {
    this.logger.info('Switching schild on');
    this._sendMessage('2');
};

Schild.prototype.standBy = function() {
    this.logger.info('Switching schild to standby');
    this._sendMessage('1');
};

Schild.prototype._sendMessage = function(msg) {

    var message = new Buffer(str);
    var client = dgram.createSocket("udp4");
    client.send(message, 0, message.length, this.port, this.host, function(err, bytes) {
          client.close();
    });
};

module.exports = Schild;
