'use strict'

const Redis = require('ioredis')
const config = require('./config')

const CHANNELS = {
  collect: {
    trigger: {
      v1: 'bootcamp.collect.trigger.v1'
    },
    repository: {
      v1: 'bootcamp.collect.repository.v1'
    },
    contributions: {
      v1: 'bootcamp.collect.contributions.v1'
    }
  }
}

const publisher = new Redis(config.uri, { lazyConnect: true, dropBufferSupport: true })
const subscriber = new Redis(config.uri, { lazyConnect: true, dropBufferSupport: true })

function publishObject(channel, message) {
  return publisher.publish(channel, JSON.stringify(message))
}

async function destroy() {
  subscriber.disconnect()
  publisher.disconnect()
}

async function healthCheck() {
  try {
    await Promise.all([
      // check first if not connected yet (lazy connect)
      subscriber.status === 'wait' ? Promise.resolve() : subscriber.ping(),
      publisher.status === 'wait' ? Promise.resolve() : publisher.ping()
    ])
  } catch (err) {
    const error = new Error('One or more client status are not healthy')
    error.status = {
      subscriber: subscriber.status,
      publisher: publisher.status
    }

    throw error
  }
}

module.exports = Object.assign(subscriber, {
  subscriber,
  publisher,
  publishObject,
  destroy,
  healthCheck,
  CHANNELS
})
