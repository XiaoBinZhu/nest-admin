# NetdiskModule - 网盘模块

## 概述

NetdiskModule 提供了类似云盘的文件管理功能，支持文件上传、下载、删除、移动、复制等操作。

## 功能特性

- ✅ 文件/文件夹管理
- ✅ 文件上传下载
- ✅ 文件移动和复制
- ✅ 文件删除
- ✅ 文件预览
- ✅ 存储统计
- ✅ 支持七牛云存储

## 子模块

### 1. NetDiskManageController - 文件管理控制器
提供文件的 CRUD 操作：
- 文件列表
- 文件上传
- 文件下载
- 文件删除
- 文件移动
- 文件复制
- 文件重命名

### 2. NetDiskOverviewController - 概览控制器
提供存储统计信息：
- 存储空间使用情况
- 文件数量统计
- 存储趋势分析

## 路由结构

```
/netdisk/manage/*  - 文件管理接口
/netdisk/overview/* - 存储概览接口
```

## 使用示例

### 文件上传

```bash
curl -X POST http://localhost:3000/api/netdisk/manage/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/file.jpg" \
  -F "path=/documents"
```

### 文件列表

```bash
curl -X GET "http://localhost:3000/api/netdisk/manage/list?path=/documents" \
  -H "Authorization: Bearer <token>"
```

### 文件删除

```bash
curl -X DELETE http://localhost:3000/api/netdisk/manage/delete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"files": ["/documents/file1.jpg", "/documents/file2.jpg"]}'
```

## 配置说明

### 七牛云配置

在 `.env` 文件中配置：

```env
OSS_ACCESSKEY=your-access-key
OSS_SECRETKEY=your-secret-key
OSS_DOMAIN=your-domain
OSS_BUCKET=your-bucket
OSS_ZONE=Zone_z2
OSS_ACCESS_TYPE=public
```

### 存储区域

支持的存储区域：
- `Zone_as0` - 华东
- `Zone_na0` - 北美
- `Zone_z0` - 华东
- `Zone_z1` - 华北
- `Zone_z2` - 华南

## 文件操作

### 支持的操作

1. **上传**: 上传文件到指定路径
2. **下载**: 下载文件
3. **删除**: 删除文件或文件夹
4. **移动**: 移动文件到新位置
5. **复制**: 复制文件到新位置
6. **重命名**: 重命名文件或文件夹
7. **创建文件夹**: 创建新文件夹
8. **获取文件信息**: 获取文件详细信息

## 权限控制

所有网盘操作都需要：
1. JWT 认证
2. 相应的权限验证

## 存储限制

- 单次最多处理 1000 个文件
- 文件列表查询最多返回 100 条记录

## 相关文档

- [七牛云文档](https://developer.qiniu.com/)
- [文件上传模块文档](../tools/upload/upload.module.md)
