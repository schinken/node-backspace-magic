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

   if(!this.space_open) {
      return false;
   }
   
   var that = this;

   this.logger.info('Alarm triggered');

   // Blink alarmlight
   this.wr.get_port(settings.relais.alarm, function(val) {
      val = (val == 1)? 0 : 1;
      that.blink_alarm(val, 6, function() {
         that.logger.info('Toggeling alarmlight finished');
      });
   });
};

Misc.prototype.blink_alarm = function(val, amount, cb) {

    var  newval = (val == 1)? 0 : 1
        ,that = this;

    if(amount <= 0) {
        cb = cb || function() {};
        cb();
        return;
    }
    
    this.wr.set_port(settings.relais.alarm, val, function() {
        setTimeout(function() {
            that.blink_alarm(newval, amount-1, cb);    
        }, 500);
    });
    
};

module.exports = Misc;
