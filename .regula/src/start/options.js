const inquirer = require('inquirer')

module.exports = async function ({ MainRoute, Setup }) {
    const value = await inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What do you want to do?',
            choices: ['Command', 'Analyse', 'Exit'],
            default: 'Command',
            filter: (input) => input.toLowerCase(),
        },
    ])
    Setup.start = value.start
}
