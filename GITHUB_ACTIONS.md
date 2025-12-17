# GitHub Actions 自动构建指南
# GitHub Actions Build Guide

## 🚀 自动构建说明 | Automated Build Instructions

本项目已配置 GitHub Actions，可以自动为 **Windows、macOS 和 Linux** 三个平台构建安装包。

This project is configured with GitHub Actions to automatically build installers for **Windows, macOS, and Linux**.

---

## 📋 触发构建的方式 | How to Trigger Builds

### 方法 1: 创建版本标签（推荐）| Method 1: Create Version Tag (Recommended)

```bash
# 1. 创建标签 | Create tag
git tag v1.1.0

# 2. 推送标签到 GitHub | Push tag to GitHub
git push origin v1.1.0
```

GitHub Actions 会自动：
- ✅ 在 Windows、macOS、Linux 上编译
- ✅ 创建 Draft Release
- ✅ 上传所有安装包到 Release

GitHub Actions will automatically:
- ✅ Build on Windows, macOS, and Linux
- ✅ Create a Draft Release
- ✅ Upload all installers to the Release

### 方法 2: 手动触发 | Method 2: Manual Trigger

1. 访问 | Visit: https://github.com/TomyTang331/tarkov-interactive-map-assistant-desktop/actions
2. 选择 "Build and Release" workflow
3. 点击 "Run workflow" 按钮
4. 选择分支并运行

---

## 📦 构建产物 | Build Artifacts

构建完成后，您将获得以下文件：

After the build completes, you will get the following files:

### Windows
- `*.exe` - NSIS 安装程序（推荐）
- `*.msi` - MSI 安装包

### macOS
- `*.dmg` - DMG 镜像文件
- `*.app` - 应用程序包

### Linux
- `*.AppImage` - AppImage 可执行文件
- `*.deb` - Debian 安装包

---

## 🔍 查看构建状态 | Check Build Status

**Actions 页面 | Actions Page:**  
https://github.com/TomyTang331/tarkov-interactive-map-assistant-desktop/actions

**Releases 页面 | Releases Page:**  
https://github.com/TomyTang331/tarkov-interactive-map-assistant-desktop/releases

---

## ⚙️ 配置文件位置 | Workflow Configuration

GitHub Actions 配置文件位于：

The GitHub Actions workflow is located at:

`.github/workflows/build.yml`

---

## 💡 使用提示 | Usage Tips

### 发布新版本流程 | Release New Version Workflow

1. **更新版本号** | Update version number
   - 修改 `src-tauri/tauri.conf.json` 中的 `version` 字段
   - Update `version` field in `src-tauri/tauri.conf.json`

2. **提交更改** | Commit changes
   ```bash
   git add .
   git commit -m "chore: bump version to vX.X.X"
   git push
   ```

3. **创建标签** | Create tag
   ```bash
   git tag vX.X.X
   git push origin vX.X.X
   ```

4. **等待构建** | Wait for build
   - 在 Actions 页面查看构建进度
   - Check build progress on Actions page

5. **发布 Release** | Publish Release
   - 构建完成后，在 Releases 页面找到 Draft Release
   - After build completes, find the Draft Release on Releases page
   - 编辑 Release 说明并发布
   - Edit release notes and publish

---

## ❗ 常见问题 | FAQ

**Q: 为什么构建失败了？**  
**Q: Why did the build fail?**

A: 检查以下几点：
- 确保 `package.json` 中的依赖完整
- 确保 TypeScript 配置正确
- 查看 Actions 日志获取详细错误信息

A: Check the following:
- Ensure dependencies in `package.json` are complete
- Ensure TypeScript configuration is correct
- Check Actions logs for detailed error messages

**Q: 如何只构建特定平台？**  
**Q: How to build for specific platforms only?**

A: 编辑 `.github/workflows/build.yml`，修改 `matrix.platform` 部分。

A: Edit `.github/workflows/build.yml` and modify the `matrix.platform` section.

---

## 🎯 下次构建版本号建议 | Next Version Number

当前版本: `v1.1.0`  
Current version: `v1.1.0`

建议下次版本号：
- Bug 修复: `v1.1.1`
- 新功能: `v1.2.0`
- 重大更新: `v2.0.0`

Suggested next version:
- Bug fix: `v1.1.1`
- New feature: `v1.2.0`
- Major update: `v2.0.0`
