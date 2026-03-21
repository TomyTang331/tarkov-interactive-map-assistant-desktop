# Tarkov Interactive Map Assistant - Desktop Edition

<p align="center">
  <img src="app-icon.png" alt="Tarkov Map Assistant Icon" width="128" height="128">
</p>

**English** | [中文](./README_ZH.md)

## 📖 Introduction

Escape from Tarkov Interactive Map Assistant Desktop Edition - A native desktop application built with Tauri + React for real-time interactive map assistance to help players navigate the game world.

**Version**: 1.1.8
**Author**: Tomy
**Original Project**: Based on [tarkov-tilty-frontend-opensource](https://github.com/tiltysola/tarkov-tilty-frontend-opensource)

---

## ✨ Features

- 🖥️ **Native Desktop App** - Built with Tauri, small installer (~5-10MB)
- 🗺️ **Real-time Interactive Map** - Smooth map display and interaction (The Lab shows an unsupported notice; other maps full support)
- 📍 **Auto Coordinate Tracking** - Automatic player location tracking (requires setup)
- 🔄 **Auto Map Switching** - Smart map switching based on game state (Rust-backed game log watching in desktop)
- 🎯 **Location Markers** - Mark important locations and loot spots
- 📊 **Coordinate Calculation** - Real-time coordinate and direction display
- 🎨 **Tarkov Theme** - Military tactical UI design
- ⚡ **High Performance** - Rust backend for native performance
- 🔒 **Offline Usage** - Works without internet connection
- 📌 **System Tray** - Minimize to tray, show/hide with menu or click
- ⌨️ **Global Hotkey** - Press **M key** to toggle Picture-in-Picture mode even when window is unfocused

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.2 - UI framework
- **TypeScript** 5.1 - Type safety
- **Vite** 4.4 - Build tool
- **React Konva** - Canvas rendering
- **Recoil** - State management
- **React Router** - Navigation

### Backend
- **Rust** - Native performance
- **Tauri** 2.0 - Desktop framework
- **WebView2** - Windows rendering engine
- **rdev** 0.5 - Global keyboard event listener

### UI Components
- Ant Design Icons
- React Toastify
- RC Slider

---

## 📦 Installation & Usage

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (usually pre-installed on Windows 10/11)

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

> **Note**: The `--legacy-peer-deps` flag is required to resolve peer dependency conflicts.

### Development Mode

Run development server (with hot reload)

```bash
npm run tauri dev
```

### Production Build

Build production installer

**Method 1: Build with TypeScript check (recommended)**

```bash
npm run build              # Build frontend
npm run tauri build        # Build Tauri app and create installer
```

**Method 2: Skip TypeScript check (if encountering type errors)**

```bash
npx vite build             # Build frontend (skip TypeScript)
npm run tauri build        # Build Tauri app and create installer
```

**Build Output Location**:

```
src-tauri/target/release/bundle/
├── nsis/
│   └── *_x64-setup.exe     # NSIS installer
└── msi/
    └── *.msi                # Windows Installer package
```

> **Note**: The build process may take several minutes, especially for the first build.

### GitHub Release (CI)

Workflow: [`.github/workflows/build.yml`](./.github/workflows/build.yml). It runs on **Windows only** (the game is Windows-only), builds **NSIS `.exe` and `.msi`** installers, and attaches them to a **GitHub Release** when you push a version tag.

1. Align versions in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
2. Commit and push to `main` (or your default branch).
3. Create and push a tag (must match `v*`, e.g. `v1.1.8`):

   ```bash
   git tag v1.1.8
   git push origin v1.1.8
   ```

4. Open **Actions** → **Build and Release** and wait for the single **windows-latest** job to finish.
5. Open **Releases**: you should see `*_x64-setup.exe` and `*_x64_*.msi` for that tag.

**Release notes (changelog like v1.1.5):** The workflow sets a short default body via `tauri-action`. For a rich Markdown description, either **Edit release** on GitHub after CI completes and paste from `README.md` / `README_ZH.md`, or change `releaseBody` in the workflow (multi-line YAML `|` block).

**Manual run:** **Actions** → **Build and Release** → **Run workflow** (`workflow_dispatch`) also runs the Windows build; with `tauri-action`, attaching assets to a **Release** is intended for **tag pushes** (`v*`).

---

## 🎨 Custom Icon

To customize the app icon, prepare a 1240x1240 PNG image:

```bash
# 1. Place your icon as app-icon.png in the project root
# 2. Run the icon generation tool
npm run tauri icon
```

---

## 🔧 Development Notes

### Project Structure

```
tarkov-interactive-map-assistant-desktop/
├── src/                    # Frontend code
│   ├── pages/             # Page components
│   ├── components/        # Common components
│   ├── assets/            # Static assets
│   └── utils/             # Utility functions
├── src-tauri/             # Backend code
│   ├── src/
│   │   ├── main.rs       # Entry point
│   │   └── lib.rs        # Core logic
│   ├── icons/            # App icons
│   └── tauri.conf.json   # Tauri config
├── index.html            # HTML entry
├── vite.config.ts        # Vite config
└── package.json          # Dependencies
```

### Available Scripts

```bash
# Development
npm run dev              # Vite dev server
npm run tauri dev        # Tauri dev mode

# Build
npm run build            # Build frontend
npm run tauri build      # Build desktop app

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run prettier         # Format code
npm run fix              # Fix all issues

# Tools
npm run tauri icon       # Generate app icons
```

### Tauri Commands

Available Rust backend commands

```rust
// File system
read_text_file(path: String) -> Result<String, String>
read_directory(path: String) -> Result<Vec<String>, String>
path_exists(path: String) -> bool

// Screenshot directory (for coordinate tracking)
set_screenshot_path(path: String) -> Result<String, String>
get_screenshot_path() -> String

// Tarkov game directory (game log watching, profile/raid events)
set_tarkov_game_path(path: String) -> Result<String, String>
get_tarkov_game_path() -> String
```

---

## 🚀 Performance

- ✅ Resource optimization: 99.5% size reduction (12MB → 60KB)
- ✅ Rust backend: Native performance, low memory usage
- ✅ Canvas rendering: Efficient map rendering with Konva
- ✅ Loading optimization: Blue-themed loading screen

---

## 🎯 Feature Enhancements

### Implemented
- ✅ Disable DevTools (F12)
- ✅ Custom App Icon (Tarkov themed)
- ✅ Loading Animation (Blue theme)
- ✅ Window starts maximized
- ✅ System Tray Support
  - Tray icon (uses app icon)
  - Context Menu: Show Window / Hide Window / Quit
  - Left click to toggle visibility
  - Close button hides to tray
- ✅ File System Access API
- ✅ Single Instance Lock (Prevents multiple instances)
- ✅ Global Keyboard Listener (M key toggles Picture-in-Picture)
- ✅ Rust Game Log Watcher (desktop: pick game dir via dialog, backend parses application log and emits profile/raid events)
- ✅ Tile Map Support (Labs / The Lab map loads via tile layer)
- ✅ Extract Name Localization (PMC/Scav extract Chinese names from reference data)

### Known Issues
- None
  
### Planned
- ⏸️ Game Process Monitoring
- ⏸️ Auto-start Option
- ⏸️ Multi-language Support

---

## 📝 License

This project is open source under the **GPL v3 License**.

---

## 🙏 Credits

Special thanks to [@tiltysola](https://github.com/tiltysola) for creating the [original project](https://github.com/tiltysola/tarkov-tilty-frontend-opensource). This desktop version is adapted from that work.

---

## 📮 Contact & Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Original Project**: [tarkov-interactive-map-assistant-web](https://github.com/TomyTang331/tarkov-interactive-map-assistant)

---

## 📊 Changelog

### Version 1.1.8 (2026-03-13)

- **CI / Release**: GitHub Actions builds on **Windows only** (game is Windows-only); **Node 22** for Vite 7; uploads `.exe` / `.msi` only.

### Version 1.1.7 (2026-03-13)

- The Lab (`tileMapUnsupported`): only the centered “tile map not supported” message; map markers/overlays hidden (no corner thumbnail).
- Trimmed redundant comments in Canvas, QuickTools, BaseMap, Ruler, InteractiveMap index, typings.

### Version 1.1.6 (2026-03-11)

- The Lab map: tile-based loading via `TileLayer` and local tiles at `src/assets/the-lab-map`; virtual canvas size when no SVG base.
- Game log watching: Tauri dialog for game directory; Rust parses application log and emits `profile-log` / `raid-log`; frontend updates raid info and auto map switch.
- PMC/Scav extract labels use Chinese names from `extract_names_zh.json`.
- M key toggles Picture-in-Picture when window is focused (frontend keydown) or unfocused (rdev event).
- ESLint fixes (Canvas, BaseMap, MapInfo, QuickTools); code comments in English.

### Version 1.1.5 (2025-12-19)

- Automatic PNG cleanup in screenshot directory on quit (tray "Quit" menu).

### Version 1.1.4 (2025-12-19)

- Global M key toggles Picture-in-Picture via `rdev` (works when window unfocused).

### Version 1.1.3 (2025-12-19)

- Fixed marker zoom (标点缩放): `onPlayerLocationChange` and Canvas zoom; map centers at 3x scale.
- Removed unused components and dead code; ESLint and type fixes.

### Version 1.1.2 (2025-12-18)

- Fixed React key warnings, PiP blank window, canvas loop; blocked reload shortcuts.

### Version 1.1.0 (2025-12-17)

- First Tauri desktop release; tray, maximized start, close-to-tray; blue theme and custom icon.

---

## 🐛 Troubleshooting

**Issue**: `npm install` fails with dependency conflict errors

**Solution**: Use the `--legacy-peer-deps` flag
```bash
npm install --legacy-peer-deps
```
This resolves peer dependency conflicts that may occur with some packages.

---

---

<p align="center">
  Made with ❤️ for Escape from Tarkov players
</p>
