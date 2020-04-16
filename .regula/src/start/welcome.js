const chalk = require('chalk')

module.exports = async function ({ MainRoute, ProjectRoute }) {
    console.log(
        chalk.blueBright('.regula'),
        `${MainRoute.getItem('package.json').version}v`
    )
    console.log()

    console.log(
        '\t',
        chalk.green('Project:'),
        ProjectRoute.getItem('package.json').name
    )
    console.log(
        '\t',
        chalk.green('Version:'),
        `${ProjectRoute.getItem('package.json').version}v`
    )
    console.log()
}
