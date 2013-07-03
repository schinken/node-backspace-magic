var settings = require('../settings')
   ,Webrelais = require('../Webrelais');

var DoorBell = function(logger) {

    this.logger = logger;

    this.space_open = false;
    this.wr = new Webrelais(settings.relais_host);
};

DoorBell.prototype.space_status = function(status) {
    this.space_open = status;
};

DoorBell.prototype.ring = function(val) {
    
    var that = this;

    if(val) {
        this.logger.info('Doorbell is ringing');

        // Switch on alarm light
        this.logger.info('Switching on alarm light');
        this.wr.set_port(settings.relais.alarm, 1);
        setTimeout(function() {
            that.logger.info('Switching off alarm light');
            that.wr.set_port(settings.relais.alarm, 0);
        }, 5*1000);

        // Blink exitlight
        this.logger.info('Toggeling exitlight');
        this.wr.get_port(settings.relais.notleuchte_weiss, function(val) {
            val = (val == 1)? 0 : 1;
            that.blink_exit(val, 7, function() {
                that.logger.info('Toggeling exitlight finished');
            });
        });

        if(!this.space_open) {
            // We can send a mail here 
        }
    }
};

DoorBell.prototype.blink_exit = function(val, amount, cb) {

    var  newval = (val == 1)? 0 : 1
        ,that = this;

    if(amount == 0) {
        cb = cb || function() {};
        cb();
        return;
    }
    
    this.wr.set_port(settings.relais.notleuchte_weiss, val, function() {
        setTimeout(function() {
            that.blink_exit(newval, amount--, cb);    
        }, 800);
    });
    
};

module.exports = DoorBell;
