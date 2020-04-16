const clear = require('clear')
const chalk = require('chalk')

const getCommands = require('./getCommands')
const chooseCommand = require('./choose')
const runCommand = require('./run')

module.exports = async function ({ MainRoute, ProjectRoute, Setup }) {
    clear()

    Setup.commands = [...(await getCommands({ MainRoute, Setup }))]

    console.log(
        chalk.greenBright('Total of Commands Available is:'),
        Setup.commands.length
    )

    console.log()

    await chooseCommand({ Setup })

    if (!!Setup.currentCommand) {
        clear()
        await runCommand({ MainRoute, ProjectRoute, Setup })
    }
}
