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

var _server = {id: null, path: null, name: null, ownerUserId: null, status: null };
var _servers = [];


var getServer = function (serverID) {
    client( params.serviceRequest('server/' + serverID),
    function (err, res) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
            _server = {id: null, path: null, name: null, ownerUserId: null, status: null };
        }
        else {
            _server.id = res.body.id;
            _server.path = res.body.path;
            _server.name = res.body.name;
            _server.ownerUserId = res.body.ownerUserId;
            _server.status = res.body.status;
            console.log ( 'id: ' + _server.id + ' path: ' + _server.path + ' name: ' + _server.name);
           
        }
        ServerStore.emitChange();
    });
}

var getServersForAdminUser = function (userID) {
    client( params.serviceRequest('servers/' + userID),
    function (err, res) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
            _servers = [];
        }
        else {
            _servers = res.body;
        }
        ServerStore.emitChange();
    });
}



var ServerStore = assign({}, EventEmitter.prototype, {

  getServer: function() {
    return _server;
  },
  getServers: function() {
   return _servers;
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
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case ActionTypes.GET_SERVERS:
            getServersForAdminUser(action.userID);
    default:
      // no op
  }
  
});

module.exports = ServerStore;

