/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var fs = require('fs');

// Build the Authorisation header for the User Token found in Local Storage.
function buildHeaders(){
    var idToken = localStorage.getItem('userToken');
    if (idToken){
        console.log('userToken: ' + idToken);
        return { 'Authorization': 'Bearer ' + idToken };
    } else {
        console.log('userToken not found');
        return {};
    }
}


var RequestParams = {
        serviceDomain: 'http://localhost:3000/',
        headers: null,
        getRequest: function ( requestPath ) {
            if (!this.headers)
                this.headers = buildHeaders();
            return { url: this.serviceDomain + requestPath, method: 'GET', json: true, headers: this.headers };
        },
        postRequest: function ( requestPath, body ) {
            var options = this.getRequest(requestPath);
            options.method = 'POST';
            options.body = body;
            return options;
        },
        deleteRequest: function (requestPath) {
            var options = this.getRequest(requestPath);
            options.method = 'DELETE';
            return options;
        }
    
    };


module.exports = RequestParams;

