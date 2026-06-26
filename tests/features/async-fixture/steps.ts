import { expect } from 'vitest'
import { createKeywords } from '../../../dist'
import {
    BeforeAll as baseBeforeAll,
    AfterAll as baseAfterAll,
    Before as baseBefore,
    After as baseAfter,
    defineStep
} from '@cucumber/cucumber'

let expectedData1: string

const { Given } = createKeywords<{
    data1: string
}>(baseBeforeAll, baseAfterAll, baseBefore, baseAfter, defineStep, {
    data1: async () => {
        expectedData1 = crypto.randomUUID()
        await new Promise((resolve) => setTimeout(resolve, 10))
        return expectedData1
    }
})

Given('some GIVEN step', ({ data1 }) => expect(data1).toBe(expectedData1))
