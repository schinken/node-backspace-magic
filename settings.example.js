module.exports = {
   'door': {
       'host': 'door.bckspc.de',
       'path': '/verify_pw',
       'pass': ''
    },

    'snmp_host': '10.1.20.1',
    'relais_host': 'https://webrelais.bckspc.de',
    'status_api': 'http://status.bckspc.de/status.php?response=json',
    'relais': {
        'notleuchte_weiss': 3,
        'heizung':          6
    },
    'db': {
        'host'     : 'violet',
        'database' : 'spaceportal',
        'user'     : 'contactors',
        'password' : ''
    }

};
