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

var params = require('./RequestParams')
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Actions = require('../actions/Actions')
var assign = require('object-assign');
var keyMirror = require('keymirror');

var CHANGE_EVENT = 'change';

var _user = {id: null, name: null, userName: null, role: null };

function update(userName, userRole) {
    _user.userName = userName;
    _user.role = userRole;
}


var getUser = function (email, actionType) {
    console.log('In getUser: ' + email);
    client( params.getRequest('user/' + email),
    function (err, res) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
            _user = {id: null, userName: null, role: UserStore.UserTypes.INVALID_USER };
        }
        else {
            _user = res.body;
        }
        UserStore.emitChange(actionType);
    });
}


var UserStore = assign({}, EventEmitter.prototype, {

    getUser: function() {
    return _user;
  },
  emitChange: function(actionType) {
    this.emit(CHANGE_EVENT, actionType);
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

    case Actions.ActionTypes.AUTHENTICATE_USER:
        action.email = action.email == null ? '' : action.email.trim();
        if (action.email !== ''){
            getUser(action.email, Actions.ActionTypes.AUTHENTICATE_USER);
        }
        break;
         
    default:
      // no op
  }
  
});

module.exports = UserStore;

