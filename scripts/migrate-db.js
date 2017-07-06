'use strict'

const args = process.argv.slice(2)
if (args.includes('--local') || args.includes('-L')) {
  const user = process.env.PG_USER || process.env.USER || 'root'
  const pw = process.env.PG_PASSWORD || ''
  const db = process.env.PG_DATABASE || 'risingstack_bootcamp'
  process.env.PG_URI = `postgres://${user}:${pw}@localhost:5432/${db}`
}

// TODO
