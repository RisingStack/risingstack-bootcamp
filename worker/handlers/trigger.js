'use strict'

const logger = require('winston')

async function onTrigger(message) {
  logger.debug('trigger: received', message)

  logger.debug('trigger: finished', message)
}

module.exports = onTrigger
