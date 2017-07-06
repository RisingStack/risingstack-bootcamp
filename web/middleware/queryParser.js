'use strict'

const qs = require('qs')

function parseQueryFactory(options) {
  return async function parseQuery(ctx, next) {
    ctx.query = qs.parse(ctx.querystring, options)
    ctx.request.query = ctx.query
    await next()
  }
}

module.exports = parseQueryFactory
