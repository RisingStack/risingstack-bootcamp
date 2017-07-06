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

module.exports = Object.assign(subscriber, {
  subscriber,
  publisher,
  publishObject,
  CHANNELS
})
