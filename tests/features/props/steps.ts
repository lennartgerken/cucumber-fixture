import { expect } from 'vitest'
import { createKeywords } from '../../../dist'
import {
    Before as baseBefore,
    After as baseAfter,
    defineStep,
    DataTable
} from '@cucumber/cucumber'

let expectedData1: string

const { Given, When } = createKeywords<{
    data1: string
}>(baseBefore, baseAfter, defineStep, {
    data1: () => {
        expectedData1 = crypto.randomUUID()
        return expectedData1
    }
})

Given(
    'some GIVEN step {string} {float}',
    ({ data1 }, stringData: string, numberData: number) => {
        expect(data1).toBe(expectedData1)
        expect(stringData).toBe('some data')
        expect(numberData).toBe(10)
    }
)

When('some WHEN step:', ({}, dataTable: DataTable) => {
    expect(dataTable.hashes()).toEqual([
        { data1: 'data1.1', data2: 'data2.1' },
        { data1: 'data1.2', data2: 'data2.2' }
    ])
})
