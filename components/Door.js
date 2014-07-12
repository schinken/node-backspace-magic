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

        // If close was requested and door was closed (frame not locked)
        if(this.close_requested) {
            
            this.logger.info('Close was requested by button');

            // we need to clear the previous timeout
            if(this.close_request_timeout) {
                clearTimeout(this.close_request_timeout);
                this.close_request_timeout = false;
            }

            this.close_requested = false;
            this.door_lock(DOOR_LOCK);
        }

        this.inframe = true;
    } else {
        this.logger.info('Door has been opened');

        this.inframe = false;
    }
};

Door.prototype.lock = function(val) {
    
    var that = this;

    if(val) {
        this.logger.info('Door has been locked');
        this.locked = true;
    } else {
        this.logger.info('Door has been unlocked');
        this.locked = false;
    }
};

Door.prototype.button = function(val) {

    var that = this;

    if(val) {

        this.logger.info('Button has been pressed');

        if(!this.inframe && !this.close_requested) {
            this.logger.info('Door is unlocked: processing close');

            this.close_requested = true;

            // Button pressed + door is open; deferring close Request
            this.close_request_timeout = setTimeout(function() {
                that.logger.warn('Close processing failed, timeout');

                that.close_requested = false;
                that.close_request_timeout = false;
            }, 5*60*1000);
        }

        this.button_pressed = true;

    } else {
        // Button released
        this.button_pressed = false;
    }
};

Door.prototype.door_lock = function(lock) {

    var that = this;

    if(lock == DOOR_UNLOCK) {
        var action = 'Open';
        this.logger.info('Processing door open');
    } else {
        var action = 'Close';
        this.logger.info('Processing door close');
    }


    var post_data = querystring.stringify({
        'type':     action,
        'password': settings.door.pass,
        'nickname': settings.door.nickname,
        'userid':   settings.door.userid
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
            that.logger.info('Processed '+action+' request');
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
  
};


module.exports = Door;
