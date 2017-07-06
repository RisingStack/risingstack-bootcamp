'use strict'

const logger = require('winston')

async function onContributions(message) {
  logger.debug('contributions: received', message)

  // TODO

  logger.debug('contributions: finished', message)
}

module.exports = onContributions
