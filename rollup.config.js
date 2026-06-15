import typescript from '@rollup/plugin-typescript'

const external = ['@cucumber/cucumber', 'pseudo-fixture']

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'es'
        },
        external,
        plugins: [
            typescript({
                compilerOptions: {
                    declaration: true,
                    declarationDir: 'dist'
                }
            })
        ]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.cjs',
            format: 'cjs'
        },
        external,
        plugins: [typescript()]
    }
]
