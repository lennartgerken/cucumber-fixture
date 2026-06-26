import type {
    BeforeAll as OriginalBeforeAll,
    Before as OriginalBefore,
    defineStep as OriginalStep
} from '@cucumber/cucumber'
import { PseudoFixture, Definitions } from 'pseudo-fixture'

type BaseGlobalHook = typeof OriginalBeforeAll
type BaseHook = typeof OriginalBefore
type BaseStep = typeof OriginalStep

type Code<F, A extends unknown[]> = (
    fixtures: F,
    ...args: A
) => Promise<void> | void

type HookCode<F> = (
    fixtures: F,
    options: Parameters<Parameters<BaseHook>[1]>[0]
) => Promise<void> | void

type GlobalHookCode<F> = (fixtures: F) => Promise<void> | void

type Step<F> = {
    <A extends unknown[]>(
        pattern: string | RegExp,
        options: Parameters<BaseStep>[1],
        code: Code<F, A>
    ): void
    <A extends unknown[]>(pattern: string | RegExp, code: Code<F, A>): void
}

type Hook<F> = {
    (options: Parameters<BaseHook>[0], code: HookCode<F>): void
    (code: HookCode<F>): void
}

type GlobalHook<F> = {
    (options: Parameters<BaseGlobalHook>[0], code: GlobalHookCode<F>): void
    (code: GlobalHookCode<F>): void
}

export function createKeywords<F extends object>(
    baseBeforeAll: BaseGlobalHook,
    baseAfterAll: BaseGlobalHook,
    baseBefore: BaseHook,
    baseAfter: BaseHook,
    defineStep: BaseStep,
    fixtureDefinitions: Definitions<F, object>
): {
    BeforeAll: GlobalHook<F>
    AfterAll: GlobalHook<F>
    Before: Hook<F>
    After: Hook<F>
    Given: Step<F>
    When: Step<F>
    Then: Step<F>
} {
    const pseudoFixture = new PseudoFixture<F>(fixtureDefinitions)
    baseAfter(() => pseudoFixture.runTeardown())
    baseAfterAll(() => pseudoFixture.runGlobalTeardown())

    function createCallback<B extends unknown[]>(code: Code<F, B>) {
        const callback = (...args: unknown[]) => {
            return pseudoFixture.run(code, ...(args as B))
        }
        const originalLength = code.length
        Object.defineProperty(callback, 'length', {
            value: originalLength > 0 ? code.length - 1 : 0
        })
        return callback
    }

    function createHook(baseHook: BaseHook) {
        return function (
            optionsOrCode: Parameters<BaseHook>[0] | HookCode<F>,
            code?: HookCode<F>
        ) {
            if (typeof optionsOrCode === 'function')
                baseHook(createCallback(optionsOrCode))
            else baseHook(optionsOrCode, createCallback(code!))
        }
    }

    function createGlobalHook(baseGlobalHook: BaseGlobalHook) {
        return function (
            optionsOrCode: Parameters<BaseGlobalHook>[0] | GlobalHookCode<F>,
            code?: GlobalHookCode<F>
        ) {
            if (typeof optionsOrCode === 'function')
                baseGlobalHook(createCallback(optionsOrCode))
            else baseGlobalHook(optionsOrCode, createCallback(code!))
        }
    }

    const fixDefineStep = function <A extends unknown[]>(
        pattern: string | RegExp,
        optionsOrCode: Parameters<BaseStep>[1] | Code<F, A>,
        code?: Code<F, A>
    ) {
        if (typeof optionsOrCode === 'function')
            defineStep(pattern, createCallback(optionsOrCode))
        else defineStep(pattern, optionsOrCode, createCallback(code!))
    }

    return {
        BeforeAll: createGlobalHook(baseBeforeAll),
        AfterAll: createGlobalHook(baseAfterAll),
        Before: createHook(baseBefore),
        After: createHook(baseAfter),
        Given: fixDefineStep,
        When: fixDefineStep,
        Then: fixDefineStep
    }
}
