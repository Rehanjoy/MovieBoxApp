# 🎬 MovieBox React Native App (v3.0.0)

A high-performance Full-Stack Streaming and 24/7 Live IPTV application built with React Native and native video engine (ExoPlayer on Android / AVPlayer on iOS).

---

## 🌟 Key Features

- 🚀 **100% In-App Native Player Engine**: Plays HLS (`.m3u8`), MP4, and MKV streams without requiring external apps like VLC or MX Player.
- 📺 **24/7 Live IPTV Stream Hub**: Category filter chips, verified live channels, and instant playback.
- 📡 **Custom M3U / M3U8 Playlist Importer**: Load hundreds of public or private IPTV channels via URL or direct M3U text paste.
- ⚡ **Landscape Auto-Lock**: Native cinema mode with on-screen overlay controls (play/pause, forward, rewind, quality selector).
- 📲 **Smart TV Cast / DLNA**: Cast live streams and movies directly to Smart TVs, Firesticks, Android TVs, and DLNA receivers.
- 💾 **Offline Video Downloader**: Save videos locally to device storage for offline playback.
- ☁️ **1-Click GitHub Cloud APK Builder**: Automated GitHub Actions workflow builds a downloadable `.apk` file without requiring Android Studio, Gradle, or a laptop.

---

## 📁 Project Directory Structure

```text
MovieBoxApp/
├── App.js                      # Root Entry Point
├── package.json                # Project Dependencies
├── README.md                   # Installation & Setup Guide
├── .github/
│   └── workflows/
│       └── build-apk.yml       # 1-Click Cloud APK Build Script
└── src/
    ├── navigation/
    │   └── AppNavigator.js     # Bottom Tabs & Fullscreen Player Navigation
    ├── screens/
    │   ├── HomeScreen.js       # Trending Movies & Live TV Banner/Carousels
    │   ├── LiveTvScreen.js     # Category Filter Chips & M3U Playlist Loader
    │   ├── PlayerScreen.js     # Fullscreen Landscape In-App Native Player
    │   ├── DownloadsScreen.js  # Offline Saved Videos Manager
    │   └── SearchScreen.js     # Unified Search Across Content
    ├── services/
    │   ├── apiService.js       # Free Public Metadata & HLS Streams
    │   ├── iptvParser.js       # M3U / M3U8 Playlist Parser
    │   ├── downloadManager.js  # Local Video File Downloader
    │   └── castService.js      # DLNA / Smart TV Casting Service
    └── theme/
        └── colors.js           # Netflix Dark Design System
```

---

## 🚀 Bina Code Editor / Laptop Ke APK Download Kaise Karein?

1. **GitHub Repository Banayein:**
   - [GitHub.com](https://github.com) par free account banayein.
   - `New Repository` par click karein aur naam dein: `MovieBox-App` (Public ya Private).

2. **Files Upload Karein:**
   - Upar diye gaye structure ke according files create ya upload kar dein.
   - Sabse important file: `.github/workflows/build-apk.yml`.

3. **1-Click APK Download Karein:**
   - Apni repository ke **Actions** tab me jayein.
   - **"Build Android APK"** workflow select karein aur **"Run workflow"** par click karein.
   - 3-5 minutes me build complete hone par **Artifacts** section se `MovieBox-Android-APK` download karein aur apne Android phone ya Smart TV par install karein!
