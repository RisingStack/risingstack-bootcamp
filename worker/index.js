'use strict'

const logger = require('winston')
const worker = require('./worker')

worker.init()
  .then(() => {
    logger.info('Worker is running')
  })
  .catch((err) => {
    logger.error('Error happened during worker initialization', err)
    process.exit(1)
  })
