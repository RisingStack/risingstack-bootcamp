'use strict'

const tableName = 'user'

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('id').unsigned().primary()
    table.string('login').notNullable()
    table.string('avatar_url').notNullable()
    table.string('html_url').notNullable()
    table.string('type').notNullable()
  })
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}
