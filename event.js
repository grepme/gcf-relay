'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GOOGLE_PUBSUB_TYPE = 'googleapis.com/google.pubsub.v1.PubsubMessage';

var Event = function () {
  function Event(event) {
    _classCallCheck(this, Event);

    this.event = event;
  }

  _createClass(Event, [{
    key: 'isPubsubEvent',
    value: function isPubsubEvent() {
      return this.event['@type'] === GOOGLE_PUBSUB_TYPE;
    }
  }, {
    key: 'isHTTPEvent',
    value: function isHTTPEvent() {
      return this.event.is !== undefined && this.event.is('application/json');
    }
  }, {
    key: 'decodeBase64',
    value: function decodeBase64(data) {
      return JSON.parse(Buffer.from(data, 'base64').toString());
    }
  }, {
    key: 'getPayload',
    value: function getPayload() {
      if (this.isPubsubEvent()) {
        return this.decodeBase64(this.event.data);
      } else {
        return this.event.body;
      }
    }
  }, {
    key: 'getRequestOptions',
    value: function getRequestOptions(url) {
      var options = {
        uri: url,
        method: 'POST',
        json: this.getPayload()
      };
      return options;
    }
  }]);

  return Event;
}();

exports.default = Event;