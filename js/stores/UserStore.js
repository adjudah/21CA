/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * UserStore
 */
var client = require('browser-request');
var params = {
    serviceDomain: 'http://localhost:3000/',
    serviceRequest: function ( requestPath ) {
                        return { url: this.serviceDomain + requestPath, json: true };
                    }
    };

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../actions/Actions').ActionTypes;
var assign = require('object-assign');
var keyMirror = require('keymirror');

var CHANGE_EVENT = 'change';

var _user = {id: null, userName: null, role: null };

function update(userName, userRole) {
    _user.userName = userName;
    _user.role = userRole;
}


var getUser = function (userName) {
    client( params.serviceRequest('user/' + userName),
    function (err, res) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
            _user = {id: null, userName: null, role: UserStore.UserTypes.INVALID_USER };
        }
        else {
            _user.id = res.body.id;
            _user.userName = res.body.userName;
            _user.role = res.body.role;
            console.log ( 'id: ' + _user.id + ' userName: ' + _user.userName + ' role: ' + _user.role);
            switch (_user.role) {
                case UserStore.UserTypes.ADMINISTRATOR:
                case UserStore.UserTypes.SUPERVISOR:
                case UserStore.UserTypes.ATTENDEE:
                    break;
                default:
           
            }
            UserStore.emitChange();
        }
    });
}


var UserStore = assign({}, EventEmitter.prototype, {

    getUser: function() {
    return _user;
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  //  @param {function} callback
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  //  @param {function} callback
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  //Constants
  UserTypes: keyMirror({
    ADMINISTRATOR: null,
    SUPERVISOR: null,
    ATTENDEE: null,
    INVALID_USER: null
  })

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {

    case ActionTypes.AUTHENTICATE_USER:
        action.userName = action.userName == null ? '' : action.userName.trim();
        if (action.userName !== ''){
            getUser(action.userName);
        }
        break;
         
    default:
      // no op
  }
  
});

module.exports = UserStore;

