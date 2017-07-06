'use strict'

const _ = require('lodash')
const joi = require('joi')
const logger = require('winston')
const GitHub = require('../../models/github')
const User = require('../../models/user')
const Contribution = require('../../models/contribution')

const schema = joi.object({
  date: joi.date().raw().required(),
  repository: joi.object({
    id: joi.number().integer().required(),
    full_name: joi.string().required()
  }).unknown().required()
}).required()

async function onContributions(message) {
  logger.debug('contributions: received', message)

  // validate data
  let data
  try {
    data = joi.attempt(message, schema)
  } catch (err) {
    logger.error('contributions: invalid message', {
      data: message,
      error: err.message
    })

    return
  }

  const { repository } = data

  let contributors = await GitHub.api.getContributors(repository.full_name)
  contributors = contributors.map(({ author, weeks }) => ({
    user: _.pick(author, ['id', 'login', 'avatar_url', 'html_url', 'type']),
    line_count: weeks.reduce((lines, { a: additions, d: deletions }) => lines + (additions - deletions), 0)
  }))

  await Promise.all(contributors.map(({ user, line_count }) =>
    User.insert(user)
      .catch((err) => logger.warn('contributions: User insert error', err))
      .then(() => Contribution.insertOrReplace({
        line_count,
        repository: repository.id,
        user: user.id
      }))
  ))

  logger.debug('contributions: finished', message)
}

module.exports = onContributions
