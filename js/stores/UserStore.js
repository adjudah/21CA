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
var restify = require('restify');
var client = restify.createJsonClient({url: 'http://localhost:3000'});

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


function getUser(userName){
    client.get('/user/' + userName, function (err, req, res, user) {
        if (err) {
            console.log("An error ocurred >>>>>>");
            console.log(err);
            _user = {id: null, userName: null, role: UserStore.UserTypes.INVALID_USER };
        } else {
            console.log('User with name ' + user.userName + '  >>>>>>>');
            console.log(user);
            _user.id = user.id;
            _user.userName = user.userName;
            _user.role = user.role;
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
        switch (_user.role) {
        case UserStore.UserTypes.ADMINISTRATOR:
        case UserStore.UserTypes.SUPERVISOR:
        case UserStore.UserTypes.ATTENDEE:
            break;
        default:
        }
        UserStore.emitChange();
        break;
         
    default:
      // no op
  }
  
});

module.exports = UserStore;

