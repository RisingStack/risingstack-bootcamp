'use strict'

const logger = require('winston')
const db = require('../../../models/db')
const redis = require('../../../models/redis')

const state = {
  shutdown: false
}

process.on('SIGTERM', () => {
  state.shutdown = true
})

async function get(ctx) {
  if (state.shutdown) {
    ctx.throw(503, 'Service is shutting down')
  }

  try {
    await db.healthCheck()
  } catch (err) {
    const message = 'Database health check failed'
    logger.error(message, err)
    ctx.throw(500, message)
  }

  try {
    await redis.healthCheck()
  } catch (err) {
    const message = 'Redis health check failed'
    logger.error(message, err)
    ctx.throw(500, message)
  }

  ctx.body = {
    status: 'ok'
  }
}

module.exports = get
