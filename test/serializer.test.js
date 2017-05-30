const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('todo/serializer', () => {
  describe('json serializer', () => {
    let JSONAPISerializerStub, SerializerConstructorSpy

    before(() => {
      SerializerConstructorSpy = sinon.spy()

      class SerializerStub {
        constructor(...args) {
          SerializerConstructorSpy(...args)
        }
      }

      JSONAPISerializerStub = {
        Serializer: SerializerStub
      }

      proxyquire('../todo/serializer.js',
        {
          'jsonapi-serializer': JSONAPISerializerStub
        }
      )
    })

    it('should return new instance of Serializer', () => {
      let schema = {
        attributes: ['title', '_user']
        ,
        _user: {
          ref: 'id',
          attributes: ['username']
        }
      }
      sinon.assert.calledOnce(SerializerConstructorSpy)
      sinon.assert.calledWith(SerializerConstructorSpy, 'todos', schema)
    })
  })
})