'use strict'

const { exec } = require('child_process')
const clear = require('clear')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { ProjectRoute } = require('../../../path')

const SHORT_COMMAND_NAME = '@v/clear-log'
const DEFAULT_COMMAND_NAME = '@vorlefan/clear-console'

const START_COMMAND_PATH = 'node .regula/src/command/default/src/index.js'

async function checkout() {
    console.log(
        chalk.blueBright('Checking if you already have this command...')
    )
    const pkg = ProjectRoute.getItem('package.json')

    console.log(pkg)

    const scripts = pkg.hasOwnProperty('scripts') ? pkg.scripts : null
    return (
        !!scripts &&
        (scripts.hasOwnProperty(DEFAULT_COMMAND_NAME) ||
            scripts.hasOwnProperty(SHORT_COMMAND_NAME))
    )
}

async function addToGlobal(scriptName) {
    const pkg = ProjectRoute.getItem('package.json')
    pkg.scripts = typeof pkg.scripts === 'object' ? pkg.scripts : {}
    pkg.scripts[scriptName] = START_COMMAND_PATH
    console.log(chalk.blueBright('Saving...'))
    await ProjectRoute.getItem('json').store({
        route: 'main',
        filename: 'package.json',
        data: pkg,
        force: true,
    })
}

async function removeGlobal() {
    const pkg = ProjectRoute.getItem('package.json')
    pkg.scripts = typeof pkg.scripts === 'object' ? pkg.scripts : {}
    if (pkg.scripts.hasOwnProperty(SHORT_COMMAND_NAME))
        delete pkg.scripts[SHORT_COMMAND_NAME]
    if (pkg.scripts.hasOwnProperty(DEFAULT_COMMAND_NAME))
        delete pkg.scripts[DEFAULT_COMMAND_NAME]
    console.log(chalk.blueBright('Saving...'))
    await ProjectRoute.getItem('json').store({
        route: 'main',
        filename: 'package.json',
        data: pkg,
        force: true,
    })
}

async function toRemove() {
    const confirm = await inquirer.prompt([
        {
            type: 'list',
            name: 'confirmValue',
            message:
                'Do you want to remove this global command from your project?',
            choices: [
                {
                    name: 'Yes',
                    value: true,
                },
                {
                    name: 'No',
                    value: false,
                },
            ],
        },
    ])

    const { confirmValue } = confirm
    if (!confirmValue) return

    await removeGlobal()
}

void (async function () {
    const isChecking = await checkout()

    if (!!isChecking) {
        await toRemove()
        return false
    }

    clear()

    console.log(
        chalk.blueBright('Global Command:'),
        '\t',
        DEFAULT_COMMAND_NAME,
        chalk.redBright('or'),
        START_COMMAND_PATH
    )
    console.log()

    const confirm = await inquirer.prompt([
        {
            type: 'list',
            name: 'confirmValue',
            message:
                'Do you want to export this command to the global scripts of your project?',
            choices: [
                {
                    name: 'Yes',
                    value: true,
                },
                {
                    name: 'No',
                    value: false,
                },
            ],
        },
    ])

    const { confirmValue } = confirm
    if (!confirmValue) return

    console.log(chalk.greenBright('Exporting to global scripts...'), '\n')

    const abbreviate = await inquirer.prompt([
        {
            type: 'list',
            name: 'confirmAbbreviate',
            message: 'Do you want to abbreviate this command name?',
            choices: [
                {
                    name: SHORT_COMMAND_NAME,
                    value: SHORT_COMMAND_NAME,
                },
                {
                    name: DEFAULT_COMMAND_NAME,
                    value: DEFAULT_COMMAND_NAME,
                },
            ],
        },
    ])

    const { confirmAbbreviate } = abbreviate

    const scriptName = confirmAbbreviate

    await addToGlobal(scriptName)

    clear()
})()
