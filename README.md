# 逃离塔科夫·交互式地图助手 - 桌面版

<p align="center">
  <img src="app-icon.png" alt="Tarkov Map Assistant Icon" width="128" height="128">
</p>

## 📖 简介

逃离塔科夫实时交互式地图助手桌面版，基于 Tauri + React 开发，提供原生桌面体验。帮助玩家更好地探索和导航游戏世界。

**版本**: 1.2.0
**作者**: Tomy
**原项目**: 基于 [tarkov-tilty-frontend-opensource](https://github.com/tiltysola/tarkov-tilty-frontend-opensource)

---

## ✨ 功能特性

- 🖥️ **原生桌面应用** - 使用 Tauri 构建，安装包小（~5-10MB）
- 🗺️ **实时交互式地图** - 流畅的地图显示和交互（实验室仅提示不支持；其余地图完整支持）
- 📍 **自动坐标追踪** - 通过截图目录监听，自动获取玩家位置（启动自动检测默认目录）
- 🎯 **地图标记系统** - 标记撤离点、战利品、出生点、危险区域、固定武器等
- 📊 **坐标显示** - 实时显示光标坐标
- 🎨 **塔科夫主题** - 军事战术风格 UI 设计
- ⚡ **高性能** - Rust 后端提供原生性能
- 🔒 **离线使用** - 无需网络连接即可工作
- 📌 **系统托盘** - 最小化到托盘，右键菜单显示/隐藏/退出
- ⌨️ **全局快捷键** - 按下 **M键** 可随时切换画中画模式，即使窗口失焦也能工作
- 🌐 **全中文界面** - 地图层级、地点标签、菜单全部中文化

---

## 🛠️ 技术栈

### 前端
- **React** 18.2 - UI 框架
- **TypeScript** 5.1 - 类型安全
- **Vite** 8.0 - 构建工具
- **React Konva** - Canvas 渲染
- **Recoil** - 状态管理

### 后端
- **Rust** - 原生性能
- **Tauri** 2.0 - 桌面框架
- **WebView2** - Windows 渲染引擎
- **rdev** 0.5 - 全局键盘事件监听器

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

```bash
npm run tauri dev
```

### 生产构建

```bash
npm run build              # 构建前端
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

### GitHub 自动发布（Release）

工作流：[`.github/workflows/build.yml`](./.github/workflows/build.yml)。**仅使用 Windows 运行器**（游戏仅支持 Windows），推送符合 `v*` 的标签时编译 **NSIS 安装程序（`.exe`）与 MSI（`.msi`）**。

**操作步骤：**

1. 将 `package.json`、`src-tauri/Cargo.toml`、`src-tauri/tauri.conf.json` 中的版本号改为本次发布版本（三者保持一致）。
2. 提交并推送到默认分支（如 `main`）。
3. 打标签并推送（标签名必须以 `v` 开头）：

   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

---

## 🔧 开发说明

### 项目结构

```
tarkov-interactive-map-assistant-desktop/
├── src/                    # React 前端代码
│   ├── pages/             # 页面组件
│   ├── components/        # 通用组件
│   ├── data/              # 地图数据与翻译
│   └── utils/             # 工具函数
├── src-tauri/             # Rust 后端代码
│   ├── src/
│   │   └── lib.rs         # 核心逻辑
│   ├── icons/             # 应用图标
│   └── tauri.conf.json    # Tauri 配置
├── index.html             # HTML 入口
├── vite.config.ts         # Vite 配置
└── package.json           # 依赖配置
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

// 窗口控制
minimize_window() -> Result<(), String>
```

---

## 📊 更新日志

### Version 1.2.0 (2026-05-15)

- 🧹 **精简**：移除游戏目录选择、日志监听、自动切图功能（截图目录可自动检测）
- 🧹 **精简**：移除手动定位/搜索、笔刷模式、橡皮模式、测距模式及相关工具栏按钮
- 🧹 **精简**：移除重复地图条目（夜间工厂、中心区 21+）
- 🧹 **精简**：移除页面标题
- 🧹 **精简**：移除所有非错误通知（仅保留 PiP 失败等错误提示）
- ⚡ **优化**：切换地图时不再闪烁（保留上一次 scale/position 直到新地图加载完成）
- ⚡ **优化**：切换地图时自动重置层级选择为表层
- 🐛 **修复**：截图目录默认路径改为 `Documents\Escape from Tarkov\Screenshots`，启动时自动检测
- 🐛 **修复**：tsconfig.json TS 6.0 弃用警告（moduleResolution、baseUrl、esModuleInterop）
- 🌐 **翻译**：地图层级名称中文化（如 "2nd Floor"→"2楼"）
- 🌐 **翻译**：288 个地图地点标签中文化，修正 4 个不符合社区标准的翻译
- 🌐 **翻译**：系统托盘菜单中文化（显示/隐藏/退出）
- 🌐 **翻译**：补充 `others.surface` 缺失的 i18n key
- 🧹 **清理**：移除 `tarkov_game_path` 相关 Rust 命令、日志解析函数、游戏日志监听线程
- 🧹 **清理**：移除 `regex` crate 依赖、废弃类型（`DrawProps`、`iMDrawLine`、`StrokeType` 等）
- 🧹 **清理**：移除不再使用的工具函数（`drawColorList`、`tarkovGamePathResolve`、`transformMapId`）
- 🧹 **清理**：移除约 20 个不再使用的 i18n key

### Version 1.1.9 (2026-03-29)

- **性能优化**：禁用 Toast 滑入/滑出动画，改为即时显示/隐藏，降低 DOM 开销。
- **性能优化**：Toast 最多同时显示 3 条，自动关闭时间缩短至 3 秒。
- **性能优化**：Rust 正则表达式通过 `OnceLock` 预编译，避免每行日志重复编译。
- **性能优化**：MapInfo 面板隐藏时暂停秒级定时器，减少不必要的重渲染。
- **性能优化**：MapSelect、Warning 组件添加 `React.memo`。
- **优化改进**：修复 Spawns 组件中重复调用 `getSpawnType()` 的问题。
- **优化改进**：移除无用的 `greet` Tauri 命令。
- **优化改进**：单实例处理中缓存窗口查找，避免重复查找。
- **优化改进**：截图定位放大倍数从 3x 调整为 3.25x。
- **代码质量**：将残余硬编码中文字符串替换为 i18n 国际化调用。
- **代码质量**：所有注释统一为英文，移除冗余注释。
- **升级**：Vite 7.3 → 8.0（Rolldown 引擎），构建速度提升约 42%。
- **升级**：`@vitejs/plugin-react` v5 → v6（基于 Oxc，无需 Babel）。
- **修复**：通知栏：切换地图时关闭所有通知，成功通知 3 秒后自动消失。
- **修复**：移除损坏的自定义 Toast 动画，改用近乎即时的 CSS 动画。

### Version 1.1.8 (2026-03-13)

- **CI / 发布**：GitHub Actions **仅 Windows** 构建（游戏仅 Windows）；**Node 22**（兼容 Vite 7）；Release 附件仅 `.exe` / `.msi`。

### Version 1.1.7 (2026-03-13)

- 实验室（`tileMapUnsupported`）：仅显示居中「瓦片图暂不支持」文案；不绘制地图标记与叠加层（去除左上角缩略图效果）。
- 精简 Canvas、QuickTools、BaseMap、Ruler、InteractiveMap 入口、typings 等处冗余注释。

### Version 1.1.6 (2026-03-11)

- 实验室地图：瓦片加载（`TileLayer` + 本地瓦片 `src/assets/the-lab-map`），无 SVG 时使用虚拟画布尺寸。
- 游戏日志监听：Tauri 对话框选择游戏目录，Rust 解析 application 日志并发送 `profile-log` / `raid-log`，前端更新战局信息与自动切图。
- PMC/Scav 撤离点标签使用 `extract_names_zh.json` 中文名。
- M 键在窗口有焦点（前端 keydown）或失焦（rdev 事件）时均可切换画中画。
- ESLint 修复（Canvas、BaseMap、MapInfo、QuickTools）；代码注释改为英文。

---

## 🙏 致谢

特别感谢 [@tiltysola](https://github.com/tiltysola) 创建的[原始项目](https://github.com/tiltysola/tarkov-tilty-frontend-opensource)，本项目在此基础上进行桌面化改造。

---

## 📮 联系与支持

- **Issues**: GitHub Issues
- **原项目**: [tarkov-interactive-map-assistant-web](https://github.com/TomyTang331/tarkov-interactive-map-assistant)

---

## 📝 开源协议

本项目以 **GPL v3** 协议开源，请严格遵守开源协议。

---

<p align="center">
  Made with ❤️ for Escape from Tarkov players
</p>
