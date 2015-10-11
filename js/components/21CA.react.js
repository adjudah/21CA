var React = require('react');
var Actions = require('../actions/Actions');
var ActionTypes = require('../constants/Constants').ActionTypes;
var UserStore = require('../stores/UserStore');
var ServerStore = require('../stores/ServerStore');
var EventStore = require('../stores/EventStore');
var MessageRouter = require('../stores/MessageRouter');
var Auth0Lock = require('auth0-lock');
var AUTH0_CLIENT_ID='AqX7RmVFDRXurxz3nFNcV9hrV62A0qpt'; 
var AUTH0_DOMAIN='21ca.auth0.com'; 
var AUTH0_CALLBACK_URL=location.href;

var keyMirror = require('keymirror');
var PageTypes = keyMirror({
  LOGIN: null,
  CONTROL_SERVERS: null,
  VIEW_SERVER: null,
  CREATE_SERVER: null,
  EDIT_SERVER: null,
  CONTROL_EVENTS: null,
  });

//This is the controller view and the root of the App
var App = React.createClass({
    getInitialState: function() {
        return { currentPage: PageTypes.LOGIN, pageStack: []};
    },
    createLock: function() {
        this.lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
    },
    /* extracts the token from local storage if there is one.
        Otherwise extract the token from the URL (which implies that
        the auth0-lock screen has accepted credentials and it has redirected back to 21CA.
        If a token exists, the profile of the user is extracted from it.
        The email address of the user is extracted from the user profile and this key
        is used to identify the 21CA user and role. Identifying the user and role means that
        we know what the frist screen after login is.
    */
    getIdToken: function() {
        var idToken = localStorage.getItem('userToken');
        var authHash = this.lock.parseHash(window.location.hash);
        if (!idToken && authHash) {
            if (authHash.id_token) {
                idToken = authHash.id_token
                localStorage.setItem('userToken', authHash.id_token);
            }
            if (authHash.error) {
                console.log("Error signing in", authHash);
                return null;
            }
        }
        this.lock.getProfile(idToken, function(err, profile){
            if (err) {
                idToken = null;
            } else {
                console.log(profile);
                Actions.authenticate(profile.email);
            }
        });
        return idToken;
    },
    componentWillMount: function() {
        localStorage.removeItem('userToken');
        this.createLock();
        this.setState({idToken: this.getIdToken() });

    },

    // register listener with  stores ... get notified when the Store updates
    componentDidMount: function()
    {
        UserStore.addChangeListener(this._onChangeUserStore);
        ServerStore.addChangeListener(this._onChangeServerStore);
        EventStore.addChangeListener(this._onChangeEventStore);
		MessageRouter.addChangeListener(this._onPageRequest);


    },
    //Unregister listener
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChangeUserStore);
        ServerStore.removeChangeListener(this._onChangeServerStore);
        EventStore.removeChangeListener(this._onChangeEventStore);
		MessageRouter.removeChangeListener(this._onPageRequest);
		
    },
    //Event handler for 'change' events coming from the UserStore.
    // Action type is the requested action that has just been completed.
    // In this case user.role determines the next action to complete.
    _onChangeUserStore: function(actionType) {
        var _user = UserStore.getUser();
        console.log( 'completed action: ' + actionType);
        switch(actionType){
        case Actions.ActionTypes.AUTHENTICATE_USER:
            if (_user == null) {
                console.log( "don't know why this happens yet. but first call to web service return straight away ... just try again!");
            }
            switch (_user.role) {
            case UserStore.UserTypes.INVALID_USER:
                break;
            case UserStore.UserTypes.ADMINISTRATOR:
                Actions.getServersForAdminUser(_user._id);
                break;
            case UserStore.UserTypes.SUPERVISOR:
                Actions.getEventsForSupervisor(_user._id);
                break;

            }
        }
        
    },
     //Event handler for 'change' events coming from the ServerStore after it has completed a store action
    _onChangeServerStore: function(actionType) {
        console.log( 'completed action: ' + actionType);
        switch (actionType) {
        case Actions.ActionTypes.GET_SERVERS:
            this.setPage(PageTypes.CONTROL_SERVERS);
            break;
        case Actions.ActionTypes.SELECT_SERVER:
            this.setPage(PageTypes.VIEW_SERVER);
            break;
        case Actions.ActionTypes.UPDATE_SERVER:
            break;
        //what to do after a create Server Post
        case Actions.ActionTypes.CREATE_SERVER:
        case Actions.ActionTypes.DELETE_SERVER:
            this.setPage(PageTypes.CONTROL_SERVERS);
            break;
        }
    },
    //Event handler for 'change' events coming from the EventStore
    _onChangeEventStore: function(actionType) {
        console.log( 'completed action: ' + actionType);
        switch (actionType) {
        case Actions.ActionTypes.GET_EVENTS:
            this.setPage(PageTypes.CONTROL_EVENTS);
            break;
        }
    },
    //Receive mostlty Page requests from child components
	//who make the call MessageRouter.RequestAction(actionType);
    _onPageRequest: function(actionType) {
        console.log( 'completed action: ' + actionType);
        switch (actionType) {
        case Actions.ActionTypes.PAGE_REQUEST_PREVIOUS_PAGE:
            this.previousPage();
            break;
        case Actions.ActionTypes.PAGE_REQUEST_CREATE_SERVER:
            this.setPage(PageTypes.CREATE_SERVER);
            break;
        }
    },
    setPage: function(pageType) {
        var pageStack = this.state.pageStack;
        pageStack.push(this.state.currentPage);
        this.setState({ currentPage: pageType, pageStack: pageStack})
    },
    //Back button implementation
    previousPage: function() {
        var pageStack = this.state.pageStack;
        var page = pageStack.pop();
        this.setState({ currentPage: page, pageStack: pageStack});
    },

    render: function() {
        var _user = UserStore.getUser();
        switch(this.state.currentPage) {
        case PageTypes.LOGIN:
            //invokes auth0 login screen. After login auth0 redirects back to the main page
            //i.e. it re-enters 21CA, but this time the token is embedded in the url.
            if (!this.state.idToken)
                this.lock.show({
                    connections: ['google-oauth2', 'facebook'],
                    socialBigButtons: true,
                    popup: true},
                    function (err, profile, token) {
                        if (err){
                            alert('Login failed');
                        } else {
                            localStorage.setItem('userToken', token);
                            Actions.authenticate(profile.email);
                        }
                    }
                );
            return <NoPage />
        case PageTypes.CONTROL_SERVERS:
            return <ControlServersPage/>;
        case PageTypes.VIEW_SERVER:
            return <ViewServerPage />;
        case PageTypes.CREATE_SERVER:
            return <EditServerPage isNew={true} />;
        case PageTypes.EDIT_SERVER:
            return <EditServerPage isNew={false} />;
        case PageTypes.CONTROL_EVENTS:
            return <ControlEventsPage/>;

        default:
            return <div className="message">Not Implemented</div>;
        }
    }
});

var NoPage = React.createClass({
    render: function() {
        return ( <span></span> );
    }
                                   
});

var ControlServersPage = React.createClass({
    addServer: function() {
       
        MessageRouter.requestAction(Actions.ActionTypes.PAGE_REQUEST_CREATE_SERVER);
    },
    selectServer: function(id) {
        Actions.selectServer(id);
    },
    render: function() {
        var servers = ServerStore.getServers();
        if (servers == null){
            return (
                    <div className="panel">
                         <div className="panel_header">
                            <div className="panel_title">Control Servers</div>
                            <a className="panel_add" onClick={this.addServer}>+</a>
                        </div>
                        <div className="panel_body">
                            <div>No servers configured for user.</div>
                        </div>
                    </div>
            );
        }
        else {
            var items = [];
            for (var id in servers){
                items = items.concat(
                    <div className="item" key={id} onClick={this.selectServer.bind(this,id)}>
                        {servers[id].name}
                        <div className="subItem" >
                            path: {servers[id].path} status: {servers[id].status}
                            <br/>
                            owner: {servers[id].owner.name}
                        </div>
                    </div>
                );
            }
            //<a className="panel_add panel_right" onClick={this.addServer}>+</a>
            return (
                    <div className="panel">
                        <div className="panel_header">
                            <div className="panel_title">Control Servers</div>
                            <a className="panel_add" onClick={this.addServer}>+</a>
                        </div>
                        <div className="panel_body">
                            {items}
                        </div>
                    </div>
              );
            }
        }
    });
// Strategy: After selecting a Server, view the details and then elect to edit it if required.
// It's an Apple Ios mobile pattern. Having tried it, not sure if I like it.
var ViewServerPage = React.createClass({
    getInitialState: function() {
        return { server: ServerStore.getServer() };
    },
    deleteServer: function() {
        Actions.deleteServer(this.state.server._id);
    },
	previousPage: function() {
		MessageRouter.requestAction(Actions.ActionTypes.PAGE_REQUEST_PREVIOUS_PAGE);
	},
    render: function() {
        var server = ServerStore.getServer();
        return (
            <div className="panel">
                <div className="panel_header">
                    <a className="panel_navigate" onClick={this.previousPage}>&lt;</a>
                    <div className="panel_title">Control Server</div>
                    <a className="panel_navigate">edit</a>
                </div>
                <div className="panel_label">id</div><div className="panel_value">{this.state.server._id}</div><br/>
                <div className="panel_label">name</div><div className="panel_value">{this.state.server.name}</div><br/>
                <div className="panel_label">path</div><div className="panel_value">{this.state.server.path}</div><br/>
                <div className="panel_label">owner</div><div className="panel_value">{this.state.server.owner.name}</div><br/>
                <div className="panel_label">status</div><div className="panel_value">{this.state.server.status}</div><br/>
                <a className="panel_navigate panel_right" onClick={this.deleteServer}>delete</a>
                <br/>
                <div className="panel_label_long">document.body.clientWidth</div><div className="panel_value">{document.body.clientWidth}</div><br/>
                <div className="panel_label_long">document.body.clientHeight</div><div className="panel_value">{document.body.clientHeight}</div><br/>
                <div className="panel_label_long">window.innerWidth</div><div className="panel_value">{window.innerWidth}</div><br/>
                <div className="panel_label_long">window.innerHeight</div><div className="panel_value">{window.innerHeight}</div><br/>
            </div>
        );
    }
});

var EditServerPage = React.createClass({
getInitialState: function() {
    var user = UserStore.getUser();
    console.log(user.name);
    if (this.props.isNew) {
        return { _id: 'new', name: '', path: '', ownerUserId: user._id, ownerName: user.name, status: 'active' };
    }
    else {
        var server = ServerStore.getServer();
        return { _id: server._id , name: server.name, path: server.path,
                 ownerUserId: server.owner.id, ownerName: server.owner.name,
                 status: server.status };
    }

},
onChangeValue: function(e) {
    switch (e.target.id) {
    case 'name':
        this.setState({name: e.target.value});
        break;
    case 'path':
        this.setState({path: e.target.value});
        break;
    case 'status':
        this.setState({status: e.target.value});
        break;
    }
},
onSave: function(e) {
    e.preventDefault();
    if (this.props.isNew) {
        Actions.createServer( this.state.name, this.state.path, this.state.ownerUserId, this.state.ownerName, this.state.status);
    }
    else {
        Actions.updateServer( this.state._id, this.state.name, this.state.path, this.state.status );
    }
},
previousPage: function() {
	MessageRouter.requestAction(Actions.ActionTypes.PAGE_REQUEST_PREVIOUS_PAGE);
},
render: function() {
    var title = this.props.isNew ? 'Create Control Server' : 'Edit Control Server';
    return (
            <div className="panel">
                <div>
                    <a className="panel_navigate" onClick={this.previousPage}>&lt;</a>
                    <span className="panel_title">{title}</span>
                </div>
                <form onSubmit={this.onSave}>
                    <div className="panel_label">id</div><div className="panel_value">{this.props.isNew ? 'new' : server._id}</div>
                    <br/>
                    <div className="panel_label">owner</div><div id="ownerName" className="panel_value">{this.state.ownerName}</div>
                    <br/>
                    <div className="panel_label">name</div>
                    <input id="name" type="text" onChange={this.onChangeValue} value={this.state.name} className="field_spacing"/>
                    <br/>
                    <div className="panel_label">path</div>
                    <input id="path" type="text" onChange={this.onChangeValue} value={this.state.path} className="field_spacing"/>
                    <br/>
                    <div className="panel_label">status</div>
                    <select id="status" onChange={this.onChangeValue} value={this.state.status}>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="disabled">Disabled</option>
                    </select>
                    <br/>
                    <input type="submit"/>
                </form>
            </div>
            );
    }
});







var ControlEventsPage = React.createClass({
    render: function() {
        var events = EventStore.getEvents();
        if (events == null){
            return (
                    <div className="panel">
                        <div>
                            <a className="panel_navigate">&nbsp;</a>
                            <span className="panel_title">Control Events</span>
                            <a className="panel_add">+</a>
                        </div> 
                        <div>No events found</div>
                    </div>
            );
        }
        else {
            var items = [];
            for (var id in events){
                items = items.concat(
                <div className="item" key={id}>
                    {events[id].name}
                    <div className="subItem">
                        date: {events[id].dateTime} duration: {events[id].duration}
                    </div>
                </div>);
            }
            return (
                    <div className="panel">
                        <div>
                            <span className="panel_title">Control Events</span>
                            <a className="panel_add panel_right">+</a>
                        </div>
                        {items}
                        <p>Have not done much work here</p>
                    </div>
              );
            }
        }
    });




module.exports = App;