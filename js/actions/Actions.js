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
        GET_EVENTS: null,
        CREATE_SERVER: null,
        UPDATE_SERVER: null,
        DELETE_SERVER: null,
        CREATE_EVENT: null,
        UPDATE_EVENT: null,
        DELETE_EVENT: null,
        NOTIFY_USERS: null
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
