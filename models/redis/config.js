'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  REDIS_URI: joi.string().uri({ scheme: 'redis' }).required()
}).unknown()
  .required()

const envVars = joi.attempt(process.env, envVarsSchema)

const config = {
  uri: envVars.REDIS_URI
}

module.exports = config
