# Tarkov Interactive Map Assistant - Desktop Edition
# 逃离塔科夫·交互式地图助手 - 桌面版

<p align="center">
  <img src="app-icon.png" alt="Tarkov Map Assistant Icon" width="128" height="128">
</p>

## 📖 简介 | Introduction

**中文**  
逃离塔科夫实时交互式地图助手桌面版，基于 Tauri + React 开发，提供原生桌面体验。帮助玩家更好地探索和导航游戏世界。

**English**  
Escape from Tarkov Interactive Map Assistant Desktop Edition - A native desktop application built with Tauri + React for real-time interactive map assistance to help players navigate the game world.

**版本 Version**: 1.1.0  
**作者 Author**: Tomy  
**原项目 Original Project**: Based on [tarkov-tilty-frontend-opensource](https://github.com/tiltysola/tarkov-tilty-frontend-opensource)

---

## ✨ 功能特性 | Features

### 中文
- 🖥️ **原生桌面应用** - 使用 Tauri 构建，安装包小（~5-10MB）
- 🗺️ **实时交互式地图** - 流畅的地图显示和交互
- 📍 **自动坐标追踪** - 自动获取玩家位置（需配置）
- 🔄 **自动地图切换** - 根据游戏状态智能切换地图
- 🎯 **Location Markers** - Mark important locations and loot spots
- 📊 **Coordinate Calculation** - Real-time coordinate and direction display
- 🎨 **Tarkov Theme** - Military tactical UI design
- ⚡ **High Performance** - Rust backend for native performance
- 🔒 **Offline Usage** - Works without internet connection
- 📌 **System Tray** - Minimize to tray, show/hide with menu or click

### English
- 🖥️ **Native Desktop App** - Built with Tauri, small installer (~5-10MB)
- 🗺️ **Real-time Interactive Map** - Smooth map display and interaction
- 📍 **Auto Coordinate Tracking** - Automatic player location tracking (requires setup)
- 🔄 **Auto Map Switching** - Smart map switching based on game state
- 🎯 **Location Markers** - Mark important locations and loot spots
- 📊 **Coordinate Calculation** - Real-time coordinate and direction display
- 🎨 **Tarkov Theme** - Military tactical UI design
- ⚡ **High Performance** - Rust backend for native performance
- 🔒 **Offline Usage** - Works without internet connection

---

## 🛠️ 技术栈 | Tech Stack

### Frontend 前端
- **React** 18.2 - UI framework
- **TypeScript** 5.1 - Type safety
- **Vite** 4.4 - Build tool
- **React Konva** - Canvas rendering
- **Recoil** - State management
- **React Router** - Navigation

### Backend 后端
- **Rust** - Native performance
- **Tauri** 2.0 - Desktop framework
- **WebView2** - Windows rendering engine

### UI Components UI组件
- Ant Design Icons
- React Toastify
- RC Slider

---

## 📦 安装与运行 | Installation & Usage

### 前置要求 | Prerequisites

**中文**  
确保您的系统已安装以下环境：
- [Node.js](https://nodejs.org/) (推荐 v18+)
- [Rust](https://www.rust-lang.org/) (最新稳定版)
- [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (Windows 10/11 通常已预装)

**English**  
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (usually pre-installed on Windows 10/11)

### 安装依赖 | Install Dependencies

```bash
npm install
```

### 开发模式 | Development Mode

**中文**: 运行开发服务器（自动刷新）

**English**: Run development server (with hot reload)

```bash
npm run tauri dev
```

### 生产构建 | Production Build

**中文**: 构建生产版本安装包

**English**: Build production installer

```bash
npm run tauri build
```

构建产物位于 | Build output:  
`src-tauri/target/release/bundle/`

---

## 🎨 自定义图标 | Custom Icon

**中文**  
如需更换应用图标，请准备 1240x1240 的 PNG 图片：

**English**  
To customize the app icon, prepare a 1240x1240 PNG image:

```bash
# 1. 将图标文件命名为 app-icon.png 并放在项目根目录
# Place your icon as app-icon.png in the project root

# 2. 运行图标生成工具
# Run the icon generation tool
npm run tauri icon
```

---

## 🔧 开发说明 | Development Notes

### 项目结构 | Project Structure

```
tarkov-interactive-map-assistant-desktop/
├── src/                    # React 前端代码 | Frontend code
│   ├── pages/             # 页面组件 | Page components
│   ├── components/        # 通用组件 | Common components
│   ├── assets/            # 静态资源 | Static assets
│   └── utils/             # 工具函数 | Utility functions
├── src-tauri/             # Rust 后端代码 | Backend code
│   ├── src/
│   │   ├── main.rs       # 入口文件 | Entry point
│   │   └── lib.rs        # 核心逻辑 | Core logic
│   ├── icons/            # 应用图标 | App icons
│   └── tauri.conf.json   # Tauri 配置 | Tauri config
├── index.html            # HTML 入口 | HTML entry
├── vite.config.ts        # Vite 配置 | Vite config
└── package.json          # 依赖配置 | Dependencies
```

### 可用脚本 | Available Scripts

```bash
# 开发模式 | Development
npm run dev              # Vite 开发服务器 | Vite dev server
npm run tauri dev        # Tauri 开发模式 | Tauri dev mode

# 构建 | Build
npm run build            # 构建前端 | Build frontend
npm run tauri build      # 构建桌面应用 | Build desktop app

# 代码质量 | Code Quality
npm run lint             # ESLint 检查 | Run ESLint
npm run lint:fix         # 修复 ESLint 问题 | Fix ESLint issues
npm run prettier         # 格式化代码 | Format code
npm run fix              # 修复所有代码问题 | Fix all issues

# 工具 | Tools
npm run tauri icon       # 生成应用图标 | Generate app icons
```

### Tauri 命令 | Tauri Commands

**中文**: Rust 后端提供的命令

**English**: Available Rust backend commands

```rust
// 读取文本文件 | Read text file
read_text_file(path: String) -> Result<String, String>

// 读取目录内容 | Read directory
read_directory(path: String) -> Result<Vec<String>, String>

// 检查路径是否存在 | Check if path exists
path_exists(path: String) -> bool
```

---

## 🚀 性能优化 | Performance

**中文**
- ✅ 资源优化：文件体积减少 99.5% (12MB → 60KB)
- ✅ Rust 后端：原生性能，内存占用低
- ✅ Canvas 渲染：使用 Konva 高效渲染地图
- ✅ 加载优化：蓝色主题加载画面，提升体验

**English**
- ✅ Resource optimization: 99.5% size reduction (12MB → 60KB)
- ✅ Rust backend: Native performance, low memory usage
- ✅ Canvas rendering: Efficient map rendering with Konva
- ✅ Loading optimization: Blue-themed loading screen

---

## 🎯 功能增强 | Feature Enhancements

### 已实现 | Implemented
- ✅ 禁用开发者工具 (F12)
- ✅ 自定义应用图标（塔科夫主题）
- ✅ 加载动画（蓝色主题）
- ✅ 窗口启动默认最大化
- ✅ 系统托盘功能
  - 托盘图标（使用应用图标）
  - 右键菜单：Show Window / Hide Window / Quit
  - 左键单击切换显示/隐藏
  - 关闭窗口隐藏到托盘
- ✅ 文件系统访问 API

### 已知问题 | Known Issues
- ⚠️ **WebView2 退出错误** - 从系统托盘退出时终端显示 `Error = 1412`
  - 这是 WebView2/Chromium 内部清理问题
  - **不影响程序功能**，仅在开发模式终端显示
  - 生产构建时用户不会看到此错误
- ⚠️ **画中画模式触发** - 需要先通过下拉菜单选择地图才能开启画中画
  - 首次点击画中画按钮可能无响应
  - 需要通过地图选择器触发一次更新后才能正常使用
  
### 计划中 | Planned
- ⏸️ 游戏进程监听
- ⏸️ 自动启动选项
- ⏸️ 多语言支持
- 🔧 修复画中画模式初始化问题
- 🔧 优化系统托盘退出流程（如果 Tauri 未来版本修复）


---

## 📝 开源协议 | License

本项目以 **GPL v3** 协议开源，请严格遵守开源协议。

This project is open source under the **GPL v3 License**.

---

## 🙏 致谢 | Credits

**中文**  
特别感谢 [@tiltysola](https://github.com/tiltysola) 创建的[原始项目](https://github.com/tiltysola/tarkov-tilty-frontend-opensource)，本项目在此基础上进行桌面化改造。

**English**  
Special thanks to [@tiltysola](https://github.com/tiltysola) for creating the [original project](https://github.com/tiltysola/tarkov-tilty-frontend-opensource). This desktop version is adapted from that work.

---

## 📮 联系与支持 | Contact & Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **原项目 Original**: [tarkov-interactive-map-assistant-web](https://github.com/TomyTang331/tarkov-interactive-map-assistant)

---

## 📊 更新日志 | Changelog

### Version 1.1.0 (2025-12-17)

**中文**
- ✨ 桌面版首次发布
- ✨ 使用 Tauri 重构，安装包仅 5-10MB
- ✨ 蓝色主题 UI 设计
- ✨ 优化启动加载体验
- ✨ 自定义塔科夫主题图标
- ✨ 系统托盘支持（显示/隐藏/退出）
- ✨ 窗口启动默认最大化
- ✨ 关闭窗口隐藏到托盘而非退出

**English**
- ✨ First desktop release
- ✨ Rebuilt with Tauri, installer only 5-10MB
- ✨ Blue theme UI design
- ✨ Optimized loading experience
- ✨ Custom Tarkov-themed icon
- ✨ System tray support (show/hide/quit)
- ✨ Window starts maximized by default
- ✨ Close button hides to tray instead of exit

---

## 🐛 故障排除 | Troubleshooting

### 开发模式错误提示 | Development Mode Errors

**问题**: 从托盘退出时显示 `Failed to unregister class Chrome_WidgetWin_0. Error = 1412`

**解答**: 这是 WebView2 的已知问题，属于正常现象
- ✅ 不影响程序功能
- ✅ 仅在开发模式的终端显示
- ✅ 生产构建的用户看不到此错误
- ✅ 可以安全忽略

**问题**: 画中画功能首次点击无响应

**解答**: 这是已知的初始化问题
- ✅ 通过地图选择下拉菜单切换一次地图即可
- ✅ 之后画中画功能正常使用
- 🔧 未来版本将修复此问题


---

<p align="center">
  Made with ❤️ for Escape from Tarkov players
</p>
