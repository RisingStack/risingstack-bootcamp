'use strict'

const repositoryTableName = 'repository'
const userTableName = 'user'

function up(knex) {
  return Promise.all([
    knex.schema.alterTable(repositoryTableName, (table) => {
      table.index(['full_name'])
    }),
    knex.schema.alterTable(userTableName, (table) => {
      table.index(['login'])
    })
  ])
}

function down(knex) {
  return Promise.all([
    knex.schema.alterTable(repositoryTableName, (table) => {
      table.dropIndex(['full_name'])
    }),
    knex.schema.alterTable(userTableName, (table) => {
      table.dropIndex(['login'])
    })
  ])
}

module.exports = {
  up,
  down
}
