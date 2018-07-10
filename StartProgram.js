const js2xmlparser = require('js2xmlparser')
const program = require('commander')
const Extractor = require('./Extractor')
const ConfigWrapper = require('./ConfigWrapper')

program
    .version(require('./package.json').version)
    .option('-d, --details [value]', 'Comma separated details to extract from the secrets last fragment. Default: username,password,nodes')
    .option('-e, --environments [value]', 'Comma separated environments to consider. Default: dev,pp,prod')
    .option('-p, --prefix [value]', 'Prefix that must match for the second segment of a secret name. Default: cassandra (e.g. company/cassandra/something will match')
    .parse(process.argv)

const runCli = async (config) => {
    const extractor = new Extractor()
    const devCenterConnections = await extractor.generateDevCenterCredentials(config)
    const asXml = js2xmlparser.parse('connectionList', { connections: devCenterConnections })
    console.log(asXml)
}
runCli(new ConfigWrapper(program))
