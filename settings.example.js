module.exports = {
   'door': {
       'host': 'door.bckspc.de',
       'path': '/verify',
       'pass': ''
    },
    'udpio': {
        'port': 5042  
    },
    'relais_host': 'https://webrelais.bckspc.de',
    'status_api': 'http://status.bckspc.de/status.php?response=json',
    'relais': {
        'notleuchte_weiss': 3,
        'notleuchte_rot':   4,
        'alarm':            5,
        'heizung':          6
    },
    'db': {
        'host'     : 'violet',
        'database' : 'spaceportal',
        'user'     : 'contactors',
        'password' : ''
    }

};
