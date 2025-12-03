import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/elementx.js',
            format: 'iife',  // 使用IIFE格式，更适合浏览器
            name: 'elementX',
            sourcemap: true
        }
    ],
    plugins: [
        resolve({
            extensions: ['.js']
        }),
        commonjs({
            transformMixedEsModules: true
        })
    ]
};