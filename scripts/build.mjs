#!/usr/bin/env zx

import 'zx/globals'
import * as esbuild from 'esbuild'

async function build() {
  await esbuild.build({
    bundle: true,
    entryPoints: ['index.ts'],
    outfile: 'outfile.cjs',
    format: 'cjs',
    platform: 'node',
    target: 'node14',
    plugins: []
  })
}

build()