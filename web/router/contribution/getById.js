'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const Contribution = require('../../../models/contribution')
const middleware = require('../../middleware')

const paramsSchema = joi.object({
  id: joi.number().integer().required()
})
  .required()

async function getById(ctx) {
  const result = await Contribution.read({ repository: ctx.params })
  if (!result.length) {
    ctx.status = 404
    return
  }

  ctx.body = result
}

module.exports = compose([
  middleware.validator({
    params: paramsSchema
  }),
  getById
])
