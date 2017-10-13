'use strict';

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request-promise');

exports.post = function (url, event) {
  var eventObject = new _event2.default(event);
  var options = eventObject.getRequestOptions(url);
  return request(options);
};

exports.getData = function (event) {
  var eventObject = new _event2.default(event);
  return event.getData();
};