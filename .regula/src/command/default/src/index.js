const { ProjectRoute } = require('../../../path')
const comment = require('./comment')

async function setupRoutes() {
    const ignoreByDefault = ['node_modules', '.next', '.regula', '.git']

    console.log('Checking if you have .npmignore')

    const hasNPMIgnore = await ProjectRoute._file.accessFile(
        ProjectRoute.plug('main', '.npmignore')
    )

    console.log('.npmignore', hasNPMIgnore)

    if (!!hasNPMIgnore) {
        const npmIgnore = await ProjectRoute._file.read({
            route: 'main',
            filename: '.npmignore',
        })

        if (!!npmIgnore) {
            console.log('Reading .npmignore')

            const lines = npmIgnore.split(/\n|\r/)
            lines.map((toIgnore) => {
                const value = toIgnore.trimLeft()
                if (ignoreByDefault.indexOf(value) === -1) {
                    ignoreByDefault.push(value.replace(/(\/|\\)$/g, ''))
                }
            })
        }
    }

    ProjectRoute._routes = ProjectRoute._routes.filter(
        (folder) => ignoreByDefault.indexOf(folder.name) === -1
    )

    console.log(ProjectRoute.routes())
}

function recursiveFolder(route, response) {
    const folders = ProjectRoute.folders(route)
    // get all files

    const files = ProjectRoute.files(route)
    response.push(...files)

    if (folders.length > 0) {
        folders.map((folder) => {
            const reference = `${route}/${folder.name}`
            ProjectRoute.join(reference, route, folder.name)
            recursiveFolder(reference, response)
        })
    } else {
        return false
    }
}

async function getFiles() {
    const response = []
    await Promise.all(
        ProjectRoute.routes().map(async (route) => {
            const files = ProjectRoute.files(route.name)

            response.push(...files)
            if (route.name !== 'main') {
                recursiveFolder(route.name, response)
            }
        })
    )
    return response
}

async function start() {
    /* deleted — action (commented) at Thu Apr 09 2020 15:01:46 GMT-0300 (GMT-03:00) */
    const memoryBefore = process.memoryUsage().heapUsed / 1024 / 1024

    await setupRoutes()

    const files = (await getFiles()).filter((file) =>
        /\.(js|jsx|ts)$/.test(file.filename)
    )
    await comment(files, ProjectRoute)

    const memortAfter = process.memoryUsage().heapUsed / 1024 / 1024
    /* deleted — action (commented) at Thu Apr 09 2020 15:01:46 GMT-0300 (GMT-03:00) */
    console.log(
        `it was used ~${parseFloat(memortAfter - memoryBefore).toFixed(
            3
        )} MB in memory`,
        '\tstart ',
        memoryBefore,
        '\tend',
        memortAfter
    )
}

try {
    start()
} catch (error) {
    /* deleted — action (commented) at Thu Apr 09 2020 15:01:46 GMT-0300 (GMT-03:00) */
}
