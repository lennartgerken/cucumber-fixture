import type {
    Before as OriginalBefore,
    defineStep as OriginalStep
} from '@cucumber/cucumber'
import { PseudoFixture } from 'pseudo-fixture'

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

export function createKeywords<F extends object>(
    baseBefore: BaseHook,
    baseAfter: BaseHook,
    defineStep: BaseStep,
    fixtureDefinitions: ConstructorParameters<typeof PseudoFixture<F>>[0]
): {
    Given: Step<F>
    When: Step<F>
    Then: Step<F>
    Before: Hook<F>
    After: Hook<F>
} {
    const pseudoFixture = new PseudoFixture<F>(fixtureDefinitions)
    baseAfter(() => pseudoFixture.runTeardown())

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
            function isHookCode(
                data: Parameters<BaseHook>[0] | HookCode<F>
            ): data is HookCode<F> {
                return typeof data === 'function'
            }

            if (isHookCode(optionsOrCode))
                baseHook(createCallback(optionsOrCode))
            else baseHook(optionsOrCode, createCallback(code!))
        }
    }

    const fixDefineStep = function <A extends unknown[]>(
        pattern: string | RegExp,
        optionsOrCode: Parameters<BaseStep>[1] | Code<F, A>,
        code?: Code<F, A>
    ) {
        function isCode(
            data: Parameters<BaseStep>[1] | Code<F, A>
        ): data is Code<F, A> {
            return typeof data === 'function'
        }

        if (isCode(optionsOrCode))
            defineStep(pattern, createCallback(optionsOrCode))
        else defineStep(pattern, optionsOrCode, createCallback(code!))
    }

    return {
        Before: createHook(baseBefore),
        After: createHook(baseAfter),
        Given: fixDefineStep,
        When: fixDefineStep,
        Then: fixDefineStep
    }
}
