'use strict'

const joi = require('joi')
const compose = require('koa-compose')
const Contribution = require('../../../models/contribution')
const middleware = require('../../middleware')

const paramsSchema = joi.object({
  owner: joi.string().required(),
  name: joi.string().required()
})
  .required()

async function getByName(ctx) {
  const { owner, name } = ctx.params
  const fullName = `${owner}/${name}`
  const result = await Contribution.read({ repository: { full_name: fullName } })
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
  getByName
])
