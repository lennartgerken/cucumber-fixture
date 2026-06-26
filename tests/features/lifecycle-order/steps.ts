import { createKeywords } from '../../../dist'
import { writeLog } from '../../log'
import {
    BeforeAll as baseBeforeAll,
    AfterAll as baseAfterAll,
    Before as baseBefore,
    After as baseAfter,
    defineStep
} from '@cucumber/cucumber'

const { BeforeAll, AfterAll, Before, After, Given, When, Then } =
    createKeywords<{
        data1: void
        data2: void
        data3: void
    }>(baseBeforeAll, baseAfterAll, baseBefore, baseAfter, defineStep, {
        data1: {
            setup: ({ data2: _ }) => writeLog('setup:data1'),
            teardown: () => writeLog('teardown:data1')
        },
        data2: {
            setup: ({ data3: _ }) => writeLog('setup:data2'),
            teardown: () => writeLog(`teardown:data2`)
        },
        data3: {
            setup: () => writeLog('setup:data3'),
            teardown: () => writeLog(`teardown:data3`),
            global: true
        }
    })

BeforeAll(({ data3: _ }) => writeLog('before all'))

AfterAll(() => writeLog('after all'))

Before(() => writeLog('before'))

After(() => writeLog('after'))

Given('some GIVEN step', async ({ data1: _ }) => {
    writeLog('given start')
    await new Promise((resolve) => setTimeout(resolve, 10))
    writeLog('given end')
})

When('some WHEN step', () => writeLog('when'))

Then('some THEN step', () => writeLog('then'))
