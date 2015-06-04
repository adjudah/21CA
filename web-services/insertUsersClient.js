var restify = require('restify');
var client = restify.createJsonClient({url: 'http://localhost:3000'});
////var server = require('./server');

// a static product to CREATE READ UPDATE DELETE
 

var user1 = {
    id: "1",
    name: "Admin Judah",
    userName: "admin",
    password: "",
    role: "administrator",
    status: "active",
    email: "adjudah@iinet.net.au"
    };

var user2 = {
    id: "2",
    name: "Super Shiels",
    userName: "super",
    password: "",
    role: "supervisor",
    status: "active",
    email: "shiels.peter.au@gmail.com"
    };

var user3 = {
    id: "3",
    name: "Ming Destiny",
    userName: "attendee",
    password: "",
    role: "attendee",
    status: "active",
    email: "rrjudah@iinet.net.au"
    };


var post_callback = function (err, req, res, user) {
    if (err) {
        console.log("An error ocurred >>>>>>");
        console.log(err);
    } else {
        console.log('User saved >>>>>>>');
        console.log(user);
    }
}

client.post('/user', user1, post_callback);
client.post('/user', user2, post_callback);
client.post('/user', user3, post_callback);

