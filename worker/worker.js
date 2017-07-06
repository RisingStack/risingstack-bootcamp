'use strict'

const logger = require('winston')
const redis = require('../models/redis')
const handlers = require('./handlers')

const { subscriber, publisher, CHANNELS } = redis

async function init() {
  await Promise.all([
    subscriber.connect(),
    publisher.connect()
  ])

  await subscriber.subscribe(
    CHANNELS.collect.trigger.v1,
    CHANNELS.collect.repository.v1,
    CHANNELS.collect.contributions.v1
  )

  await subscriber.on('message', (channel, message) => {
    let messageObject
    try {
      messageObject = JSON.parse(message)
    } catch (err) {
      logger.warn('Invalid message, failed to parse', {
        message,
        error: err.message
      })
      return
    }

    switch (channel) {
      // TODO
      default:
        logger.warn(`Redis message is not handled on channel '${channel}'`, message)
    }
  })

  logger.info('Channels are initialized')
}

async function halt() {
  subscriber.disconnect()
  publisher.disconnect()

  logger.info('Channels are canceled')
}

module.exports = {
  init,
  halt
}
