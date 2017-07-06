'use strict'

const logger = require('winston')

async function onRepository(message) {
  logger.debug('repository: received', message)

  logger.debug('repository: finished', message)
}

module.exports = onRepository
