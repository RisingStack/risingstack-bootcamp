'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test'])
    .default('production'),
  PROCESS_TYPE: joi.string()
    .allow(['web', 'worker'])
    .required(),
  LOGGER_LEVEL: joi.string()
    .allow(['test', 'error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .when('NODE_ENV', {
      is: 'development',
      then: joi.default('silly')
    })
    .when('NODE_ENV', {
      is: 'production',
      then: joi.default('info')
    })
    .when('NODE_ENV', {
      is: 'test',
      then: joi.default('warn')
    })
})
  .unknown().required()

const envVars = joi.attempt(process.env, envVarsSchema)

const config = {
  env: envVars.NODE_ENV,
  process: {
    type: envVars.PROCESS_TYPE
  },
  logger: {
    level: envVars.LOGGER_LEVEL
  }
}

module.exports = config
