const GOOGLE_PUBSUB_TYPE = 'googleapis.com/google.pubsub.v1.PubsubMessage'

export default class Event {
  constructor (event) {
    this.event = event
  }

  isPubsubEvent () {
    return this.event['@type'] === GOOGLE_PUBSUB_TYPE
  }

  isHTTPEvent () {
    return this.event.is !== undefined && this.event.is('application/json')
  }

  decodeBase64 (data) {
    return JSON.parse(Buffer.from(data, 'base64').toString())
  }

  getPayload () {
    if (this.isPubsubEvent()) {
      return this.decodeBase64(this.event.data)
    } else {
      return this.event.body
    }
  }

  getRequestOptions (url) {
    let options = {
      uri: url,
      method: 'POST',
      json: this.getPayload()
    }
    return options
  }
}
