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
      case CHANNELS.collect.trigger.v1:
        handlers.trigger(messageObject)
          .catch(logError)
        break
      case CHANNELS.collect.repository.v1:
        handlers.repository(messageObject)
          .catch(logError)
        break
      case CHANNELS.collect.contributions.v1:
        handlers.contributions(messageObject)
          .catch(logError)
        break
      default:
        logger.warn(`Redis message is not handled on channel '${channel}'`, message)
    }

    function logError(err) {
      logger.debug('Message handling error', {
        message,
        error: err.message
      })
    }
  })

  logger.info('Channels are initialized')
}

async function halt() {
  await redis.destroy()

  logger.info('Channels are canceled')
}

module.exports = {
  init,
  halt
}
