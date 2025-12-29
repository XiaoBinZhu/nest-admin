#!/usr/bin/env tsx
/**
 * 自动更新依赖脚本
 *
 * 使用方法:
 *   pnpm tsx scripts/update-dependencies.ts
 *
 * 或者添加到 package.json:
 *   "update:deps": "tsx scripts/update-dependencies.ts"
 */

import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const packageJsonPath = join(process.cwd(), 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

console.log('🔍 检查依赖更新...\n')

try {
  // 检查过时的依赖
  console.log('📦 检查过时的依赖包...')
  execSync('pnpm outdated', { stdio: 'inherit' })
}
catch (error) {
  console.log('✅ 所有依赖都是最新的，或者 pnpm outdated 命令执行失败')
}

console.log('\n💡 提示:')
console.log('1. 使用 "pnpm update" 更新所有依赖到最新兼容版本')
console.log('2. 使用 "pnpm update <package>" 更新特定包')
console.log('3. 使用 "pnpm add <package>@latest" 更新到最新版本')
console.log('4. 建议使用 Renovate (https://github.com/marketplace/renovate) 自动更新依赖')
console.log('5. 已配置 renovate.json，可在 GitHub 仓库中启用 Renovate')
