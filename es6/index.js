import Event from './event'
const request = require('request-promise')

exports.post = function (url, event) {
  let eventObject = new Event(event)
  let options = eventObject.getRequestOptions(url)
  return request(options)
}

exports.getData = function(event) {
  let eventObject = new Event(event)
  return eventObject.getData()
}
