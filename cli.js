const program = require('commander')
const packageJson = require('./package.json')
const Extractor = require('./extractCassandraConnections')

program
  .version(packageJson.version)
  .parse(process.argv)

const run = async () => {
  const suitableSecrets = await Extractor.searchSuitableSecrets()
  const directoryStructure = await Extractor.buildDirectoryStructure(suitableSecrets)
  const connections = Extractor.buildConnections(directoryStructure)
  const devCenterConnections = Extractor.formatConnections(connections)

  console.log(JSON.stringify(devCenterConnections))
}
run()
