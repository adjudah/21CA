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

You must have [npm](https://www.npmjs.org/) installed on your computer.
From the root project directory run these commands from the command line:

    npm install

This will install all dependencies.

To build the project, first run this command:

    npm start

This will perform an initial build and start a watcher process that will update bundle.js with any changes you wish to make.  This watcher is based on [Browserify](http://browserify.org/) and [Watchify](https://github.com/substack/watchify), and it transforms React's JSX syntax into standard JavaScript with [Reactify](https://github.com/andreypopp/reactify).

To run the app: 
    from the project directory run: 
        http-server -p 8000     (http-server is an npm module)
        node server/server.js   to run the web services configured to listen on port 3000
    from the browser:
        http://localhost:8000/index.html

## License
??????
