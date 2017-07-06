'use strict'

const _ = require('lodash')
const joi = require('joi')
const logger = require('winston')
const redis = require('../../models/redis')

const { CHANNELS } = redis

const schema = joi.object({
  date: joi.date().raw().required(),
  query: joi.string().required()
}).required()

async function onTrigger(message) {
  logger.debug('trigger: received', message)

  // validate data
  let data
  try {
    data = joi.attempt(message, schema)
  } catch (err) {
    logger.error('trigger: invalid message', {
      data: message,
      error: err.message
    })

    return
  }

  const { date, query } = data
  // only the first 1000 search results are available
  await Promise.all(_.range(10).map((page) =>
    redis.publishObject(CHANNELS.collect.repository.v1, {
      date,
      page,
      query
    })
  ))

  logger.debug('trigger: finished', message)
}

module.exports = onTrigger
