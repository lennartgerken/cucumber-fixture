import { execSync } from 'child_process'
import { mkdirSync, readFileSync, rmSync } from 'fs'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { join } from 'path'
import { globSync } from 'fs'

const runCucumber = async (path: string) => {
    const features = globSync(path)
    if (features.length === 0) throw new Error('No feature files found')
    execSync(`npx cucumber-js ${path} --import ${path}/steps.ts`)
}

test.describe('log based', () => {
    const logsPath = './logs'

    beforeAll(() => mkdirSync(logsPath, { recursive: true }))

    const runCucumberWithLog = async (path: string) => {
        const logFile = join(logsPath, crypto.randomUUID())
        process.env.TEST_LOG_FILE = logFile
        mkdirSync(logsPath, { recursive: true })
        runCucumber(path)
        return readFileSync(logFile, 'utf-8').split('\n').filter(Boolean)
    }

    test('run lifecycle in order', async () => {
        expect(
            await runCucumberWithLog('./tests/features/lifecycle-order')
        ).toEqual([
            'setup:data3',
            'before all',
            'before',
            'setup:data2',
            'setup:data1',
            'given start',
            'given end',
            'when',
            'then',
            'after',
            'teardown:data1',
            'teardown:data2',
            'before',
            'setup:data2',
            'setup:data1',
            'given start',
            'given end',
            'when',
            'then',
            'after',
            'teardown:data1',
            'teardown:data2',
            'after all',
            'teardown:data3'
        ])
    })

    afterAll(() => rmSync(logsPath, { recursive: true, force: true }))
})

test('async fixture', () => runCucumber('./tests/features/async-fixture'))

test('keep global fixture', () =>
    runCucumber('./tests/features/global-fixture'))

test('pass fixture through lifecycle', () =>
    runCucumber('./tests/features/lifecycle-fixture'))

test('pass props', () => runCucumber('./tests/features/props'))
