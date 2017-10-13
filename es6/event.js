const GOOGLE_PUBSUB_DATA_TYPE = 'type.googleapis.com/google.pubsub.v1.PubsubMessage'
const GOOGLE_PUBSUB_TYPE = 'providers/cloud.pubsub/eventTypes/topic.publish'

class InvalidEvent extends Error {}

export default class Event {
  constructor(event) {
    this.event = event
  }

  isPubsubEvent() {
    return this.event.data !== undefined && this.event.data['@type'] === GOOGLE_PUBSUB_DATA_TYPE
  }

  isPubsubEmulatorEvent() {
    return this.event.eventType === GOOGLE_PUBSUB_TYPE
  }

  isHTTPEvent() {
    return this.event.is !== undefined && this.event.is('application/json')
  }

  decodeBase64(data) {
    return JSON.parse(Buffer.from(data, 'base64').toString())
  }

  getData() {
    if (this.isPubsubEvent()) {
      return this.decodeBase64(this.event.data.data)
    } else if (this.isHTTPEvent()) {
      return this.event.body
    } else if (this.isPubsubEmulatorEvent()) {
      return this.event.data
    } else {
      throw new InvalidEvent(JSON.stringify(this.event) + " doesn't appear to be a valid event")
    }
  }

  getRequestOptions(url) {
    let options = {
      uri: url,
      method: 'POST',
      json: this.getData()
    }
    return options
  }
}
