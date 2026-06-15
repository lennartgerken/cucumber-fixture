import { expect } from 'vitest'
import { createKeywords } from '../../../dist'
import {
    Before as baseBefore,
    After as baseAfter,
    defineStep
} from '@cucumber/cucumber'

let expectedData1: string

const { Given, When, Then, Before, After } = createKeywords<{
    data1: string
    data2: void
}>(baseBefore, baseAfter, defineStep, {
    data1: {
        setup: () => {
            expectedData1 = crypto.randomUUID()
            return expectedData1
        },
        teardown: ({ data1 }) => expect(data1).toBe(expectedData1)
    },
    data2: {
        setup: ({ data1 }) => expect(data1).toBe(expectedData1),
        teardown: ({ data1 }) => expect(data1).toBe(expectedData1)
    }
})

Before(({ data1 }) => expect(data1).toBe(expectedData1))

After(({ data1 }) => expect(data1).toBe(expectedData1))

Given('some GIVEN step', ({ data1 }) => expect(data1).toBe(expectedData1))

When('some WHEN step', ({ data1 }) => expect(data1).toBe(expectedData1))

Then('some THEN step', ({ data1 }) => expect(data1).toBe(expectedData1))
