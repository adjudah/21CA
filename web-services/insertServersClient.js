var restify = require('restify');
////var server = require('./server');
 
var client = restify.createJsonClient({
    url: 'http://localhost:3000'
});
 
// a static product to CREATE READ UPDATE DELETE
 

var server1 = {
    id: "1",
    path: "AU.VIC.RMIT.mech-eng",
    name: "Mechanical Engineering @ RMIT",
    ownerUserId: "1",
    status: "active"
    };

var server2 = {
    id: "2",
    path: "AU.NSW.HD.Masters",
    name: "Masters of Hair Dressing @ HD",
    ownerUserId: "1",
    status: "active"
    };

var server3 = {
    id: "3",
    path: "AU.NSW.RAS",
    name: "Cue Sports 101: Potting @ RAS",
    ownerUserId: "1",
    status: "active"
    };


var post_callback = function (err, req, res, server) {
    if (err) {
        console.log("An error ocurred >>>>>>");
        console.log(err);
    } else {
        console.log('Server saved >>>>>>>');
        console.log(server);
    }
}

client.post('/server', server1, post_callback);
client.post('/server', server2, post_callback);
client.post('/server', server3, post_callback);

