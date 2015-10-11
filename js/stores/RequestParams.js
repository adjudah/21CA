/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 
 */
function buildHeaders(){
    firstRequest = false;
    var idToken = localStorage.getItem('userToken');
    if (idToken)
        return { 'Authorization': 'Bearer ' + idToken };
    else
        return {};
}

var firstRequest = true;

var RequestParams = {
        serviceDomain: 'http://192.168.0.4:3000/',
        headers: {},
        getRequest: function ( requestPath ) {
            if (firstRequest)
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

