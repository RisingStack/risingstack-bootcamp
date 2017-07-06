'use strict'

const Koa = require('koa')
const logger = require('winston')
const middleware = require('./middleware')
const router = require('./router')

const app = new Koa()

app
  .use(middleware.requestLogger())
  .use(router.routes())
  .use(router.allowedMethods())

app.on('error', (err) => {
  logger.error('Server error', { error: err.message })
})

module.exports = app
