'use strict'

const fp = require('lodash/fp')
const joi = require('joi')
const logger = require('winston')
const redis = require('../../models/redis')
const GitHub = require('../../models/github')
const User = require('../../models/user')
const Repository = require('../../models/repository')

const { CHANNELS } = redis

const schema = joi.object({
  date: joi.date().raw().required(),
  query: joi.string().required(),
  page: joi.number().integer().required()
}).required()

async function onRepository(message) {
  logger.debug('repository: received', message)

  // validate data
  let data
  try {
    data = joi.attempt(message, schema)
  } catch (err) {
    logger.error('repository: invalid message', {
      data: message,
      error: err.message
    })

    return
  }

  const { date, query, page } = data

  let { items } = await GitHub.api.searchRepositories({ q: query, page, per_page: 100 })
  items = items.map((item) => ({
    owner: fp.pick(['id', 'login', 'avatar_url', 'html_url', 'type'], item.owner),
    repository: fp.compose([
      fp.assign({ owner: item.owner.id }),
      fp.defaults({ description: '', language: '' }),
      fp.omitBy(fp.isNil),
      fp.pick(['id', 'full_name', 'description', 'html_url', 'language', 'stargazers_count'])
    ])(item)
  }))

  await Promise.all(items.map(({ owner, repository }) =>
    User.insert(owner)
      .catch((err) => logger.warn('repository: User insert error', err))
      .then(() => Repository.insert(repository))
      .catch((err) => logger.warn('repository: Repository insert error', err))
      .then(() => redis.publishObject(CHANNELS.collect.contributions.v1, {
        date,
        repository
      }))
  ))

  logger.debug('repository: finished', message)
}

module.exports = onRepository
