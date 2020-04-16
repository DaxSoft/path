'use strict'

const clear = require('clear')
const { ProjectRoute, MainRoute } = require('../path')

const WelcomePoint = require('./welcome')
const FirstOptions = require('./options')
const CommandOptions = require('./command')

/*
 : [start]
 :
 : Bootstrap application and ask general questions before execute a command!
*/

void (async function () {
    const Setup = {
        start: null,
    }

    // clear command
    clear()

    // welcome message
    await WelcomePoint({ ProjectRoute, MainRoute })

    // get first step
    await FirstOptions({ ProjectRoute, MainRoute, Setup })

    // from choice

    if (Setup.start === 'command')
        await CommandOptions({ ProjectRoute, MainRoute, Setup })
})()
