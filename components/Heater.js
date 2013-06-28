var settings = require('../settings')
   ,StatusAPI = require('bckspc-status')
   ,Webrelais = require('Webrelais');

var Heater = function() {
    
    var api = new StatusAPI(settings.status_api, 120);
    var wr = new Webrelais(settings.relais_host);

    api.on('space_closed', function() {
        wr.set_port(settings.relais.heater, 1, function() {
            // Heater now switched on
        });
    });

    api.on('space_opened', function() {
        wr.set_port(settings.relais.heater, 0, function() {
            // Heater switched off
        });
    });
};

module.exports = Heater;
