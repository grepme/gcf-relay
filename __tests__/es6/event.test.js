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
  data: {
    data: Buffer.from(JSON.stringify(data), 'utf8').toString('base64'),
    '@type': 'type.googleapis.com/google.pubsub.v1.PubsubMessage'
  },
  eventType: 'providers/cloud.pubsub/eventTypes/topic.publish'
}

const pubsubEmulatorEvent = {
  eventType: 'providers/cloud.pubsub/eventTypes/topic.publish',
  data: data
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

  test('is not a pubsubEmulatorEvent', () => {
    expect(event.isPubsubEmulatorEvent()).toBeFalsy();
  })

  test('returns the original data', () => {
    expect(event.getPayload()).toEqual(data)
  })

  test('constructs the options for request', () => {
    optionsTest()
  })
})

describe('pubsub emulator event', () => {
  beforeEach(() => {
    event = new Event(pubsubEmulatorEvent)
  })

  test('is not a HTTPEvent', () => {
    expect(event.isHTTPEvent()).toBeFalsy();
  })

  test('is not a pubsubEvent', () => {
    expect(event.isPubsubEvent()).toBeFalsy();
  })

  test('is a pubsubEmulatorEvent', () => {
    expect(event.isPubsubEmulatorEvent()).toBeTruthy();
  })

  test('returns the original data', () => {
    expect(event.getPayload()).toEqual(data)
  })

  test('constructs the options for request', () => {
    optionsTest()
  })
})

describe('unknown event', () => {
  beforeEach(() => {
    event = new Event({})
  })

  test('is not a HTTPEvent', () => {
    expect(event.isHTTPEvent()).toBeFalsy();
  })

  test('is not a pubsubEvent', () => {
    expect(event.isPubsubEvent()).toBeFalsy();
  })

  test('is not a pubsubEmulatorEvent', () => {
    expect(event.isPubsubEmulatorEvent()).toBeFalsy();
  })

  test('should throw an error when fetching the payload', () => {
    expect(() => {
      event.getPayload()
    }).toThrow();
  })
})
