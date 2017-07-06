'use strict'

const redis = require('../../models/redis')

const { CHANNELS } = redis

describe('Worker "trigger" channel', () => {
  // NOTE: this one is an integration test
  // it should check whether the handler is called when a message is published to this channel, but the handler intself
  // should not be tested in this
  it(`should handle messages on the ${CHANNELS.collect.trigger.v1} channel`)

  it(`should send the messages to the ${CHANNELS.collect.repository.v1} channel`)
})
