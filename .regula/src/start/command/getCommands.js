const path = require('path')

async function commandIsValid({ MainRoute, value }) {
    const hasPackage = await MainRoute._file.accessFile(value.path)
    return !!hasPackage
}

async function commandPackage({ MainRoute, value }) {
    MainRoute.set(`~temp_${value.name}`, value.path)
    const getPackage = await MainRoute.getItem('json').read({
        route: `~temp_${value.name}`,
        filename: 'package.json',
    })
    return getPackage
}

module.exports = async function ({ MainRoute, Setup }) {
    const commands = []
    await Promise.all(
        MainRoute.folders('command').map(async (value) => {
            // check if it is valid
            const isValid = await commandIsValid({ MainRoute, value })

            if (!isValid) return false

            const getPackage = await commandPackage({ MainRoute, value })

            const response = {
                name: `${getPackage.name}`,
                value: {
                    package: getPackage,
                    path: value.path,
                    name: value.name,
                },
                short: getPackage.description,
            }

            commands.push(response)
        })
    )

    return commands
}
