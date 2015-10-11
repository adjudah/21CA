# 21CA Prototype

> A mobile web app based upon React, Flux, Browser-request and Rectify for the REST services.


## Based upon this tutorial:
[TodoMVC tutorial](http://facebook.github.io/flux/docs/todo-list.html) explaining the structure of the files in this folder. It's well worth reading the __README.md__ associated with this project as it explains many of the details.


The [Flux](http://facebook.github.io/flux) and [React](http://facebook.github.io/react) websites are great resources for getting started.


## Notes

__Browserify/watchify__ is being used bundle to the rquired modules. This means that we can only depend upon __npm modules__. i.e. There can only be one script reference to bundle.js or bundle.min.js in the html page.

Web services are being implemented in __Restify__ and the persistent layer in __Mongodb__.

Client access to these web services are inplemented with __browser-request__. Restify's client pieces do not work in the browser. In particular the Restify module is not browerify compatible.


## Running
Run these commands from the command line to install project dependencies.
```
cd <project folder>
npm install				//installs dependencies in package.json in current folder.
cd web-services         //is a sub dir of 21CA but is not part of the web app;
npm install             //installs restify and mongdo. See package.json in this folder.
```

To build the project, first run this command:
```
cd <project folder>
npm start		//Monitors your source code changes and produces bundle.js. 
				//See package.json scripts section
```
Install npm module http-server globally if not already installed. hint: npm list -global
```
npm install -g http-server
```
Download and install mongodb. Follow installation instructions for your target system
and ensure that the mongodb deamon or Windows service is running. You will need to know the
installation directory for mongodb. Try running:
```
<Mongodb Installation folder>mongo		//client piece for mongoDB. You should get a connection.
```
If sucessful go on to define the 21CA database and use script 'LoadInitialData.js to fill with data. 
Before running the script edit it and modify the user email address to match the credentials of users 
that you will be logging in with.
```
cd <project folder>/web-services
<mongodb installation folder>mongo localhost/test loadInitialData.js
```
Confirm sucessful load with:
```
<mongodb installation folder>mongo		//should connect and place you in the test database.
use 21CAv1								// this is case sensitive
db.users.find()							// should return 3 users
db.servers.find()						// should return 3 servers
db.evets.find()							// should return 3 events
```
We are now ready to run the project:
```
cd <project folder>
http-server -p 8000             //Serves files from the current diectory. 
cd web-services
node server.js					//to run the web services configured to listen on port 3000
```
Then from the browser:
```
http://localhost:8000/index.html
```
## License
??????
