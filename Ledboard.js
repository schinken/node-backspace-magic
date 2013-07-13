var  http   = require('http')
    ,url    = require('url');

var Ledboard = function(host) {
    this.host = host;
};

Ledboard.prototype.send_text = function(text, callback) {

    callback = callback || function() {};

    var options = {
        hostname: this.host,
        protocol: 'http:',
        method: 'GET',
        path: '/send_text?message='+text,
        headers: {'Content-length': 0}
    };

    // Set up the request
    var req = http.request(options, function(res) {
    
        // I need to read data to receive an "end"? Oo
        res.on('data', function(chunk) {});

        res.setEncoding('utf8');
        res.on('end', function () {
            callback();
        });
    });

    req.end();
};

module.exports = Ledboard;
