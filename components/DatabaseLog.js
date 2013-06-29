var  settings = require('../settings')
    ,mysql = require('mysql');

var DatabaseLog = function(logger) {
    this.logger = logger;
    this.connection = this.connect();
};

DatabaseLog.prototype.handleDisconnect = function(connection) {

    var that = this;

    connection.on('error', function(err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }

        that.logger.error('Re-connecting lost connection: ' + err.stack);
        that.connection = that.connect();
    });
}

DatabaseLog.prototype.connect = function() {

    this.logger.info('Establishing connection to '+settings.db.host);

    var connection = mysql.createConnection({
        host:       settings.db.host,
        database:   settings.db.database,
        user:       settings.db.user,
        password:   settings.db.password
    });

    this.handleDisconnect(connection);
    connection.connect();

    return connection;
};

DatabaseLog.prototype.logEvent = function(contact, value) {

    var log = this.logger;

    log.info('Logging contact '+contact);

    var query = this.connection.query('INSERT INTO contactors SET ?', {
        'contact': contact,
        'status': val,
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
