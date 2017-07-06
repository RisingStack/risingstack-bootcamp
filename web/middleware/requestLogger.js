'use strict'

const logger = require('winston')
const _ = require('lodash')

function createRequestLogger(options = {}) {
  let { level = 'silly' } = options

  return async function requestLogger(ctx, next) {
    const start = Date.now()

    const { method, originalUrl, headers: requestHeaders, body: requestBody } = ctx.request
    try {
      await next()
    } catch (err) {
      logger.error(`${method}: ${originalUrl}`, { error: err.message })
      throw err
    }

    if (ctx.status >= 500) {
      level = 'error'
    } else if (ctx.status >= 400) {
      level = 'warn'
    }

    const ms = new Date() - start

    const { status, headers: responseHeaders, body: responseBody = '' } = ctx.response
    const logContext = {
      method,
      originalUrl,
      duration: `${ms}ms`,
      request: _.omitBy({
        headers: _.omit(requestHeaders, ['authorization', 'cookie']),
        body: requestBody
      }, _.isNil),
      response: _.omitBy({
        status,
        headers: _.omit(responseHeaders, ['authorization', 'cookie']),
        body: responseBody
      }, _.isNil)
    }

    logger.log(level, `${method}: ${originalUrl}`, logContext)
  }
}

module.exports = createRequestLogger
