'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  TRIGGER_QUERY: joi.string().required(),
}).unknown()
  .required()

const envVars = joi.attempt(process.env, envVarsSchema)

const args = process.argv.slice(2)
if (args.includes('--local') || args.includes('-L')) {
  process.env.REDIS_URI = 'redis://localhost'
}

const redis = require('../models/redis')

const { CHANNELS } = redis

redis.publishObject(CHANNELS.collect.trigger.v1, {
  query: envVars.TRIGGER_QUERY,
  date: new Date().toISOString()
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Trigger published successfully!')
    process.exit(0)
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
