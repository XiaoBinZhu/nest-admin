# ToolsModule - 工具模块

## 概述

ToolsModule 提供了各种实用工具功能，包括文件上传、存储管理、邮件发送等。

## 功能模块

### 1. UploadModule - 文件上传模块
提供文件上传功能，支持多种存储驱动。

**功能特性**:
- 支持本地存储
- 支持 S3 存储
- 支持七牛云存储
- 文件类型验证
- 文件大小限制

**详细文档**: [上传模块文档](./upload/upload.module.md)

### 2. StorageModule - 存储管理模块
提供文件存储记录管理功能。

**功能特性**:
- 文件记录 CRUD
- 文件列表查询
- 文件删除
- 文件统计

### 3. EmailModule - 邮件模块
提供邮件发送功能。

**功能特性**:
- 邮件发送
- 模板邮件
- 批量发送
- 发送记录

## 路由结构

```
/tools/upload   - 文件上传
/tools/storage  - 存储管理
/tools/email    - 邮件发送
```

## 使用示例

### 文件上传

```bash
curl -X POST http://localhost:3000/api/tools/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/file.jpg"
```

### 存储列表

```bash
curl -X GET "http://localhost:3000/api/tools/storage?page=1&pageSize=10" \
  -H "Authorization: Bearer <token>"
```

### 发送邮件

```bash
curl -X POST http://localhost:3000/api/tools/email \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "测试邮件",
    "content": "这是一封测试邮件"
  }'
```

## 配置说明

### 存储驱动配置

```env
STORAGE_DRIVER=local  # local | s3 | qiniu
```

### 邮件配置

```env
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your-email@example.com
MAIL_PASS=your-password
```

## 相关文档

- [S3 存储驱动文档](../../docs/01-S3存储驱动.md)
- [文件上传模块文档](./upload/upload.module.md)
