'use strict'

const { promisify } = require('util')
const http = require('http')
const logger = require('winston')
const db = require('../models/db')
const redis = require('../models/redis')
const worker = require('./worker')
const config = require('./config')
const app = require('./server')

const server = http.createServer(app.callback())
const serverListen = promisify(server.listen).bind(server)
const serverClose = promisify(server.close).bind(server)

Promise.all([worker.init(), serverListen(config.port)])
  .then(() => {
    logger.info('Worker is running')
    logger.info(`Server is listening on port ${config.port}`)
  })
  .catch((err) => {
    logger.error('Error happened during worker initialization', err)
    process.exit(1)
  })

process.on('SIGTERM', gracefulShutdown)

let shuttingDown = false
async function gracefulShutdown() {
  logger.info('Got kill signal, starting graceful shutdown')

  if (shuttingDown) {
    return
  }

  shuttingDown = true
  try {
    await redis.destroy()
    await db.destroy()
    await serverClose()
  } catch (err) {
    logger.error('Error happened during graceful shutdown', err)
    process.exit(1)
  }

  logger.info('Graceful shutdown finished')
  process.exit()
}
