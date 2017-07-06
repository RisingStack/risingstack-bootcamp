'use strict'

const tableName = 'contribution'

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('user')
    table.foreign('user').references('user.id').onDelete('CASCADE')
    table.integer('repository')
    table.foreign('repository').references('repository.id').onDelete('CASCADE')
    table.integer('line_count').unsigned().notNullable()
    table.primary(['user', 'repository'])
  })
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}
