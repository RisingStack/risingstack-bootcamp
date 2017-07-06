'use strict'

const Koa = require('koa')
const logger = require('winston')

const app = new Koa()

app.on('error', (err) => {
  logger.error('Server error', { error: err.message })
})

module.exports = app
