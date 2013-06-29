
var  util   = require('util')
    ,https  = require('https')
    ,http   = require('http')
    ,url    = require('url');


var  RESET  = 'DELETE'
    ,GET    = 'GET'
    ,SET    = 'POST';

var Webrelais = function(baseurl) {
    this.baseurl  = baseurl;
    this.username = false;
    this.password = false;
};


Webrelais.prototype.authenticate = function(username, password) {
    this.username = username;
    this.password = password;
};

Webrelais.prototype.needs_auth = function() {
    return (this.username && this.password);
};

Webrelais.prototype.send_command = function(path, type, callback) {

    var options     = url.parse(this.baseurl + path);
    options.method  = type;
    options.headers = {'Content-length': 0};

    if(this.needs_auth()) {
        options['auth'] = this.username + ":" + this.password;
    }

    var http_s = options.protocol=='https:' ? https : http;

    // Set up the request
    var client = this;
    var req = http_s.request(options, function(res) {
    
        // I need to read data to receive an "end"? Oo
        res.on('data', function(chunk) {});

        res.setEncoding('utf8');
        res.on('end', function () {
            callback();
        });
    });

    req.end();
};

Webrelais.prototype.set_port = function(port, value, callback) {

    if(value == 0) {
        this.reset_port(port, callback);
        return;
    }

    this.send_command('/relais/' + port, SET, callback);
};


Webrelais.prototype.set_ports = function(value, callback) {

    if( value == 0 ) {
        this.reset_ports( callback );
        return;
    }  

    this.send_command('/relais', SET, callback);
};

Webrelais.prototype.reset_port = function(port, callback) {
    this.send_command('/relais/' + port, RESET, callback);
};

Webrelais.prototype.reset_ports = function( port, callback ) {
    this.send_command('/relais', RESET, callback);
};

Webrelais.prototype.get_port = function(port, callback) {
    this.send_command('/relais/' + port, GET, callback); 
};

Webrelais.prototype.get_ports = function( callback ) {
    this.send_command('/relais', GET, callback);
};


module.exports = Webrelais;
