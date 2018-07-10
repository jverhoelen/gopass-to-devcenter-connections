class ConfigWrapper {
    constructor(program) {
        const allowedArguments = ['details', 'environments', 'prefix']
        this.cliArguments = allowedArguments.reduce((prev, curr) => {
            prev[curr] = program[curr]
            return prev
        }, {})
    }

    requiredDetails() {
        return this.cliArguments.details ? this.cliArguments.details.split(',') : ['username', 'password', 'nodes']
    }

    environments() {
        return this.cliArguments.environments ? this.cliArguments.environments.split(',') : ['dev', 'pp', 'prod']
    }

    prefix() {
        return this.cliArguments.prefix || 'cassandra'
    }
}

module.exports = ConfigWrapper
