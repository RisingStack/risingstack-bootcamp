'use strict'

const config = require('./config')
const knex = require('knex')

const db = knex(config)

function healthCheck() {
  return db.select(1).timeout(config.healthCheck.timeout)
}

module.exports = Object.assign(db, {
  healthCheck
})
