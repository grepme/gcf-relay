'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GOOGLE_PUBSUB_DATA_TYPE = 'type.googleapis.com/google.pubsub.v1.PubsubMessage';
var GOOGLE_PUBSUB_TYPE = 'providers/cloud.pubsub/eventTypes/topic.publish';

var InvalidEvent = function (_Error) {
  _inherits(InvalidEvent, _Error);

  function InvalidEvent() {
    _classCallCheck(this, InvalidEvent);

    return _possibleConstructorReturn(this, (InvalidEvent.__proto__ || Object.getPrototypeOf(InvalidEvent)).apply(this, arguments));
  }

  return InvalidEvent;
}(Error);

var Event = function () {
  function Event(event) {
    _classCallCheck(this, Event);

    this.event = event;
  }

  _createClass(Event, [{
    key: 'isPubsubEvent',
    value: function isPubsubEvent() {
      return this.event.data !== undefined && this.event.data['@type'] === GOOGLE_PUBSUB_DATA_TYPE;
    }
  }, {
    key: 'isPubsubEmulatorEvent',
    value: function isPubsubEmulatorEvent() {
      return this.event.eventType === GOOGLE_PUBSUB_TYPE;
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
    key: 'getData',
    value: function getData() {
      if (this.isPubsubEvent()) {
        return this.decodeBase64(this.event.data.data);
      } else if (this.isHTTPEvent()) {
        return this.event.body;
      } else if (this.isPubsubEmulatorEvent()) {
        return this.event.data;
      } else {
        throw new InvalidEvent(JSON.stringify(this.event) + " doesn't appear to be a valid event");
      }
    }
  }, {
    key: 'getRequestOptions',
    value: function getRequestOptions(url) {
      var options = {
        uri: url,
        method: 'POST',
        json: this.getData()
      };
      return options;
    }
  }]);

  return Event;
}();

exports.default = Event;