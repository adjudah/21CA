/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/*
 Fastclick: Turns touch events on mobile devices into click events.
 Things to know: 
    A mouse Pointer is both a pointer and a clicker.
 
    On touch screens a finger can only Touch down at P1 and Lift off at P2.
    Interpreting these gestures into events such as click or double click is
    what the browser on mobile device does.
 
    Browers on mobile devices do not emit the CSS :hover events because there is 
    no distinction between pointing and clicking.
*/
require('react-fastclick');
var React = require('react');

var App = require('./components/21CA.react');

React.render(<App />, document.getElementById('21CA')
);
