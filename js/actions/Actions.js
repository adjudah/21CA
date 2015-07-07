/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var keyMirror = require('keymirror');
var actionTypes = keyMirror({
        AUTHENTICATE_USER: null,
        GET_SERVERS: null,
        SELECT_SERVER: null,
        CREATE_SERVER: null,
        UPDATE_SERVER: null,
        DELETE_SERVER: null,
        GET_EVENTS: null,
        CREATE_EVENT: null,
        UPDATE_EVENT: null,
        DELETE_EVENT: null,
        NOTIFY_USERS: null,
		PAGE_REQUEST_PREVIOUS_PAGE: null,
		PAGE_REQUEST_CREATE_SERVER: null
   });

var Actions = {

    authenticate: function(userName, password) {
        AppDispatcher.dispatch(
                {
                    actionType: actionTypes.AUTHENTICATE_USER,
                    userName: userName,
                    password: password
                }
            );
    },
    getServersForAdminUser: function(userID) {
        AppDispatcher.dispatch(
                {
                    actionType: actionTypes.GET_SERVERS,
                    userID: userID
                }
            );
    },
    selectServer: function(index) {
        AppDispatcher.dispatch(
                {
                    actionType: actionTypes.SELECT_SERVER,
                    serverIndex: index
                }
            );
    },
    updateServer: function (_id, name, path, status) {
        AppDispatcher.dispatch(
                {
                    actionType: actionTypes.UPDATE_SERVER,
                    _id: _id,
                    name: name,
                    path: path,
                    status: status
                }
            );
    },
    createServer: function (name, path, ownerUserId, ownerName, status) {
        AppDispatcher.dispatch(
                {
                    actionType: actionTypes.CREATE_SERVER,
                    server: { name: name, path: path, owner: {id: ownerUserId, name: ownerName}, status: status }
                }
            );
    },
    deleteServer: function (_id) {
        AppDispatcher.dispatch(
                {
                    actionType: actionTypes.DELETE_SERVER,
                    _id: _id
                }
            );
    },

    getEventsForSupervisor: function(userID) {
        AppDispatcher.dispatch(
                {
                    actionType: actionTypes.GET_EVENTS,
                    userID: userID
                }
            );
    },
    ActionTypes: actionTypes
 
};

module.exports = Actions;
