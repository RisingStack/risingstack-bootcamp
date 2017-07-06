'use strict'

const config = require('./config')
const knex = require('knex')

const db = knex(config)

module.exports = db
