var settings = require('../settings')
   ,StatusAPI = require('bckspc-status')
   ,Webrelais = require('../Webrelais');

var HEATER_ON = 0;
var HEATER_OFF = 1;

var Heater = function(logger) {
    this.logger = logger;
    this.wr = new Webrelais(settings.relais_host);
};

Heater.prototype.switch_on = function() {
    var log = this.logger;
    log.info('Switching on heater');
    this.wr.set_port(settings.relais.heater, HEATER_ON, function() {
        // Heater now switched on
        log.info('Heater is now ON');
    });
};

Heater.prototype.switch_off = function() {
    var log = this.logger;
    log.info('Switching off heater');
    this.wr.set_port(settings.relais.heater, HEATER_OFF, function() {
        // Heater switched off
        log.info('Heater is now OFF');
    });
};

module.exports = Heater;
