# cucumber-fixture

`cucumber-fixture` provides a fixture structure for Cucumber step definitions.

## Installation

```sh
npm i -D cucumber-fixture
```

## Usage

To use `cucumber-fixture`, call `createKeywords`, pass the original Cucumber keywords, and define the fixtures you need.

For every fixture, define a `setup` function that specifies how the fixture is created. You can also optionally define a `teardown` function. `teardown` functions are called automatically after each test.

A fixture can also be marked as `global` to keep it alive for the whole test run. In that case, its `teardown` is run automatically after the run.

An example would be to define fixtures for E2E tests:

```ts
import { createKeywords } from 'cucumber-fixture'
import {
    BeforeAll as baseBeforeAll,
    AfterAll as baseAfterAll,
    Before as baseBefore,
    After as baseAfter,
    defineStep
} from '@cucumber/cucumber'
import { Browser, BrowserContext, chromium, Page } from 'playwright'
import { CustomWorld, world } from '@/features/support/world'
import { SomePageObject } from '@/pages/some-page-object'

export const { BeforeAll, AfterAll, Before, After, Given, When, Then } =
    createKeywords<{
        world: CustomWorld
        browser: Browser
        context: BrowserContext
        page: Page
        somePageObject: SomePageObject
    }>(baseBeforeAll, baseAfterAll, baseBefore, baseAfter, defineStep, {
        world: () => world,
        browser: {
            setup: () => chromium.launch(),
            teardown: ({ browser }) => browser.close(),
            global: true
        },
        context: {
            setup: ({ browser }) => browser.newContext(),
            teardown: ({ context }) => context.close()
        },
        page: ({ context }) => context.newPage(),
        somePageObject: ({ page }) => {
            // Initialize the page object.
            // ...
            return new SomePageObject(page)
        }
    })
```

You can now use your fixtures directly in your step definitions:

```ts
import { Given } from '@/keywords'

Given(
    'some Given step with a parameter {string}',
    async ({ somePageObject }, someData: string) => {
        // Use the fixtures in your step definitions.
        await somePageObject.doSomething(someData)
    }
)
```

## License

This package is licensed under the [MIT License](./LICENSE).
