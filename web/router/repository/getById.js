'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const Repository = require('../../../models/repository')
const middleware = require('../../middleware')

const paramsSchema = joi.object({
  id: joi.number().integer().required()
})
  .required()

async function get(ctx) {
  const result = await Repository.read(ctx.params)
  if (!result) {
    ctx.status = 404
    return
  }

  ctx.body = result
}

module.exports = compose([
  middleware.validator({
    params: paramsSchema
  }),
  get
])
