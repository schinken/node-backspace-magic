var  settings = require('../settings')
    ,mysql = require('mysql');

var CONNECT_RETRY = 10*1000;

var DatabaseLog = function(logger) {
    this.logger = logger;
    this.connected = false;

    this.connect();
};

DatabaseLog.prototype.connect = function() {

    if(this.connected) {
        this.logger.warn('Already connected. Skipping connect request');
        return false;
    }

    var that = this;
    this.logger.info('Establishing connection to '+settings.db.host);

    this.connection = mysql.createConnection({
        host:       settings.db.host,
        database:   settings.db.database,
        user:       settings.db.user,
        password:   settings.db.password
    });


    this.connection.connect(function(err) {
        that.connected = false;

        if(err) {
            that.logger.error('error when connecting to db:', err);

            setTimeout(function() {
                that.connect();
            }, CONNECT_RETRY);
        } else {
            that.connected = true;
        }
    });

    this.connection.on('error', function(err) {

        that.connected = false;

        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            that.logger.error('Error with errorcode '+err.code+' happed');
        }

        that.logger.warn('Re-connecting lost connection: ' + err.stack);

        setTimeout(function() {
            that.connect();
        }, CONNECT_RETRY);

    });

};

DatabaseLog.prototype.logEvent = function(contact, value) {

    var log = this.logger;

    if(!this.connected) {
        log.error('Unable to log '+contact+', server is not connected');
        return false;
    }

    log.info('Logging contact '+contact);

    var query = this.connection.query('INSERT INTO contactors SET ?', {
        'contact': contact,
        'status': value,
        'erfda': new Date()
    },
    function(err, result) {
        if(err) {
            log.error('Logging contact '+contact+' failed');
            return false;
        }

        log.info('Logged contact '+contact+' sucessfully');
    });
};

module.exports = DatabaseLog;
