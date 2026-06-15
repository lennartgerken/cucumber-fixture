import { execSync } from 'child_process'
import { mkdirSync, readFileSync, rmSync } from 'fs'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { join } from 'path'

const runCucumber = async (path: string) => {
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
            'before',
            'setup:data2',
            'setup:data1',
            'given start',
            'given end',
            'when',
            'then',
            'after',
            'teardown:data1',
            'teardown:data2'
        ])
    })

    afterAll(() => rmSync(logsPath, { recursive: true, force: true }))
})

test('async fixture', () => runCucumber('./tests/features/async-fixture'))

test('pass fixture through lifecycle', () =>
    runCucumber('./tests/features/lifecycle-fixture'))

test('pass props', () => runCucumber('./tests/features/props'))
