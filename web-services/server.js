//
var restify = require('restify');
var mongojs = require('mongojs');

//mongodb://<dbuser>:<dbpassword>@ds035167.mongolab.com:35167/21ca
var db = mongojs('mongodb://adjudah:Maanshan9515@ds035167.mongolab.com:35167/21ca',['users', 'servers', 'events', 'claims']);

//Server
var server = restify.createServer();
 
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(3000, function () {
    console.log("Server started @ 3000");
});

var default_response = function (err, data) {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(data));
    }




//-------------------Start Users---------------------------------
server.get(
    '/users',
    function (req, res, next) {
        db.users.find(function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.get(
    '/user/:userName',
    function (req, res, next) {
        db.users.findOne({ userName: req.params.userName }, function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.post(
    '/user',
    function (req, res, next) {
        var user = req.params;
        db.users.save(user, function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.put(
    '/user/:id',
    function (req, res, next) {
        // get the existing user
        db.users.findOne(
            {id: req.params.id},
            function (err, data) {
                // merge req.params/user with the server/user
 
                var updUser = {}; // updated products
                // logic similar to jQuery.extend(); to merge 2 objects.
                for (var n in data) {
                    updUser[n] = data[n];
                }
                for (var n in req.params) {
                    updUser[n] = req.params[n];
                }
                db.users.update({id: req.params.id}, updUser, {multi: false}, function (err, data) {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify(data));
                });
            });
        return next();
    }
);
//----------------------------End Users------------------------------------------


//---------------------------Start Servers---------------------------------------



server.get(
    '/servers',
    function (req, res, next) {
        db.servers.find( function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.get(
    '/server/:id',
    function (req, res, next) {
        db.servers.findOne({id: req.params.id}, function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.post('/server',
    function (req, res, next) {
        var server = req.params;
        db.servers.save(server, function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.put(
    '/server/:id',
    function (req, res, next) {
        // get the existing product
        db.servers.findOne({id: req.params.id},
            function (err, data) {
                // merge req.params/user with the server/user
 
                var updServer = {}; // updated products
                // logic similar to jQuery.extend(); to merge 2 objects.
                for (var n in data) {
                    updServer[n] = data[n];
                }
                for (var n in req.params) {
                    updServer[n] = req.params[n];
                }
                db.servers.update({id: req.params.id}, updServer, {multi: false}, function (err, data) {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify(data));
                });
            }
        );
        return next();
    }
);

//----------------------------End Servers


//---------------------------Start events---------------------------------------



server.get(
    '/events',
    function (req, res, next) {
        db.events.find( function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.get(
    '/event/:id',
    function (req, res, next) {
        db.events.findOne({id: req.params.id}, function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.post('/event',
    function (req, res, next) {
        var event = req.params;
        db.events.save(event, function (err, data) {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        });
        return next();
    }
);

server.put(
    '/event/:id',
    function (req, res, next) {
        // get the existing product
        db.events.findOne({id: req.params.id},
            function (err, data) {
                // merge req.params/user with the server/event
 
                var updEvent = {}; // updated products
                // logic similar to jQuery.extend(); to merge 2 objects.
                for (var n in data) {
                    updEvent[n] = data[n];
                }
                for (var n in req.params) {
                    updEvent[n] = req.params[n];
                }
                db.events.update({id: req.params.id}, updEvent, {multi: false}, function (err, data) {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify(data));
                });
            }
        );
        return next();
    }
);

//----------------------------End events




//module.exports = server;