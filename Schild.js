var dgram = require('dgram');

var Schild = function(host, port) {
    this.host = host || 'schild';
    this.port = port || 10003;
};

Schild.prototype.off = function() {
    this._sendMessage('0');
};

Schild.prototype.on = function() {
    this._sendMessage('2');
};

Schild.prototype.standBy = function() {
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
