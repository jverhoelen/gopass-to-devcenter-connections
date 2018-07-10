const Gopass = require('./gopass')
const gopass = new Gopass()
const flatMap = require('flatmap')
const buildDirectoryObject = require('./buildDirectoryObject')
const { encode } = require('base-64')

const config = {
    requiredDetails: ['username', 'password', 'nodes'],
    environments: ['work', 'test', 'live'],
    prefix: 'cassandra'
}

class Extractor {
    static async searchSuitableSecrets() {
        const secrets = await gopass.secrets()
        return secrets.filter(secret => {
            const segments = secret.split('/')

            return segments[1] == config.prefix &&
                segments.length == 5 &&
                config.environments.includes(segments[2]) &&
                config.requiredDetails.includes(segments[4])
        })
    }

    static async buildDirectoryStructure(cassandraSecrets) {
        let directoryStructure = {}

        for (const secret of cassandraSecrets) {
            const segments = secret.split('/')
            const storeRoot = segments[0]
            const env = segments[2]
            const purpose = segments[3]
            const detail = segments[4]

            console.log(secret)
            directoryStructure = buildDirectoryObject(directoryStructure, [ storeRoot, env, purpose, detail ])
            directoryStructure[storeRoot][env][purpose][detail] = await gopass.show(secret)
        }

        return directoryStructure
    }

    static buildConnections(directory) {
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

    static formatConnections(connections) {
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
