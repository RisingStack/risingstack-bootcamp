'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const Repository = require('../../../models/repository')
const middleware = require('../../middleware')

const paramsSchema = joi.object({
  owner: joi.string().required(),
  name: joi.string().required()
})
  .required()

async function get(ctx) {
  const { owner, name } = ctx.params
  const fullName = `${owner}/${name}`
  const result = await Repository.read({ full_name: fullName })
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
