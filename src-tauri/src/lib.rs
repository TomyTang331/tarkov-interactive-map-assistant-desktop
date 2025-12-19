// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Clone, Serialize, Deserialize)]
struct TogglePipEvent {
    toggle: bool,
}

// State to hold the screenshot directory path
struct AppState {
    screenshot_path: Mutex<String>,
}

// Start global keyboard listener
fn start_global_keyboard_listener(app_handle: AppHandle) {
    std::thread::spawn(move || {
        let callback = move |event: rdev::Event| {
            if let rdev::EventType::KeyPress(key) = event.event_type {
                // Only handle M key
                if matches!(key, rdev::Key::KeyM) {
                    // Send toggle PiP event to frontend
                    if let Err(e) = app_handle.emit("toggle-pip", &TogglePipEvent { toggle: true })
                    {
                        eprintln!("Failed to emit toggle-pip event: {}", e);
                    }
                }
            }
        };

        // Start listening, this will block the current thread
        if let Err(error) = rdev::listen(callback) {
            eprintln!("Error while listening to keyboard events: {:?}", error);
        }
    });
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Read contents of a text file
#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file {}: {}", path, e))
}

// Read directory contents
#[tauri::command]
fn read_directory(path: String) -> Result<Vec<String>, String> {
    let entries =
        fs::read_dir(&path).map_err(|e| format!("Failed to read directory {}: {}", path, e))?;

    let mut files = Vec::new();
    for entry in entries {
        if let Ok(entry) = entry {
            if let Some(name) = entry.file_name().to_str() {
                files.push(name.to_string());
            }
        }
    }

    Ok(files)
}

// Check if a path exists
#[tauri::command]
fn path_exists(path: String) -> bool {
    PathBuf::from(path).exists()
}

// Minimize window (not hide to tray)
#[tauri::command]
fn minimize_window(window: tauri::Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

// Set screenshot directory path
#[tauri::command]
fn set_screenshot_path(state: tauri::State<AppState>, path: String) -> Result<String, String> {
    let mut screenshot_path = state.screenshot_path.lock().unwrap();
    *screenshot_path = path.clone();
    Ok(format!("Screenshot path set to: {}", path))
}

// Get current screenshot directory path
#[tauri::command]
fn get_screenshot_path(state: tauri::State<AppState>) -> String {
    let screenshot_path = state.screenshot_path.lock().unwrap();
    screenshot_path.clone()
}

// Function to delete all PNG files in the screenshot directory
fn cleanup_screenshot_pngs(screenshot_path: &str) {
    if screenshot_path.is_empty() {
        return;
    }

    let path = Path::new(screenshot_path);
    if !path.exists() || !path.is_dir() {
        return;
    }

    match fs::read_dir(path) {
        Ok(entries) => {
            for entry in entries {
                if let Ok(entry) = entry {
                    let file_path = entry.path();
                    if file_path.is_file() {
                        if let Some(extension) = file_path.extension() {
                            if extension.to_str().unwrap_or("").to_lowercase() == "png" {
                                let _ = fs::remove_file(&file_path);
                            }
                        }
                    }
                }
            }
        }
        Err(_) => {}
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use tauri::{
        menu::{MenuBuilder, MenuItemBuilder},
        tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    };

    // Initialize app state
    let app_state = AppState {
        screenshot_path: Mutex::new(String::new()),
    };

    tauri::Builder::default()
        .manage(app_state)
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            // When a second instance is launched, focus the existing window
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .show();
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .unminimize();
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Create system tray menu
            let show_item = MenuItemBuilder::new("Show Window").id("show").build(app)?;
            let hide_item = MenuItemBuilder::new("Hide Window").id("hide").build(app)?;
            let quit_item = MenuItemBuilder::new("Quit").id("quit").build(app)?;

            let tray_menu = MenuBuilder::new(app)
                .item(&show_item)
                .item(&hide_item)
                .separator()
                .item(&quit_item)
                .build()?;

            // Create system tray icon
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.unminimize();
                            let _ = window.set_focus();
                        }
                    }
                    "hide" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.hide();
                        }
                    }
                    "quit" => {
                        // Cleanup PNG files before exiting
                        if let Some(state) = app.try_state::<AppState>() {
                            let screenshot_path = state.screenshot_path.lock().unwrap();
                            cleanup_screenshot_pngs(&screenshot_path);
                        }

                        // Explicitly close the window before exiting to avoid "Failed to unregister class" error
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.destroy();
                        }
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            // Hide window on close instead of exit and block refresh shortcuts
            if let Some(window) = app.get_webview_window("main") {
                let window_clone = window.clone();
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = window_clone.hide();
                    }
                });

                // Block all refresh keyboard shortcuts using JavaScript
                let _ = window.eval(
                    r#"
                    window.addEventListener('keydown', function(e) {
                        // Block F5 (refresh)
                        if (e.key === 'F5') {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }

                        // Block Ctrl+F5 (hard refresh - already blocked by F5 check but explicit)
                        if (e.ctrlKey && e.key === 'F5') {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }

                        // Block Shift+Ctrl+R (reload with cache override)
                        if (e.shiftKey && e.ctrlKey && e.key === 'R') {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                        
                        // Block Ctrl+R (normal reload)
                        if (e.ctrlKey && !e.shiftKey && e.key === 'r') {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }
                    }, true);
                    "#,
                );
            }

            // Start global keyboard listener
            start_global_keyboard_listener(app.handle().clone());

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            read_text_file,
            read_directory,
            path_exists,
            minimize_window,
            set_screenshot_path,
            get_screenshot_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
