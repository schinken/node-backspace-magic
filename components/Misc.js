var settings = require('../settings')
   ,Webrelais = require('../Webrelais');

var Misc = function(logger) {

    this.logger = logger;

    this.space_open = false;
    this.wr = new Webrelais(settings.relais_host);
};

Misc.prototype.space_status = function(status) {
    this.space_open = status;
};

Misc.prototype.alarm = function(val) {
    
    var that = this;

   this.logger.info('Alarm triggered');

   // Switch on alarm light
   this.logger.info('Switching on alarm light');
   this.wr.set_port(settings.relais.alarm, 1);
   setTimeout(function() {
      that.logger.info('Switching off alarm light');
      that.wr.set_port(settings.relais.alarm, 0);
   }, 5*1000);
};

module.exports = Misc;
