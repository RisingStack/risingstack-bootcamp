'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  PORT: joi.number().integer().min(0).max(65535)
    .required()
}).unknown()
  .required()

const envVars = joi.attempt(process.env, envVarsSchema)

const config = {
  port: envVars.PORT
}

module.exports = config
