var React = require('react');
var Actions = require('../actions/Actions');
var ActionTypes = require('../constants/Constants').ActionTypes;
var UserStore = require('../stores/UserStore');
var ServerStore = require('../stores/ServerStore');
var EventStore = require('../stores/EventStore');


var keyMirror = require('keymirror');
var PageTypes = keyMirror({
  LOGIN: null,
  CONTROL_SERVERS: null,
  CONTROL_EVENTS: null,
  CLAIM: null
  });

//This is the controller view and the root of the App
var App = React.createClass({
    getInitialState: function() {
        return { currentPage: PageTypes.LOGIN};
    },
    // register listener with  stores ... get notified when the Store updates
    componentDidMount: function()
    {
        UserStore.addChangeListener(this._onChangeUserStore);
        ServerStore.addChangeListener(this._onChangeServerStore);
        EventStore.addChangeListener(this._onChangeEventStore);

    },
    //Unregister listener
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChangeUserStore);
        ServerStore.removeChangeListener(this._onChangeServerStore);
        EventStore.removeChangeListener(this._onChangeEventStore);
    },
    //Event handler for 'change' events coming from the UserStore
    _onChangeUserStore: function(actionType) {
        var _user = UserStore.getUser();
        console.log( 'completed action: ' + actionType);
        switch(actionType){
        case Actions.ActionTypes.AUTHENTICATE_USER:
            switch (_user.role) {
            case UserStore.UserTypes.INVALID_USER:
                break;
            case UserStore.UserTypes.ADMINISTRATOR:
                Actions.getServersForAdminUser(_user.id);
                break;
            case UserStore.UserTypes.SUPERVISOR:
                Actions.getEventsForSupervisor(_user.id);
                break;

            }
        }
        
    },
     //Event handler for 'change' events coming from the ServerStore
    _onChangeServerStore: function(actionType) {
        switch (actionType) {
        case Actions.ActionTypes.GET_SERVERS:
            this.setState({ currentPage: PageTypes.CONTROL_SERVERS});
            break;
        }
    },
    //Event handler for 'change' events coming from the EventStore
    _onChangeEventStore: function(actionType) {
        switch (actionType) {
        case Actions.ActionTypes.GET_EVENTS:
            this.setState({ currentPage: PageTypes.CONTROL_EVENTS});
            break;
        }
    },

    render: function() {
        var _user = UserStore.getUser();
        switch(this.state.currentPage) {
        case PageTypes.LOGIN:
            return <LoginPage/>;
        case PageTypes.CONTROL_SERVERS:
            return <ControlServersPage/>;
        case PageTypes.CONTROL_EVENTS:
            return <ControlEventsPage/>;
        default:
            return <div className="message">Not Implemented</div>;
        }
    }
});
/*
 
*/
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
    render: function() {
        var servers = ServerStore.getServers();
        if (servers == null){
            return (
                    <div className="panel">
                        <h3>Control Servers</h3>
                        <div>No servers configured for user.</div>
                    </div>
            );
        }
        else {
            var items = [];
            for (var id in servers){
                items = items.concat(<div className="item" key={id}>{servers[id].name}</div>);
            }
            return (
                    <div className="panel">
                    <div className="panel_title">Control Servers</div>
                        {items}
                    </div>
              );
            }
        }
    });

var ControlEventsPage = React.createClass({
    render: function() {
        var events = EventStore.getEvents();
        if (events == null){
            return (
                    <div className="panel">
                        <div className="panel_title">Control Events</div>
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
                    <div className="panel_title">Control Events</div>
                        {items}
                    </div>
              );
            }
        }
    });




module.exports = App;