'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const redis = require('../../../models/redis')
const middleware = require('../../middleware')

const { CHANNELS } = redis

const bodySchema = joi.object({
  query: joi.string().required()
}).required()

async function post(ctx) {
  const { query } = ctx.request.body

  await redis.publishObject(CHANNELS.collect.trigger.v1, {
    query,
    date: new Date().toISOString()
  })

  ctx.status = 201
}

module.exports = compose([
  middleware.validator({
    body: bodySchema
  }),
  post
])
