var React = require('react');
var Actions = require('../actions/Actions');
var ActionTypes = require('../constants/Constants').ActionTypes;
var UserStore = require('../stores/UserStore');

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
        return { userType: UserStore.UserTypes.INVALID_USER};
    },
    // register listener with  stores ... get notified when the Store updates
    componentDidMount: function()
    {
        UserStore.addChangeListener(this._onChange);
    },
    //Unregister listener
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    //Event handler for 'change' events coming from the TotalizerStore
    _onChange: function() {
        this.forceUpdate();
    },
    render: function() {
        var _user = UserStore.getUser();
        switch(_user.role) {
        case null:
        case UserStore.UserTypes.INVALID_USER:
            return <LoginPage/>;
        case UserStore.UserTypes.ADMINISTRATOR:
            return <ControlServersPage/>;
        case UserStore.UserTypes.SUPERVISOR:
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
                            <div className="label_container"/><input className="field_spacing align_right" type="submit" value="Submit" />
                        </form>
                    </div>
                </div>
                );
    }
                                   
});

var ControlServersPage = React.createClass({
    render: function() {
        return (
                <div>
                   <h3>Control Servers</h3>
                </div>
              );
        }
    });

var ControlEventsPage = React.createClass({
    render: function() {
        return (
                <div>
                   <h3>Control Events</h3>
                </div>
              );
        }
    });




module.exports = App;