var React = require('react');
var Actions = require('../actions/Actions');
var ActionTypes = require('../constants/Constants').ActionTypes;
var UserStore = require('../stores/UserStore');
var ServerStore = require('../stores/ServerStore');
var EventStore = require('../stores/EventStore');
var MessageRouter = require('../stores/MessageRouter');

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
    /* Notes about the following 3 call routines:
        I have organised for these call backs to return the action type that has just been completed.
    */
    //Event handler for 'change' events coming from the UserStore
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
            return <LoginPage/>;
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

var LoginPage = React.createClass({
    onSave: function(e){
        e.preventDefault();
        Actions.authenticate(document.getElementById('userName').value, document.getElementById('password').value);
    },
    render: function() {
        return (
                <div className="page_outline">
                    <div className="page_title">Login into 21CA</div>
                    <div>
                        <form onSubmit={this.onSave}>
                            <div className="label_container">User Name:</div><input className="field_spacing" id="userName" type ="text"/>
                            <br/>
                            <div className="label_container">Password:</div><input className="field_spacing" id="password" type ="password"/>
                            <br/>
                            <div className="label_container"/><input className="align_right" type="submit" value="Submit" />
                        </form>
                    </div>
                </div>
                );
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
                        <div>
                            <span className="panel_title">Control Servers</span>
                            <a className="panel_add" onClick={this.addServer}>+</a>
                        </div>                        
                        <div>No servers configured for user.</div>
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
            return (
                    <div className="panel">
                        <div>
                            <span className="panel_title">Control Servers</span>
                            <a className="panel_add panel_right" onClick={this.addServer}>+</a>
                        </div>
                        {items}
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
                <div>
                    <a className="panel_navigate" onClick={this.previousPage}>&lt;</a>
                    <span className="panel_title">Control Server</span>
                    <a className="panel_navigate panel_right">edit</a>
                </div>
                <div className="panel_label">id</div><div className="panel_value">{this.state.server._id}</div><br/>
                <div className="panel_label">name</div><div className="panel_value">{this.state.server.name}</div><br/>
                <div className="panel_label">path</div><div className="panel_value">{this.state.server.path}</div><br/>
                <div className="panel_label">owner</div><div className="panel_value">{this.state.server.owner.name}</div><br/>
                <div className="panel_label">status</div><div className="panel_value">{this.state.server.status}</div><br/>
                <a className="panel_navigate panel_right" onClick={this.deleteServer}>delete</a>
                <br/>
                <p>Edit link not implemented. The Back, and Delete links do work</p>
                <br/>
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