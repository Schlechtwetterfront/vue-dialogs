import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const manifest = require('./package.json');

const banner = `/*!
    * ${manifest.name} v${manifest.version}
    * ${manifest.repository}
    * @license ${manifest.license}
    * */`;

const outputDefaults = {
    banner,
    globals: {
        vue: 'Vue',
    },
};

const tsOptions = {
    tsconfig: './tsconfig.json',
    tsconfigOverride: {
        compilerOptions: {
            sourceMap: true,
            declaration: true,
            declarationMap: true,
        },
        exclude: ['tests'],
    },
};

export default [
    {
        input: 'src/index.ts',
        output: [
            // global
            {
                file: manifest.unpkg,
                format: 'iife',
                name: 'VueDialogs',
                ...outputDefaults,
            },
            {
                file: manifest.main,
                format: 'cjs',
                ...outputDefaults,
            },
            {
                file: manifest.browser,
                format: 'es',
                ...outputDefaults,
            },
        ],
        external: ['vue'],
        plugins: [typescript(tsOptions), resolve(), commonjs()],
    },
    {
        input: 'src/index.ts',
        output: {
            file: `dist/vue-dialogs.global.prod.js`,
            format: 'iife',
            name: 'VueDialogs',
            ...outputDefaults,
        },
        external: ['vue'],
        plugins: [
            typescript(tsOptions),
            resolve(),
            commonjs(),
            terser({
                module: false,
                compress: {
                    ecma: 5,
                    pure_getters: true,
                },
            }),
        ],
    },
];
