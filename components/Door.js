var https = require('https')
   ,querystring = require('querystring')
   ,settings = require('../settings')
   ,Webrelais = require('../Webrelais');

var DOOR_UNLOCK = false;
var DOOR_LOCK = true;

var Door = function(logger) {

    this.logger = logger;

    this.inframe = false;
    this.locked = false;
    this.button_pressed = false;

    this.close_requested = false;
    this.close_request_timeout = false;

    this.wr = new Webrelais(settings.relais_host);
};

Door.prototype.frame = function(val) {
    
    if(val) {
        this.logger.info('Door has been closed');
        this.inframe = true;
    } else {
        this.logger.info('Door has been opened');

        // If close was requested and door was closed (frame not locked)
        if(this.close_requested) {
            
            this.logger.info('Close was requested by button');

            // we need to clear the previous timeout
            if(this.close_request_timeout) {
                clearTimeout(this.close_request_timeout);
                this.close_request_timeout = false;
            }

            this.close_request = false;
            this.door_lock(DOOR_LOCK);
        }

        this.inframe = false;
    }
};

Door.prototype.lock = function(val) {
    
    if(val) {
        this.logger.info('Door has been locked');
        this.locked = true;
    } else {

        this.logger.info('Door has been unlocked');

        if(this.locked) {
            // Door was locked previously, switch on light for 5 min
            this.logger.info('Switching on white light in hackcenter');
            this.wr.set_port(settings.relais.notleuchte_weiss, 1, function() {
                // Notleuchte ist an...
                this.logger.info('White light switched on');
                setTimeout(function() {
                    this.wr.set_port(settings.relais.notleuchte_weiss, 0, function() {
                        // Notleuchte ist aus
                        this.logger.info('Switching off white light in hackcenter');
                    });
                }, 5*60*1000);
            });
        }

        this.locked = false;
    }
};

Door.prototype.button = function(val) {

    if(val) {

        this.logger.info('Button has been pressed');

        // if door is locked open the door
        if(this.locked) {
            this.logger.info('Door is locked: opening');
            this.door_lock(DOOR_UNLOCK);
        }

        if(!this.inframe) {
            this.logger.info('Door is unlocked: processing close');

            // Button pressed + door is open; deferring close Request
            this.close_request_timeout = setTimeout(function() {
                this.logger.warn('Close processing failed, timeout');

                this.close_requested = false;
                this.close_request_timeout = false;
            }, 5*60*1000);
        }

        this.button_pressed = true;

    } else {
        // Button released
        this.button_pressed = false;
    }
};

Door.prototype.door_lock = function(lock) {

    if(lock == DOOR_UNLOCK) {
        var action = 'Open';
        this.logger.info('Processing door open');
    } else {
        var action = 'Close';
        this.logger.info('Processing door close');
    }


    var post_data = querystring.stringify({
        'type':     action,
        'password': settings.door.pass
    });

    var post_options = {
        host: settings.door.host,
        port: '443',
        path: settings.door.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('end', function () {
            // Door should lock now
            this.logger.info('Processed '+action+' request');
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
  
};


module.exports = Door;
