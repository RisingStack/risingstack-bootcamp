'use strict'

const { expect } = require('chai')
const _ = require('lodash')
const db = require('../db')
const User = require('./user')

describe('User', () => {
  let id
  let userToInsert

  beforeEach(async () => {
    id = _.random(1000)

    userToInsert = {
      id,
      login: 'developer',
      avatar_url: 'https://developer.com/avatar.png',
      html_url: 'https://github.com/developer',
      type: 'User'
    }
  })

  afterEach(async () => {
    await db(User.tableName)
      .where({ id })
      .delete()
  })

  describe('.insert', () => {
    it('should insert a new user', async () => {
      const userReturned = await User.insert(userToInsert)
      const userInDB = await db(User.tableName)
        .where({ id })
        .first()

      expect(userInDB).to.eql(userToInsert)
      expect(userReturned).to.eql(userToInsert)
    })

    it('should validate the input params', async () => {
      delete userToInsert.login

      try {
        await User.insert(userToInsert)
      } catch (err) {
        expect(err.name).to.be.eql('ValidationError')
        return
      }

      throw new Error('Did not validate')
    })
  })

  describe('.read', () => {
    it('should return a user', async () => {
      await db(User.tableName)
        .insert(userToInsert)

      const result = await User.read({ id: userToInsert.id })

      expect(result).to.eql(userToInsert)
    })

    it('should return undefined if the user is not in the db', async () => {
      const result = await User.read({ id: userToInsert.id })

      expect(result).to.eql(undefined)
    })
  })
})
