import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 手动构建
function build() {
    console.log('🔨 Building elementX library...');

    const files = [
        // 按依赖顺序排列
        join(__dirname, 'src', 'core', 'utils.js'),
        join(__dirname, 'src', 'core', 'observer.js'),
        join(__dirname, 'src', 'core', 'template-engine.js'),
        join(__dirname, 'src', 'core', 'ElementXBase.js'),
        join(__dirname, 'src', 'decorators', 'property.js'),
        join(__dirname, 'src', 'decorators', 'event.js'),
        join(__dirname, 'src', 'components', 'elx-button.js'),
        join(__dirname, 'src', 'components', 'elx-input.js'),
        join(__dirname, 'src', 'index.js')
    ];

    let content = '';

    // 添加头部注释
    content += `// elementX Web Components Library v1.0.0
// Built: ${new Date().toISOString()}
// License: MIT

`;

    // 合并所有文件
    files.forEach(file => {
        console.log(`📄 Reading: ${file}`);
        try {
            const fileContent = readFileSync(file, 'utf8');
            // 移除所有导入导出语句
            const cleaned = fileContent
                .replace(/^import\s+.*?from\s+['"][^'"]+['"];?$\n?/gm, '')
                .replace(/^export\s+.*?$/gm, '')
                .replace(/export\s+default\s+/g, '')
                .replace(/export\s+{\s*.*?\s*};?/g, '');

            content += `\n// Source: ${file}\n`;
            content += cleaned + '\n';
        } catch (err) {
            console.error(`❌ Error reading ${file}:`, err.message);
        }
    });

    // 创建 dist 目录
    const distDir = join(__dirname, 'dist');
    if (!existsSync(distDir)) {
        mkdirSync(distDir, {recursive: true});
    }

    // 写入文件
    writeFileSync(join(distDir, 'elementx.js'), content);
    console.log('✅ Build complete: dist/elementx.js');
}

// 执行构建
build();