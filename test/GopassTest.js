const assert = require('assert')
const sinon = require('sinon')
const Gopass = require('../Gopass')

beforeEach(() => {
    gopass = new Gopass()
})

describe('Gopass', () => {
    it('should be able to build an instance and verify with available gopass command', async () => {
        const verified = await gopass.verifyInstallation()
        assert.equal(verified, true)
    })

    it('should be able to use executeGopassCommand to execute gopass functionality', async () => {
        const version = await gopass.executeGopassCommand(['version'])
        assert.equal(version.includes('gopass'), true)
    })

    it('should be able to sync', async () => {
        gopass.sync()
    })
})
