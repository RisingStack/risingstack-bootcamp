'use strict'

const { expect } = require('chai')
const _ = require('lodash')
const db = require('../db')
const User = require('../user')
const Repository = require('./repository')

describe('Repository', () => {
  let id
  let userId
  let repositoryToInsert
  let userToInsert

  beforeEach(async () => {
    id = _.random(1000)
    userId = _.random(1000)

    repositoryToInsert = {
      id,
      owner: userId,
      full_name: '@risingstack/foo',
      description: 'Very foo package, using bar technologies',
      html_url: 'https://github.com/risingstack/foo',
      language: 'Baz',
      stargazers_count: _.random(1000)
    }

    userToInsert = {
      id: userId,
      login: 'developer',
      avatar_url: 'https://developer.com/avatar.png',
      html_url: 'https://github.com/developer',
      type: 'User'
    }

    await db(User.tableName)
      .insert(userToInsert)
  })

  afterEach(async () => {
    await db(Repository.tableName)
      .where({ id })
      .delete()

    await db(User.tableName)
      .where({ id: userId })
      .delete()
  })

  describe('.insert', () => {
    it('should insert a new repository', async () => {
      const repositoryReturned = await Repository.insert(repositoryToInsert)
      const repositoryInDB = await db(Repository.tableName)
        .where({ id })
        .first()

      expect(repositoryInDB).to.eql(repositoryToInsert)
      expect(repositoryReturned).to.eql(repositoryToInsert)
    })

    it('should validate the input params', async () => {
      delete repositoryToInsert.full_name
      try {
        await Repository.insert(repositoryToInsert)
      } catch (err) {
        expect(err.name).to.be.eql('ValidationError')
        return
      }

      throw new Error('Did not validate')
    })
  })

  describe('.read', () => {
    it('should return a repository', async () => {
      await db(Repository.tableName)
        .insert(repositoryToInsert)

      const result = await Repository.read({ id: repositoryToInsert.id })

      expect(result).to.eql(Object.assign(repositoryToInsert, {
        owner: userToInsert
      }))
    })

    it('should return undefined if the repository is not in the db', async () => {
      const result = await Repository.read({ id: repositoryToInsert.id })

      expect(result).to.eql(undefined)
    })
  })
})
