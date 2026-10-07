/**
 * ============================================================================
 * CalVerse Pro - Zero-Dependency Static Asset Bundler & Watcher
 * File: build.js
 * ============================================================================
 * 
 * MODULE OVERVIEW:
 * A lightweight, ultra-fast (~9ms) Node.js bundler designed specifically for CalVerse.
 * Eliminates external build tool dependencies (Webpack, Rollup, Vite) so the project
 * builds instantly using vanilla Node.js.
 * 
 * CORE PIPELINE FUNCTIONS:
 * 1. bundle():
 *    - Sequentially reads the 25 modular ES6 files in topological dependency order.
 *    - Strips 'import' statements (including multi-line import patterns).
 *    - Strips 'export' modifiers while preserving variable declarations.
 *    - Wraps everything in a self-executing IIFE with 'use strict' to prevent global namespace pollution.
 *    - Writes the production bundle directly to assets/js/script.js.
 * 
 * 2. watch mode (--watch):
 *    - Watches the src/ directory for any file modifications and automatically re-bundles.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ordered module list respecting dependencies
const MODULE_FILES = [
    'src/core/constants.js',
    'src/core/sound.js',
    'src/core/dom.js',
    'src/core/format.js',
    'src/core/storage.js',
    'src/core/state.js',
    'src/core/math.js',
    'src/features/standard.js',
    'src/features/scientific.js',
    'src/features/graphing.js',
    'src/features/financial.js',
    'src/features/programmer.js',
    'src/features/converter.js',
    'src/features/health.js',
    'src/features/date.js',
    'src/features/time.js',
    'src/features/discount.js',
    'src/features/equations.js',
    'src/features/statistics.js',
    'src/ui/theme.js',
    'src/ui/clock.js',
    'src/ui/keyboard.js',
    'src/ui/navigation.js',
    'src/ui/pwa.js',
    'src/main.js'
];

const OUTPUT_FILE = path.join(__dirname, 'assets/js/script.js');

function bundle() {
    const startTime = Date.now();
    let concatenated = '';

    for (const relPath of MODULE_FILES) {
        const fullPath = path.join(__dirname, relPath);
        if (!fs.existsSync(fullPath)) {
            console.error(`❌ Module not found: ${relPath}`);
            process.exit(1);
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Clean out ES import statements (including multi-line imports)
        content = content.replace(/import\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"][^'"]+['"];?/gs, '');

        // Clean out export keywords while keeping declarations
        // e.g. "export const Foo = ..." -> "const Foo = ..."
        // e.g. "export function bar() ..." -> "function bar() ..."
        // e.g. "export { a, b };" -> ""
        content = content.replace(/^export\s+(const|let|var|function|class)\s+/gm, '$1 ');
        content = content.replace(/^export\s+default\s+/gm, '');
        content = content.replace(/^export\s*\{[^}]*\};?\s*$/gm, '');

        concatenated += `\n    // -------------------------------------------------------------------------\n`;
        concatenated += `    // Module: ${relPath}\n`;
        concatenated += `    // -------------------------------------------------------------------------\n`;
        concatenated += content
            .split('\n')
            .map(line => `    ${line}`)
            .join('\n') + '\n';
    }

    const header = `/**
 * CalVerse Pro - Compiled Production Bundle
 * Generated from modular src/ architecture
 * Built: ${new Date().toISOString()}
 * Zero dependencies • Offline-ready PWA
 */

(function () {
    'use strict';
`;

    const footer = `\n})();\n`;

    const finalBundle = header + concatenated + footer;

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, finalBundle, 'utf8');

    const elapsed = Date.now() - startTime;
    const sizeKB = (Buffer.byteLength(finalBundle, 'utf8') / 1024).toFixed(1);
    console.log(`✅ [Bundle Complete] ${OUTPUT_FILE} (${sizeKB} KB) in ${elapsed}ms`);
}

bundle();

if (process.argv.includes('--watch')) {
    console.log('👀 Watching src/ for changes...');
    const srcDir = path.join(__dirname, 'src');
    fs.watch(srcDir, { recursive: true }, (event, filename) => {
        if (filename && filename.endsWith('.js')) {
            console.log(`🔄 Detected change in ${filename}, rebuilding...`);
            try {
                bundle();
            } catch (err) {
                console.error(`❌ Build error:`, err);
            }
        }
    });
}
