const { build } = require('esbuild')

build({
    stdio: 'inherit',
    entryPoints: ['./src/index.ts'],
    outdir: 'dist',
    minify: true,
    bundle: true,
    platform: 'node',
}).catch(() => process.exit(1))
