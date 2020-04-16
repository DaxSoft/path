'use strict'
const path = require('path')
const fs = require('fs').promises
module.exports = async function (files, Route) {
    await Promise.all(
        files.map(async (file, n) => {
            console.log(
                'filename:',
                file.filename,
                'from',
                path.dirname(file.path)
            )

            const filepath = path.resolve(
                path.dirname(file.path),
                file.filename
            )

            let content = ''
            content = await fs.readFile(filepath, 'utf8')

            const rule = /(\s?console\.(\w+)\s?(\((.|\n)*?\)))/gm

            const time = new Date()

            let data = content.replace(
                rule,
                `/* deleted — action (commented) at ${time} */`
            )

            await fs.writeFile(filepath, data, 'utf8')
        })
    )
}
