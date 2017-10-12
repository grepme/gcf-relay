import Event from '../../es6/event'

let event = new Event({})
const url = "http://localhost:8080/"
const data = {
  city: "Edmonton",
  ranking: 5
}

const httpEvent = {
  is: jest.fn(function(content) {
    return content == 'application/json'
  }),
  body: data
};

const pubsubEvent = {
  '@type': 'googleapis.com/google.pubsub.v1.PubsubMessage',
  data: Buffer.from(JSON.stringify(data), 'utf8').toString('base64')
}

function optionsTest() {
  let requestOptions = event.getRequestOptions(url)
  expect(requestOptions.uri).toEqual(url)
  expect(requestOptions.method).toEqual('POST')
  expect(requestOptions.json).toEqual(data)
}

describe('pubsub event', () => {
  beforeEach(() => {
    event = new Event(pubsubEvent)
  })

  test('is a pubsubEvent', () => {
    expect(event.isPubsubEvent()).toBeTruthy();
  })

  test('is not a HTTPEvent', () => {
    expect(event.isHTTPEvent()).toBeFalsy();
  })

  test('decodes the payload', () => {
    expect(event.getPayload()).toEqual(data)
  })

  test('constructs the options for request', () => {
    optionsTest()
  })
})

describe('HTTP event', () => {
  beforeEach(() => {
    event = new Event(httpEvent)
  })

  test('is a HTTPEvent', () => {
    expect(event.isHTTPEvent()).toBeTruthy();
  })

  test('is not a pubsubEvent', () => {
    expect(event.isPubsubEvent()).toBeFalsy();
  })

  test('returns the original data', () => {
    expect(event.getPayload()).toEqual(data)
  })

  test('constructs the options for request', () => {
    optionsTest()
  })
})
