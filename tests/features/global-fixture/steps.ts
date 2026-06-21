import { expect } from 'vitest'
import { createKeywords } from '../../../dist'
import {
    BeforeAll as baseBeforeAll,
    AfterAll as baseAfterAll,
    Before as baseBefore,
    After as baseAfter,
    defineStep
} from '@cucumber/cucumber'

let setupCount = 0
let expectedData1: string

const { BeforeAll, AfterAll, Before, After, Given } = createKeywords<{
    data1: string
    data2: void
}>(baseBeforeAll, baseAfterAll, baseBefore, baseAfter, defineStep, {
    data1: {
        setup: () => {
            setupCount++
            expect(setupCount).toBe(1)
            expectedData1 = crypto.randomUUID()
            return expectedData1
        },
        teardown: ({ data1 }) => expect(data1).toBe(expectedData1),
        global: true
    },
    data2: {
        setup: ({ data1 }) => expect(data1).toBe(expectedData1),
        teardown: ({ data1 }) => expect(data1).toBe(expectedData1)
    }
})

BeforeAll(({ data1 }) => expect(data1).toBe(expectedData1))

AfterAll(({ data1 }) => expect(data1).toBe(expectedData1))

Before(({ data1 }) => expect(data1).toBe(expectedData1))

After(({ data1 }) => expect(data1).toBe(expectedData1))

Given('some GIVEN step', ({ data1 }) => expect(data1).toBe(expectedData1))
