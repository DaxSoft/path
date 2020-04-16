const inquirer = require('inquirer')

async function chooseCommand({ Setup }) {
    const whichCommand = await inquirer.prompt([
        {
            type: 'list',
            name: 'command',
            message:
                'Choose a command from this list to read the description and confirm it:',
            choices: [
                {
                    name: 'Exit',
                    value: null,
                },
                ...Setup.commands,
            ],
        },
        {
            type: 'list',
            name: 'confirm',
            message: 'Are you sure?',
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

    if (whichCommand.confirm === false) {
        return await chooseCommand({ Setup })
    } else {
        if (!whichCommand.command) return false
        Setup.currentCommand = whichCommand.command
        return true
    }
}

module.exports = chooseCommand
