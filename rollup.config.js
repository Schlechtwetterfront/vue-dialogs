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

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: `dist/${manifest.name}.js`,
                format: 'umd',
                name: 'VueDialogs',
                ...outputDefaults,
            },
            {
                file: `dist/${manifest.name}.common.js`,
                format: 'cjs',
                ...outputDefaults,
            },
            {
                file: `dist/${manifest.name}.esm.js`,
                format: 'es',
                ...outputDefaults,
            },
        ],
        external: ['vue'],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                tsconfigOverride: {
                    compilerOptions: {
                        sourceMap: true,
                        declaration: true,
                        declarationMap: true,
                    },
                },
            }),
            resolve(),
            commonjs(),
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            file: `dist/${manifest.name}.min.js`,
            format: 'umd',
            name: manifest.name,
            ...outputDefaults,
        },
        external: ['vue'],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                tsconfigOverride: {
                    compilerOptions: {
                        sourceMap: true,
                        declaration: true,
                        declarationMap: true,
                    },
                },
            }),
            resolve(),
            commonjs(),
            terser(),
        ],
    },
];
