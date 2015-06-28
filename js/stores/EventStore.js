/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * ServerStore
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

var _event = {_id: null, serverId: null, name: null, supervisorId: null, dateTime: null, duration: null, status: null };
var _events = [];


var getevent = function (eventID) {
    client( params.serviceRequest('event/' + eventID),
    function (err, res) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
            var _event = {
                _id: null, serverID: null, name: null, supervisorId: null,
                dateTime: null, duration: null, status: null };

        }
        else {
            _event = res.body;
        }
        EventStore.emitChange();
    });
}

var getEventsForSupervisor = function (userID, actionType) {
    client( params.serviceRequest('events/' + userID),
    function (err, res) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
            _events = [];
        }
        else {
            _events = res.body;
        }
        EventStore.emitChange(actionType);
    });
}



var EventStore = assign({}, EventEmitter.prototype, {

  getEvent: function() {
    return _event;
  },
  getEvents: function() {
   return _events;
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
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case ActionTypes.GET_EVENTS:
            getEventsForSupervisor(action.userID, action.actionType);
    default:
      // no op
  }
  
});

 module.exports = EventStore;

