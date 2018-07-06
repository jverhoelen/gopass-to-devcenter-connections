const { exec } = require('child_process')
const gopassCommandName = 'gopass'

class Gopass {
    async verifyInstallation() {
        try {
            const result = await this.executeGopassCommand(['--version'])
            return result.includes(gopassCommandName)
        } catch (e) {
            return false
        }
    }

    show(path) {
        return this.executeGopassCommand(['show', path])
    }

    sync() {
        return this.executeGopassCommand(['sync'])
    }

    async secrets() {
        const flatSecrets = await this.executeGopassCommand(['list', '--flat'])
        return flatSecrets.split(/\r?\n/)
    }

    executeGopassCommand(args) {
        return new Promise(((resolve, reject) => {
            exec(`${gopassCommandName} ${args.join(' ')}`, (err, stdout, stderr) => {
                if (err) {
                    reject(new Error(err, stderr))
                } else {
                    resolve(stdout)
                }
            })
        }))
    }
}

module.exports = Gopass
