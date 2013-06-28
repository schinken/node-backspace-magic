var https = require('https')
   ,querystring = require('querystring')
   ,settings = require('../settings')
   ,Webrelais = require('Webrelais');

var DOOR_UNLOCK = false;
var DOOR_LOCK = true;

var Door = function() {

    this.frame = false;
    this.lock = false;
    this.button = false;

    this.close_requested = false;
    this.close_request_timeout = false;

    this.wr = new Webrelais(settings.relais_host);
};

Door.prototype.frame = function(val) {
    
    if(val) {

        // If close was requested and door was closed (frame not locked)
        if(this.close_requested) {
            
            // we need to clear the previous timeout
            if(this.close_request_timeout) {
                clearTimeout(this.close_request_timeout);
                this.close_request_timeout = false;
            }

            this.close_request = false;
            this.door_lock(DOOR_LOCK);
        }

        this.frame = false;
    } else {
        this.frame = true;
    }
};

Door.prototype.lock = function(val) {
    
    if(val) {
        this.locked = true;
    } else {

        if(this.locked) {
            // Door was locked previously, switch on light for 5 min
            this.wr.set_port(settings.relais.notleuchte_weiss, 1, function() {
                // Notleuchte ist an...
                setTimeout(function() {
                    this.wr.set_port(settings.relais.notleuchte_weiss, 0, function() {
                        // Notleuchte ist aus
                    });
                }, 5*60*1000);
            });
        }

        this.locked = false;
    }
};

Door.prototype.button = function(val) {

    if(val) {

        // if door is locked open the door
        if(this.locked) {
            this.door_lock(DOOR_UNLOCK);
        }

        if(!this.frame) {
            // Button pressed + door is open; deferring close Request
            this.close_request_timeout = setTimeout(function() {
                this.close_requested = false;
                this.close_request_timeout = false;
            }, 5*60*1000);
        }

        this.button = true;

    } else {
        // Button released
        this.button = false;
    }
};

Door.prototype.door_lock = function(lock) {

    if(lock == DOOR_UNLOCK) {
        var action = 'Open';
    } else {
        var action = 'Close';
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
            // Door should log now
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
  
};


module.exports = Door;
