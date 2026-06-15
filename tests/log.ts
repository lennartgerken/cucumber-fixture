import { appendFileSync } from 'node:fs'

const logFile = process.env.TEST_LOG_FILE!

export function writeLog(message: string): void {
    appendFileSync(logFile, `${message}\n`)
}
