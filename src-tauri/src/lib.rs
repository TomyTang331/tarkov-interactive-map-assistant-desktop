// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Clone, Serialize, Deserialize)]
struct TogglePipEvent {
    toggle: bool,
}

#[derive(Clone, Serialize)]
struct ScreenshotCreatedEvent {
    filename: String,
}

#[derive(Clone, Serialize)]
struct ProfileLogEvent {
    #[serde(rename = "profileId")]
    profile_id: String,
    #[serde(rename = "accountId")]
    account_id: String,
}

#[derive(Clone, Serialize)]
struct RaidLogEvent {
    #[serde(rename = "profileId")]
    profile_id: String,
    status: String,
    #[serde(rename = "raidMode")]
    raid_mode: String,
    ip: String,
    port: String,
    location: String,
    sid: String,
    #[serde(rename = "gameMode")]
    game_mode: String,
    #[serde(rename = "shortId")]
    short_id: String,
    #[serde(rename = "realTime", skip_serializing_if = "Option::is_none")]
    real_time: Option<String>,
}

struct AppState {
    screenshot_path: Mutex<String>,
    tarkov_game_path: Mutex<String>,
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

#[tauri::command]
fn set_tarkov_game_path(state: tauri::State<AppState>, path: String) -> Result<String, String> {
    let mut game_path = state.tarkov_game_path.lock().unwrap();
    *game_path = path.clone();
    Ok(format!("Tarkov game path set: {}", path))
}

#[tauri::command]
fn get_tarkov_game_path(state: tauri::State<AppState>) -> String {
    let game_path = state.tarkov_game_path.lock().unwrap();
    game_path.clone()
}

fn resolve_application_log_path(game_root: &str) -> Option<PathBuf> {
    let root = Path::new(game_root);
    if !root.is_dir() {
        return None;
    }
    let logs_dir = root.join("Logs");
    if !logs_dir.is_dir() {
        return None;
    }
    let mut latest_log_dir: Option<(std::time::SystemTime, PathBuf)> = None;
    if let Ok(entries) = fs::read_dir(&logs_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
                // log_YYYY.MM.DD_HH-mm-ss_*
                if name.starts_with("log_") && name.len() > 4 {
                    if let Ok(meta) = entry.metadata() {
                        if let Ok(modified) = meta.modified() {
                            if latest_log_dir.as_ref().map(|(t, _)| modified > *t).unwrap_or(true) {
                                latest_log_dir = Some((modified, path));
                            }
                        }
                    }
                }
            }
        }
    }
    let log_dir = latest_log_dir.map(|(_, p)| p)?;
    if let Ok(entries) = fs::read_dir(&log_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_file() {
                let name = path.file_name().and_then(|n| n.to_str()).unwrap_or("");
                if name.to_lowercase().contains("application") {
                    return Some(path);
                }
            }
        }
    }
    None
}

fn split_log_lines(content: &str) -> Vec<String> {
    let mut logs = Vec::new();
    let mut buffer = String::new();
    for line in content.lines() {
        let is_new = line.len() >= 19
            && line.as_bytes().get(4) == Some(&b'-')
            && line.as_bytes().get(7) == Some(&b'-')
            && line.as_bytes().get(10) == Some(&b' ');
        if is_new {
            if !buffer.is_empty() {
                logs.push(buffer.trim().to_string());
            }
            buffer = line.to_string();
        } else {
            buffer.push('\n');
            buffer.push_str(line);
        }
    }
    if !buffer.is_empty() {
        logs.push(buffer.trim().to_string());
    }
    logs
}

fn parse_profile_line(text: &str) -> Option<ProfileLogEvent> {
    let re = Regex::new(r"(?i)SelectProfile ProfileId:(.+?) AccountId:(.+)").ok()?;
    let cap = re.captures(text)?;
    Some(ProfileLogEvent {
        profile_id: cap.get(1)?.as_str().to_string(),
        account_id: cap.get(2)?.as_str().trim().to_string(),
    })
}

fn parse_raid_line(text: &str) -> Option<RaidLogEvent> {
    let re = Regex::new(r"(?i)'Profileid: (.+?), Status: (.+?), RaidMode: (.+?), Ip: (.+?), Port: (.+?), Location: (.+?), Sid: (.+?), GameMode: (.+?), shortId: (.+?)'").ok()?;
    let cap = re.captures(text)?;
    let sid = cap.get(7)?.as_str().to_string();
    let real_time = Regex::new(r"(.+?)-(.+?)_(.+)")
        .ok()?
        .captures(&sid)
        .and_then(|c| Some(c.get(3)?.as_str().to_string()));
    Some(RaidLogEvent {
        profile_id: cap.get(1)?.as_str().to_string(),
        status: cap.get(2)?.as_str().to_string(),
        raid_mode: cap.get(3)?.as_str().to_string(),
        ip: cap.get(4)?.as_str().to_string(),
        port: cap.get(5)?.as_str().to_string(),
        location: cap.get(6)?.as_str().to_string(),
        sid,
        game_mode: cap.get(8)?.as_str().to_string(),
        short_id: cap.get(9)?.as_str().to_string(),
        real_time,
    })
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
        tarkov_game_path: Mutex::new(String::new()),
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

            // Start screenshot directory watcher in a background thread（保持不变）
            let app_handle_screenshot = app.handle().clone();
            thread::spawn(move || {
                use std::collections::HashSet;

                let mut known_files: HashSet<String> = HashSet::new();
                loop {
                    let path = {
                        let state = app_handle_screenshot.state::<AppState>();
                        let p = state.screenshot_path.lock().unwrap();
                        p.clone()
                    };

                    if !path.is_empty() {
                        if let Ok(entries) = fs::read_dir(&path) {
                            let mut current_files: HashSet<String> = HashSet::new();
                            for entry in entries {
                                if let Ok(entry) = entry {
                                    if let Some(name) = entry.file_name().to_str() {
                                        let name_str = name.to_string();
                                        if !known_files.contains(&name_str) {
                                            let _ = app_handle_screenshot.emit(
                                                "screenshot-created",
                                                &ScreenshotCreatedEvent {
                                                    filename: name_str.clone(),
                                                },
                                            );
                                        }
                                        current_files.insert(name_str);
                                    }
                                }
                            }
                            known_files = current_files;
                        }
                    }

                    thread::sleep(Duration::from_millis(1000));
                }
            });

            // Start game log watcher in a separate background thread
            let app_handle_log = app.handle().clone();
            thread::spawn(move || {
                let mut last_line_count: u64 = 0;
                let mut last_modified: Option<std::time::SystemTime> = None;
                let mut initialized = false;
                loop {
                    let game_root = {
                        let state = app_handle_log.state::<AppState>();
                        let p = state.tarkov_game_path.lock().unwrap();
                        p.clone()
                    };

                    if !game_root.is_empty() {
                        if let Some(log_path) = resolve_application_log_path(&game_root) {
                            if let Ok(meta) = fs::metadata(&log_path) {
                                let modified = meta.modified().ok();
                                let need_read = match (last_modified, modified) {
                                    (None, Some(_)) => true,
                                    (Some(a), Some(b)) => b > a,
                                    _ => false,
                                };
                                if need_read {
                                    last_modified = modified;
                                    if let Ok(content) = fs::read_to_string(&log_path) {
                                        let lines = split_log_lines(&content);
                                        let n = lines.len() as u64;
                                        if n > last_line_count {
                                            let start = last_line_count as usize;
                                            if !initialized {
                                                initialized = true;
                                                last_line_count = n;
                                            } else {
                                                last_line_count = n;
                                                for line in lines.iter().skip(start) {
                                                    if let Some(ev) = parse_profile_line(line) {
                                                        let _ = app_handle_log.emit(
                                                            "profile-log",
                                                            &ProfileLogEvent {
                                                                profile_id: ev.profile_id,
                                                                account_id: ev.account_id,
                                                            },
                                                        );
                                                    }
                                                    if let Some(ev) = parse_raid_line(line) {
                                                        let _ = app_handle_log.emit("raid-log", &ev);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        last_line_count = 0;
                        last_modified = None;
                        initialized = false;
                    }

                    thread::sleep(Duration::from_millis(2000));
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            read_text_file,
            read_directory,
            path_exists,
            minimize_window,
            set_screenshot_path,
            get_screenshot_path,
            set_tarkov_game_path,
            get_tarkov_game_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
