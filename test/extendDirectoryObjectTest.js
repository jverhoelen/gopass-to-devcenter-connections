const assert = require('assert')
const sinon = require('sinon')
const buildDirectoryObject = require('../extendDirectoryObject')

describe('buildDirectoryObject', () => {
    it('should create the folders', () => {
        const result = buildDirectoryObject({}, [ 'some', 'thing' ])
        assert.deepEqual(result, { some: { thing: {} } })
    })

    it('should create an empty object for an empty path array', () => {
        const result = buildDirectoryObject({}, [ ])
        assert.deepEqual(result, {})
    })
})
