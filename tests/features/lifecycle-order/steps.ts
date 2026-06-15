import { createKeywords } from '../../../dist'
import { writeLog } from '../../log'
import {
    Before as baseBefore,
    After as baseAfter,
    defineStep
} from '@cucumber/cucumber'

const { Given, When, Then, Before, After } = createKeywords<{
    data1: void
    data2: void
}>(baseBefore, baseAfter, defineStep, {
    data1: {
        setup: ({ data2: _ }) => writeLog('setup:data1'),
        teardown: () => writeLog('teardown:data1')
    },
    data2: {
        setup: () => writeLog('setup:data2'),
        teardown: () => writeLog(`teardown:data2`)
    }
})

Before(() => writeLog('before'))

After(() => writeLog('after'))

Given('some GIVEN step', async ({ data1: _ }) => {
    writeLog('given start')
    await new Promise((resolve) => setTimeout(resolve, 10))
    writeLog('given end')
})

When('some WHEN step', () => writeLog('when'))

Then('some THEN step', () => writeLog('then'))
