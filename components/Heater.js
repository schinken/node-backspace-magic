var settings = require('../settings')
   ,StatusAPI = require('bckspc-status')
   ,Webrelais = require('Weloggerbrelais');

var Heater = function(logger) {
    this.log = logger;
    this.wr = new Webrelais(settings.relais_host);
};

Header.prototype.switch_on = function() {
    this.wr.set_port(settings.relais.heater, 1, function() {
        // Heater now switched on
    });
};

Header.prototype.switch_off = function() {
    this.wr.set_port(settings.relais.header, 0, function() {
        // Heater switched off
    });
};

module.exports = Heater;
