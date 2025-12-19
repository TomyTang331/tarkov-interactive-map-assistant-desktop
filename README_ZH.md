# 逃离塔科夫·交互式地图助手 - 桌面版

<p align="center">
  <img src="app-icon.png" alt="Tarkov Map Assistant Icon" width="128" height="128">
</p>

[English](./README.md) | **中文**

## 📖 简介

逃离塔科夫实时交互式地图助手桌面版，基于 Tauri + React 开发，提供原生桌面体验。帮助玩家更好地探索和导航游戏世界。

**版本**: 1.1.3
**作者**: Tomy
**原项目**: 基于 [tarkov-tilty-frontend-opensource](https://github.com/tiltysola/tarkov-tilty-frontend-opensource)

---

## ✨ 功能特性

- 🖥️ **原生桌面应用** - 使用 Tauri 构建，安装包小（~5-10MB）
- 🗺️ **实时交互式地图** - 流畅的地图显示和交互
- 📍 **自动坐标追踪** - 自动获取玩家位置（需配置）
- 🔄 **自动地图切换** - 根据游戏状态智能切换地图
- 🎯 **位置标记** - 标记重要地点和物资点
- 📊 **坐标计算** - 实时显示坐标和方向
- 🎨 **塔科夫主题** - 军事战术风格 UI 设计
- ⚡ **高性能** - Rust 后端提供原生性能
- 🔒 **离线使用** - 无需网络连接即可工作
- 📌 **系统托盘** - 最小化到托盘，通过菜单或点击显示/隐藏
- ⌨️ **全局快捷键** - 按下 **M键** 可随时切换画中画模式，即使窗口失焦也能工作

---

## 🛠️ 技术栈

### 前端
- **React** 18.2 - UI 框架
- **TypeScript** 5.1 - 类型安全
- **Vite** 4.4 - 构建工具
- **React Konva** - Canvas 渲染
- **Recoil** - 状态管理
- **React Router** - 路由导航

### 后端
- **Rust** - 原生性能
- **Tauri** 2.0 - 桌面框架
- **WebView2** - Windows 渲染引擎
- **rdev** 0.5 - 全局键盘事件监听器

### UI组件
- Ant Design Icons
- React Toastify
- RC Slider

---

## 📦 安装与运行

### 前置要求

确保您的系统已安装以下环境：
- [Node.js](https://nodejs.org/) (推荐 v18+)
- [Rust](https://www.rust-lang.org/) (最新稳定版)
- [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (Windows 10/11 通常已预装)

### 安装依赖

```bash
npm install --legacy-peer-deps
```

> **注意**: 需要使用 `--legacy-peer-deps` 标志来解决依赖冲突问题。

### 开发模式

运行开发服务器（自动刷新）

```bash
npm run tauri dev
```

### 生产构建

构建生产版本安装包

**方法 1：带 TypeScript 检查构建（推荐）**

```bash
npm run build              # 构建前端
npm run tauri build        # 构建 Tauri 应用并创建安装包
```

**方法 2：跳过 TypeScript 检查（如果遇到类型错误）**

```bash
npx vite build             # 构建前端（跳过 TypeScript）
npm run tauri build        # 构建 Tauri 应用并创建安装包
```

**构建产物位置**：

```
src-tauri/target/release/bundle/
├── nsis/
│   └── *_x64-setup.exe     # NSIS 安装程序
└── msi/
    └── *.msi                # Windows Installer 安装包
```

> **注意**: 构建过程可能需要几分钟时间，首次构建尤其耗时。

---

## 🎨 自定义图标

如需更换应用图标，请准备 1240x1240 的 PNG 图片：

```bash
# 1. 将图标文件命名为 app-icon.png 并放在项目根目录
# 2. 运行图标生成工具
npm run tauri icon
```

---

## 🔧 开发说明

### 项目结构

```
tarkov-interactive-map-assistant-desktop/
├── src/                    # React 前端代码
│   ├── pages/             # 页面组件
│   ├── components/        # 通用组件
│   ├── assets/            # 静态资源
│   └── utils/             # 工具函数
├── src-tauri/             # Rust 后端代码
│   ├── src/
│   │   ├── main.rs       # 入口文件
│   │   └── lib.rs        # 核心逻辑
│   ├── icons/            # 应用图标
│   └── tauri.conf.json   # Tauri 配置
├── index.html            # HTML 入口
├── vite.config.ts        # Vite 配置
└── package.json          # 依赖配置
```

### 可用脚本

```bash
# 开发模式
npm run dev              # Vite 开发服务器
npm run tauri dev        # Tauri 开发模式

# 构建
npm run build            # 构建前端
npm run tauri build      # 构建桌面应用

# 代码质量
npm run lint             # ESLint 检查
npm run lint:fix         # 修复 ESLint 问题
npm run prettier         # 格式化代码
npm run fix              # 修复所有代码问题

# 工具
npm run tauri icon       # 生成应用图标
```

### Tauri 命令

Rust 后端提供的命令

```rust
// 读取文本文件
read_text_file(path: String) -> Result<String, String>

// 读取目录内容
read_directory(path: String) -> Result<Vec<String>, String>

// 检查路径是否存在
path_exists(path: String) -> bool
```

---

## 🚀 性能优化

- ✅ 资源优化：文件体积减少 99.5% (12MB → 60KB)
- ✅ Rust 后端：原生性能，内存占用低
- ✅ Canvas 渲染：使用 Konva 高效渲染地图
- ✅ 加载优化：蓝色主题加载画面，提升体验

---

## 🎯 功能增强

### 已实现
- ✅ 禁用开发者工具 (F12)
- ✅ 自定义应用图标（塔科夫主题）
- ✅ 加载动画（蓝色主题）
- ✅ 窗口启动默认最大化
- ✅ 系统托盘功能
  - 托盘图标（使用应用图标）
  - 右键菜单：显示窗口 / 隐藏窗口 / 退出
  - 左键单击切换显示/隐藏
  - 关闭窗口隐藏到托盘
- ✅ 文件系统访问 API
- ✅ 单实例应用锁（防止多开）
- ✅ 全局键盘监听器（M键切换画中画）

### 已知问题
- 无
  
### 计划中
- ⏸️ 游戏进程监听
- ⏸️ 自动启动选项
- ⏸️ 多语言支持

---

## 📝 开源协议

本项目以 **GPL v3** 协议开源，请严格遵守开源协议。

---

## 🙏 致谢

特别感谢 [@tiltysola](https://github.com/tiltysola) 创建的[原始项目](https://github.com/tiltysola/tarkov-tilty-frontend-opensource)，本项目在此基础上进行桌面化改造。

---

## 📮 联系与支持

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **原项目**: [tarkov-interactive-map-assistant-web](https://github.com/TomyTang331/tarkov-interactive-map-assistant)

---

## 📊 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本发布历史。

### Version 1.1.4 (2025-12-19)

- ✨ **新功能**: 全局键盘快捷键支持
  - 随时按下 **M键** 可切换画中画模式，即使应用窗口失焦也能工作
  - 使用 `rdev` 库实现系统级键盘事件监听
  - 在游戏全屏时提供无缝控制体验

### Version 1.1.3 (2025-12-19)

- 🐛 **修复**: 标点缩放功能现已正常工作
  - 取消注释 PlayerLocation 组件中的 `onPlayerLocationChange` 回调
  - 优化 Canvas 组件中的缩放逻辑
  - 启用后，地图现在可以正确放大到 3 倍基础缩放并居中到玩家位置
- 🧹 **优化**: 代码深度清理与重构
  - 移除了未使用的 `AdditionFunc` 组件及冗余社交链接
  - 移除了废弃的 `parseFleaMarketInfo` 逻辑及死代码
  - 优化了文件系统访问 API 的类型定义
  - 修复了多处 ESLint 警告，提升代码质量

### Version 1.1.2 (2025-12-18)

- 🐛 修复了所有 React 控制台 key 属性警告（11个组件）
- 🐛 修复了画中画窗口初始化时空白的问题
- 🐛 修复了 Canvas 无限循环警告
- 🔒 禁用所有刷新快捷键（防止意外刷新页面）
- ⚡ 性能优化

### Version 1.1.1 (2025-12-18)

- **修复**: 解决了退出时 "Failed to unregister class" 的报错（通过显式销毁窗口）。
- **修复**: 移除了 `React.StrictMode` 以防止启动时出现重复通知。
- **功能**: 实现了单实例应用锁，防止程序多开。

### Version 1.1.0 (2025-12-17)

- ✨ 桌面版首次发布
- ✨ 使用 Tauri 重构，安装包仅 5-10MB
- ✨ 蓝色主题 UI 设计
- ✨ 优化启动加载体验
- ✨ 自定义塔科夫主题图标
- ✨ 系统托盘支持（显示/隐藏/退出）
- ✨ 窗口启动默认最大化
- ✨ 关闭窗口隐藏到托盘而非退出

---

## 🐛 故障排除

**问题**: `npm install` 安装失败，提示依赖冲突错误

**解答**: 使用 `--legacy-peer-deps` 标志
```bash
npm install --legacy-peer-deps
```
这可以解决某些包的对等依赖冲突问题。

---

---

<p align="center">
  Made with ❤️ for Escape from Tarkov players
</p>
