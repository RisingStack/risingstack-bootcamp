'use strict'

const tableName = 'repository'

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('id').unsigned().primary()
    table.integer('owner').notNullable()
    table.foreign('owner').references('user.id').onDelete('CASCADE')
    table.string('full_name').notNullable()
    table.string('description').notNullable()
    table.string('html_url').notNullable()
    table.string('language').notNullable()
    table.integer('stargazers_count').unsigned().notNullable()
  })
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}
