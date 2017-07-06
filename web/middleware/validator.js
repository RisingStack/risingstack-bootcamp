'use strict'

const fp = require('lodash/fp')
const joi = require('joi')

function validatorFactory(schemas) {
  return async function validatorMiddleware(ctx, next) {
    try {
      ['params', 'query', 'body']
        .forEach((partToValidate) => {
          const toValidate = ctx.request[partToValidate] || ctx[partToValidate]
          if (schemas[partToValidate]) {
            const validatedObject = joi.attempt(toValidate, schemas[partToValidate].label(partToValidate))

            Object.assign(toValidate, validatedObject)
          }
        })

      if (schemas.body && ctx.request.body) {
        ctx.request.body = joi.attempt(ctx.request.body, schemas.body.label('body'))
      }
    } catch (err) {
      if (!err.isJoi) {
        throw err
      }

      const errors = fp.compose([
        fp.mapValues(fp.map('message')),
        fp.groupBy('context.key')
      ])(err.details)

      ctx.status = 400
      ctx.body = { errors }

      return
    }

    await next()
  }
}

module.exports = validatorFactory
