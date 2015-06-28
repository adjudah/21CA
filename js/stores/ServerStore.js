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
        },
        postRequest: function ( requestPath, body ) {
            return { url: this.serviceDomain + requestPath, method: 'POST', json: true, body: body };
        },
        deleteRequest: function (requestPath) {
            return { url: this.serviceDomain + requestPath, method: 'DELETE', json: true };
        }
    
    };

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../actions/Actions').ActionTypes;
var assign = require('object-assign');
var keyMirror = require('keymirror');

var CHANGE_EVENT = 'change';

var _server = {id: null, path: null, name: null, owner: null, status: null };
var _servers = [];


var getServer = function (serverID) {
    client( params.serviceRequest('server/' + serverID),
    function (err, res) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
            _server = {_id: null, path: null, name: null, owner: null, status: null };
        }
        else {
            _server = res.body;
            console.log ( '_id: ' + _server._id + ' path: ' + _server.path + ' name: ' + _server.name);
           
        }
        ServerStore.emitChange();
    });
}

var getServersForAdminUser = function (userID, actionType) {
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
        ServerStore.emitChange(actionType);
    });
}

var selectServer = function(serverIndex, actionType) {
    _server = _servers[serverIndex];
     ServerStore.emitChange(actionType);
}

var createServer = function(server, actionType){
    client( params.postRequest('server', server),
    function (err, res, body) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
        }
        else {
            _servers.push(body);
        }
        ServerStore.emitChange(actionType);
    });
}

var deleteServer = function(_id, actionType) {
    client( params.deleteRequest('server/' + _id),
    function (err, res) {
        if(err){
            console.log("An error ocurred >>>>>>");
            console.log(err);
        }
        else {
            var index;
            for (var i in _servers) {
                if (_servers[i]._id == _id) {
                    index = i;
                    break;
                }
            }
            _servers.splice(index,1);
        }
        ServerStore.emitChange(actionType);
    });
}



var ServerStore = assign({}, EventEmitter.prototype, {

  getServer: function() {
    return _server;
  },
  getServers: function() {
   return _servers;
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
        case ActionTypes.GET_SERVERS:
            getServersForAdminUser(action.userID, action.actionType);
            break;
        case ActionTypes.SELECT_SERVER:
            selectServer(action.serverIndex, action.actionType);
            break;
        case ActionTypes.UPDATE_SERVER:
            break;
        case ActionTypes.CREATE_SERVER:
            createServer(action.server, action.actionType);
            break;
        case ActionTypes.DELETE_SERVER:
            deleteServer(action._id, action.actionType);
            break;
    default:
      // no op
  }
  
});

module.exports = ServerStore;

