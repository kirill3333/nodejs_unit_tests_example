const proxyquire = require('proxyquire')
const sinon = require('sinon')
const faker = require('faker')

describe('todo/model', () => {
  describe('todo schema', () => {
    let mongooseStub, SchemaConstructorSpy
    let ObjectIdFake, mongooseModelSpy, SchemaSpy

    before(() => {
      ObjectIdFake = faker.lorem.word()
      SchemaConstructorSpy = sinon.spy()
      SchemaSpy = sinon.spy()

      class SchemaStub {
        constructor(...args) {
          SchemaConstructorSpy(...args)
          return SchemaSpy
        }
      }

      SchemaStub.Types = {
        ObjectId: ObjectIdFake
      }

      mongooseModelSpy = sinon.spy()
      mongooseStub = {
        "Schema": SchemaStub,
        "model": mongooseModelSpy
      }

      proxyquire('../todo/model.js',
        {
          'mongoose': mongooseStub
        }
      )
    })

    it('should return new Todo model by schema', () => {
      let todoSchema = {
        title: {
          type: String
        },

        _user: {
          type: ObjectIdFake,
          ref: 'User'
        }
      }
      sinon.assert.calledOnce(SchemaConstructorSpy)
      sinon.assert.calledWith(SchemaConstructorSpy, todoSchema)

      sinon.assert.calledOnce(mongooseModelSpy)
      sinon.assert.calledWith(mongooseModelSpy, 'Todo', SchemaSpy)
    })
  })
})