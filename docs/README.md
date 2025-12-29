# nest-admin 功能文档

欢迎使用 nest-admin 功能文档。本文档包含所有新增功能的详细说明和使用指南。

## 文档索引

### 核心功能

1. **[S3 存储驱动](./01-S3存储驱动.md)**
   - 配置 AWS S3 存储
   - 支持 MinIO 等兼容服务
   - 统一的存储接口

2. **[多数据库支持](./02-多数据库支持.md)**
   - MySQL、PostgreSQL、MongoDB 支持
   - 自动数据库驱动选择
   - 迁移指南

3. **[I18N 国际化](./03-I18N国际化.md)**
   - 多语言支持（中文/英文）
   - 自动语言检测
   - 错误消息多语言化

4. **[E2E 测试](./04-E2E测试.md)**
   - Jest 测试框架
   - 测试示例和最佳实践
   - 持续集成配置

5. **[依赖更新](./05-依赖更新.md)**
   - Renovate 自动更新
   - 手动更新流程
   - 更新策略和最佳实践

## 快速开始

### 1. 配置 S3 存储

编辑 `.env` 文件：

```env
STORAGE_DRIVER=s3
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_REGION=us-east-1
S3_BUCKET=your-bucket
```

详细说明请参考 [S3 存储驱动文档](./01-S3存储驱动.md)

### 2. 配置多数据库

编辑 `.env` 文件：

```env
# MySQL（默认）
DB_TYPE=mysql

# 或 MongoDB
DB_TYPE=mongodb
```

详细说明请参考 [多数据库支持文档](./02-多数据库支持.md)

### 3. 配置 I18N

编辑 `.env` 文件：

```env
APP_FALLBACK_LANGUAGE=zh
APP_HEADER_LANGUAGE=x-custom-lang
```

详细说明请参考 [I18N 国际化文档](./03-I18N国际化.md)

### 4. 运行 E2E 测试

```bash
pnpm test:e2e
```

详细说明请参考 [E2E 测试文档](./04-E2E测试.md)

### 5. 更新依赖

```bash
pnpm update:deps:check
pnpm update
```

详细说明请参考 [依赖更新文档](./05-依赖更新.md)

## 功能对比

| 功能 | nest-admin | nestjs-boilerplate | 状态 |
|------|-----------|-------------------|------|
| S3 存储 | ✅ | ✅ | 已对齐 |
| 多数据库 | ✅ | ✅ | 已对齐 |
| I18N | ✅ | ✅ | 已对齐 |
| E2E 测试 | ✅ | ✅ | 已对齐 |
| 依赖更新 | ✅ | ✅ | 已对齐 |
| 社交登录 | ⚠️ | ✅ | 部分支持 |
| Seeder | ⚠️ | ✅ | 部分支持 |

## 常见问题

### Q: 如何切换存储驱动？

A: 修改 `.env` 文件中的 `STORAGE_DRIVER` 配置即可，无需修改代码。详见 [S3 存储驱动文档](./01-S3存储驱动.md)

### Q: 如何添加新语言？

A: 复制现有语言文件夹并翻译内容即可。详见 [I18N 国际化文档](./03-I18N国际化.md)

### Q: 如何运行测试？

A: 使用 `pnpm test:e2e` 命令。详见 [E2E 测试文档](./04-E2E测试.md)

### Q: 如何更新依赖？

A: 使用 `pnpm update:deps:check` 检查，然后 `pnpm update` 更新。详见 [依赖更新文档](./05-依赖更新.md)

## 技术支持

如有问题，请参考各功能模块的详细文档，或查看项目 Issues。

## 更新日志

### v2.0.0

- ✅ 新增 S3 存储驱动支持
- ✅ 新增多数据库支持（MongoDB）
- ✅ 新增 I18N 国际化支持
- ✅ 新增 E2E 测试框架
- ✅ 新增依赖更新工具

---

**注意**：本文档会持续更新，请定期查看最新版本。
