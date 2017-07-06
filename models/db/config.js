'use strict'

const path = require('path')
const joi = require('joi')
const { parse } = require('pg-connection-string')

const envVarsSchema = joi.object({
  PG_URI: joi.string().uri({ scheme: 'postgres' }).required(),
  PG_SSL_CA: joi.string(),
  PG_SSL_KEY: joi.string(),
  PG_SSL_CERT: joi.string(),
  PG_SSL_ALLOW_UNAUTHORIZED: joi.boolean().truthy('true').falsy('false').default(true),
  PG_POOL_MIN: joi.number().integer().default(1),
  PG_POOL_MAX: joi.number().integer().default(20),
  PG_HEALTH_CHECK_TIMEOUT: joi.number().integer().default(2000)
}).unknown()
  .required()

const envVars = joi.attempt(process.env, envVarsSchema)

const config = {
  client: 'pg',
  connection: Object.assign(
    parse(envVars.PG_URI),
    envVars.PG_SSL_CA || envVars.PG_SSL_KEY || envVars.PG_SSL_CERT
      ? {
        ssl: {
          ca: envVars.PG_SSL_CA,
          key: envVars.PG_SSL_KEY,
          cert: envVars.PG_SSL_CERT,
          rejectUnauthorized: !envVars.PG_SSL_ALLOW_UNAUTHORIZED
        }
      }
      : {}
  ),
  pool: {
    min: envVars.PG_POOL_MIN,
    max: envVars.PG_POOL_MAX
  },
  migrations: {
    directory: path.join(__dirname, './migrations')
  },
  healthCheck: {
    timeout: envVars.PG_HEALTH_CHECK_TIMEOUT
  }
}

module.exports = config
