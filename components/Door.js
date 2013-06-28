var https = require('https')
   ,querystring = require('querystring');


var Door = function() {

    this.frame = false;
    this.lock = false;
    this.button = false;

    this.close_requested = false;
    this.close_request_timeout = false;
};

Door.prototype.frame = function(val) {
    
    if(val) {

        if(this.close_requested) {
            
            if(this.close_request_timeout) {
                // we need to clear the previous timeout
                clearTimeout(this.close_request_timeout);
                this.close_request_timeout = false;
            }

            this.close_request = false;
            this.door_lock(true);
        }

        this.door = false;
    } else {
        this.door = true;
    }
};

Door.prototype.lock = function(val) {
    
    if(val) {
        this.locked = true;
    } else {

        if(this.locked) {
            // Door was locked previously, switch on light for 5 min
        }

        this.locked = false;
    }
};

Door.prototype.button = function(val) {

    if(val) {

        if(this.locked && !this.frame) {
            this.door_lock(true);          
        } else {
            // Request triggered but door is not locked
        }

        if(this.frame) {
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
    
};


module.exports = Door;
