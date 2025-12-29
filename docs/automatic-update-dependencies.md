# 自动更新依赖

本文档说明如何自动更新项目依赖。

## 方法一：使用 Renovate（推荐）

Renovate 是一个 GitHub 应用，可以自动创建 Pull Request 来更新依赖。

### 启用步骤

1. 访问 [Renovate GitHub App](https://github.com/marketplace/renovate)
2. 点击 "Install" 并选择你的仓库
3. Renovate 会自动检测项目根目录下的 `renovate.json` 配置文件
4. 配置完成后，Renovate 会自动创建 PR 来更新依赖

### 配置文件

项目已包含 `renovate.json` 配置文件：

```json
{
  "extends": [
    "config:base"
  ],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "matchCurrentVersion": "!/^0/",
      "automerge": true
    }
  ]
}
```

## 方法二：手动检查更新

### 检查过时的依赖

```bash
pnpm update:deps:check
# 或
pnpm outdated
```

### 运行更新脚本

```bash
pnpm update:deps
```

这个脚本会：
- 检查所有过时的依赖
- 提供更新建议

### 更新依赖

```bash
# 更新所有依赖到最新兼容版本
pnpm update

# 更新特定包
pnpm update <package-name>

# 更新到最新版本（可能包含破坏性更改）
pnpm add <package-name>@latest
```

## 方法三：使用 npm-check-updates

如果需要更精细的控制，可以使用 `npm-check-updates`：

```bash
# 安装
pnpm add -D npm-check-updates

# 检查更新
npx ncu

# 更新 package.json（不安装）
npx ncu -u

# 然后安装
pnpm install
```

## 注意事项

1. **测试更新**：更新依赖后，务必运行测试确保一切正常
   ```bash
   pnpm test
   pnpm test:e2e
   ```

2. **检查破坏性更改**：查看包的 CHANGELOG 或 Release Notes

3. **锁定文件**：更新后检查 `pnpm-lock.yaml` 的变化

4. **生产环境**：在生产环境部署前，先在开发/测试环境验证

## 最佳实践

1. **定期更新**：建议每月检查一次依赖更新
2. **小步更新**：优先更新 patch 和 minor 版本
3. **测试先行**：更新后运行完整的测试套件
4. **审查变更**：使用版本控制工具审查依赖变更
