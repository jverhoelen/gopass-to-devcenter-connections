const Gopass = require('./Gopass')
const flatMap = require('flatmap')
const extendDirectoryObject = require('./extendDirectoryObject')
const { encode } = require('base-64')

class Extractor {
    constructor() {
        this.gopass = new Gopass()
    }

    async generateDevCenterCredentials(config) {
        const suitableSecrets = await this.searchSuitableSecrets(config)
        const directoryStructure = await this.buildDirectoryStructure(suitableSecrets)
        const connections = this.buildConnections(directoryStructure)
        return this.formatConnections(connections)
    }

    async searchSuitableSecrets(config) {
        const secrets = await this.gopass.secrets()
        return secrets.filter(secret => {
            const segments = secret.split('/')

            return segments[1] == config.prefix() &&
                segments.length == 5 &&
                config.environments().includes(segments[2]) &&
                config.requiredDetails().includes(segments[4])
        })
    }

    async buildDirectoryStructure(cassandraSecrets) {
        let directoryStructure = {}

        for (const secret of cassandraSecrets) {
            const segments = secret.split('/')
            const storeRoot = segments[0]
            const env = segments[2]
            const purpose = segments[3]
            const detail = segments[4]

            directoryStructure = extendDirectoryObject(directoryStructure, [ storeRoot, env, purpose, detail ])
            directoryStructure[storeRoot][env][purpose][detail] = await this.gopass.show(secret)
        }

        return directoryStructure
    }

    buildConnections(directory) {
        return flatMap(Object.keys(directory), storeName => {
            const store = directory[storeName]

            return flatMap(Object.keys(store), env => {
                const envConfig = store[env]

                return Object.keys(envConfig).map(purposeName => {
                    const purposeConfig = envConfig[purposeName]

                    return {
                        name: `${storeName} ${env} ${purposeName}`,
                        nodes: purposeConfig.nodes || '127.0.0.1,127.0.0.2,127.0.0.3',
                        password: purposeConfig.password,
                        username: purposeConfig.username
                    }
                })
            })
        })
    }

    formatConnections(connections) {
        return connections.map(connection => ({
            name: connection.name,
            hosts: connection.nodes.split(','),
            port: 9042,
            compression: 'SNAPPY',
            storePassword: false,
            requiresCredentials: true,
            login: connection.username,
            encryptedPassword: encode(connection.password),
            ssl: false,
            truststorePath: '',
            encryptedTruststorePassword: '',
            requiresClientAuthentication: false,
            keystorePath: '',
            encryptedKeystorePassword: ''
        }))
    }
}

module.exports = Extractor
