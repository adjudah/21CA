var restify = require('restify');
////var server = require('./server');
 
var client = restify.createJsonClient({
    url: 'http://localhost:3000'
});
 
// a static product to CREATE READ UPDATE DELETE
 

var event1 = {
    id: "1",
    serverId: "1",
    name: "Mechanical Engineering 101",
    supervisorId: "2",
    dateTime: "2015-05-20T13:30:00",
    duration: "90",
    status: "active"
    };

var event2 = {
    id: "2",
    serverId: "2",
    name: "Mindless chatter 101",
    supervisorId: "2",
    dateTime: "2015-05-25T13:30:00",
    duration: "90",
    status: "active"
    };

var event3 = {
    id: "3",
    serverId: "3",
    name: "Physics of moving bodies",
    supervisorId: "2",
    dateTime: "2015-05-30T13:30:00",
    duration: "90",
    status: "active"
    };


var post_callback = function (err, req, res, server) {
    if (err) {
        console.log("An error ocurred >>>>>>");
        console.log(err);
    } else {
        console.log('Event saved >>>>>>>');
        console.log(server);
    }
}

client.post('/event', event1, post_callback);
client.post('/event', event2, post_callback);
client.post('/event', event3, post_callback);

