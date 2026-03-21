# 逃离塔科夫·交互式地图助手 - 桌面版

<p align="center">
  <img src="app-icon.png" alt="Tarkov Map Assistant Icon" width="128" height="128">
</p>

[English](./README.md) | **中文**

## 📖 简介

逃离塔科夫实时交互式地图助手桌面版，基于 Tauri + React 开发，提供原生桌面体验。帮助玩家更好地探索和导航游戏世界。

**版本**: 1.1.7
**作者**: Tomy
**原项目**: 基于 [tarkov-tilty-frontend-opensource](https://github.com/tiltysola/tarkov-tilty-frontend-opensource)

---

## ✨ 功能特性

- 🖥️ **原生桌面应用** - 使用 Tauri 构建，安装包小（~5-10MB）
- 🗺️ **实时交互式地图** - 流畅的地图显示和交互（实验室仅提示不支持；其余地图完整支持）
- 📍 **自动坐标追踪** - 自动获取玩家位置（需配置）
- 🔄 **自动地图切换** - 根据游戏状态智能切换地图（桌面版由 Rust 监听游戏日志）
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
// 文件系统
read_text_file(path: String) -> Result<String, String>
read_directory(path: String) -> Result<Vec<String>, String>
path_exists(path: String) -> bool

// 截图目录（用于坐标追踪）
set_screenshot_path(path: String) -> Result<String, String>
get_screenshot_path() -> String

// 塔科夫游戏目录（监听游戏日志，解析 profile/raid 并发送事件）
set_tarkov_game_path(path: String) -> Result<String, String>
get_tarkov_game_path() -> String
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
- ✅ Rust 游戏日志监听（桌面版通过对话框选择游戏目录，后端解析 application 日志并发送 profile/raid 事件）
- ✅ 瓦片地图支持（实验室等仅瓦片图的地图可正常加载）
- ✅ 撤离点中文名（PMC/Scav 撤离点使用参考项目的中文名称）

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

### Version 1.1.7 (2026-03-13)

- 实验室（`tileMapUnsupported`）：仅显示居中「瓦片图暂不支持」文案；不绘制地图标记与叠加层（去除左上角缩略图效果）。
- 精简 Canvas、QuickTools、BaseMap、Ruler、InteractiveMap 入口、typings 等处冗余注释。

### Version 1.1.6 (2026-03-11)

- 实验室地图：瓦片加载（`TileLayer` + 本地瓦片 `src/assets/the-lab-map`），无 SVG 时使用虚拟画布尺寸。
- 游戏日志监听：Tauri 对话框选择游戏目录，Rust 解析 application 日志并发送 `profile-log` / `raid-log`，前端更新战局信息与自动切图。
- PMC/Scav 撤离点标签使用 `extract_names_zh.json` 中文名。
- M 键在窗口有焦点（前端 keydown）或失焦（rdev 事件）时均可切换画中画。
- ESLint 修复（Canvas、BaseMap、MapInfo、QuickTools）；代码注释改为英文。

### Version 1.1.5 (2025-12-19)

- 退出时自动清理截图目录下 PNG 文件（托盘「退出」触发）。

### Version 1.1.4 (2025-12-19)

- 全局 M 键通过 `rdev` 切换画中画（窗口失焦时也可用）。

### Version 1.1.3 (2025-12-19)

- 修复标点缩放：恢复 `onPlayerLocationChange` 与 Canvas 缩放逻辑，地图 3 倍居中。
- 移除未使用组件与死代码；ESLint 与类型修复。

### Version 1.1.2 (2025-12-18)

- 修复 React key 警告、画中画空白、Canvas 循环；禁用刷新快捷键。

### Version 1.1.1 (2025-12-18)

- 退出时显式销毁窗口，消除 "Failed to unregister class"；移除 StrictMode；单实例锁。

### Version 1.1.0 (2025-12-17)

- Tauri 桌面版首发；托盘、最大化启动、关闭进托盘；蓝色主题与自定义图标。

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
