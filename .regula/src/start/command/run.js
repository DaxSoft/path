const chalk = require('chalk')
const inquirer = require('inquirer')
const child_process = require('child_process')

function scriptsChoices({ Setup }) {
    const choices = []
    Object.keys(Setup.currentCommand.package.scripts).map((key) => {
        const value = Setup.currentCommand.package.scripts[key]
        choices.push({
            name: `${key} (${value})`,
            value: {
                key,
                cmd: value,
            },
        })
    })
    return choices
}

module.exports = async function ({ MainRoute, ProjectRoute, Setup }) {
    console.log(chalk.blueBright(Setup.currentCommand.package.name))
    console.log(chalk.italic(Setup.currentCommand.package.description))
    console.log()

    const scripts = scriptsChoices({ Setup })

    const whichAction = await inquirer.prompt([
        {
            name: 'scripts',
            type: 'list',
            message: 'Choose a action script from this command:',
            choices: [
                ...scripts,
                {
                    name: 'Exit',
                    value: null,
                },
            ],
        },
    ])

    if (whichAction.scripts === null) return

    const nodeCMD = whichAction.scripts.key

    const cmd_path = ProjectRoute.plug(
        '.regula',
        `src/command/${Setup.currentCommand.name}`
    )

    const cmd = `start cmd.exe /k "cd ${cmd_path} & npm run ${nodeCMD}"`

    console.log(cmd)

    child_process.exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        console.log(`stdout: ${stdout}`)
    })
}
