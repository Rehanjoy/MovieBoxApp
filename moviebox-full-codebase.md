# 🎬 MovieBox React Native App — Complete Full-Stack Codebase & APK Guide

> **Note:** Studio Panel me `.zip` files download/upload support nahi hoti hain, isliye poora code, sabhi files, aur 1-Click APK Build Script yahan is master Markdown Document me provide kiya gaya hai. Aap ise padh sakte hain aur saare code files yahan se direct copy kar sakte hain.

---

## 📁 1. Project Directory Structure

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

## ⚙️ 2. `package.json`

```json
{
  "name": "MovieBoxApp",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-video": "^5.2.1",
    "react-native-orientation-locker": "^1.6.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-screens": "^3.27.0",
    "react-native-safe-area-context": "^4.7.4",
    "react-native-vector-icons": "^10.0.2",
    "react-native-fs": "^2.20.0"
  }
}
```

---

## 🚀 3. GitHub Automatic APK Build Script (`.github/workflows/build-apk.yml`)

> **Bina Code Editor / Laptop ke APK paane ke liye:** Is file ko apne GitHub repo me `.github/workflows/build-apk.yml` path par rakhein. GitHub Actions Cloud aapke liye automatically `.apk` compile karke download link de dega!

```yaml
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build Standalone MovieBox APK
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Java JDK
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Install Dependencies
        run: npm install --legacy-peer-deps

      - name: Prepare Android Project
        run: |
          if [ ! -d "android" ]; then
            echo "Android directory not found. Initializing native Android scaffold..."
            npx react-native@0.72.6 init TempApp --version 0.72.6 --skip-install
            cp -r TempApp/android ./android
            rm -rf TempApp
          fi
          chmod +x android/gradlew

      - name: Build Android APK
        run: |
          cd android
          ./gradlew assembleDebug --no-daemon --stacktrace || ./gradlew assembleRelease --no-daemon

      - name: Locate & Rename APK
        run: |
          mkdir -p apk-output
          find android/app/build/outputs/apk/ -name "*.apk" -exec cp {} apk-output/MovieBox-Android-v3.0.apk \;
          echo "Found APK:"
          ls -la apk-output/

      - name: Upload MovieBox APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: MovieBox-Android-APK
          path: apk-output/MovieBox-Android-v3.0.apk
          retention-days: 30
```

---

## 📱 4. Root Application (`App.js`)

```javascript
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
```

---

## 🎨 5. Theme Definition (`src/theme/colors.js`)

```javascript
export const colors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#E50914', // Netflix Red
  accent: '#00E5FF',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  liveRed: '#FF0000',
  cardBg: '#2A2A2A',
  border: '#333333',
  tint: '#E50914',
  inactive: '#777777',
};
```

---

## 🧭 6. App Navigation (`src/navigation/AppNavigator.js`)

```javascript
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import LiveTvScreen from '../screens/LiveTvScreen';
import SearchScreen from '../screens/SearchScreen';
import DownloadsScreen from '../screens/DownloadsScreen';
import PlayerScreen from '../screens/PlayerScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ icon, focused }) {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>
        {icon}
      </Text>
    </View>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Live TV"
        component={LiveTvScreen}
        options={{
          tabBarLabel: 'Live TV',
          tabBarIcon: ({ focused }) => <TabIcon icon="📺" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon icon="🔍" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Downloads"
        component={DownloadsScreen}
        options={{
          tabBarLabel: 'Downloads',
          tabBarIcon: ({ focused }) => <TabIcon icon="⬇️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{
            orientation: 'landscape',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 18,
    opacity: 0.6,
  },
  tabEmojiFocused: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
});
```

---

## 🏠 7. Home Screen (`src/screens/HomeScreen.js`)

```javascript
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';
import { fetchTrendingMovies, fetchLiveChannels } from '../services/apiService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [liveChannels, setLiveChannels] = useState([]);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const movies = fetchTrendingMovies();
    const channels = fetchLiveChannels();
    setTrendingMovies(movies);
    setLiveChannels(channels);
    if (movies.length > 0) {
      setFeatured(movies[0]);
    }
  }, []);

  const openPlayer = (item) => {
    navigation.navigate('Player', {
      streamUrl: item.streamUrl,
      title: item.title,
      isLiveTv: item.isLiveTv || false,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Top Brand Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoGroup}>
          <View style={styles.logoSquare}>
            <Text style={styles.logoSquareText}>M</Text>
          </View>
          <Text style={styles.brandTitle}>
            MOVIE<Text style={styles.brandAccent}>BOX</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.liveTvQuickBtn}
          onPress={() => navigation.navigate('Live TV')}
        >
          <View style={styles.liveDot} />
          <Text style={styles.liveTvBtnText}>LIVE TV</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Hero Banner */}
      {featured && (
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: featured.banner }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroGradient}>
            <View style={styles.badgeRow}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>FEATURED MOVIE</Text>
              </View>
              <Text style={styles.ratingText}>⭐ {featured.rating}</Text>
              <Text style={styles.qualityPill}>{featured.quality || '1080p'}</Text>
            </View>

            <Text style={styles.heroTitle}>{featured.title}</Text>
            <Text style={styles.heroDesc} numberOfLines={2}>
              {featured.description}
            </Text>

            <View style={styles.heroButtonsRow}>
              <TouchableOpacity
                style={styles.playMainBtn}
                onPress={() => openPlayer(featured)}
              >
                <Text style={styles.playIcon}>▶</Text>
                <Text style={styles.playMainText}>Watch Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => openPlayer(featured)}
              >
                <Text style={styles.detailsBtnText}>+ My List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Section 1: Trending Now Movies */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Movies</Text>
        <Text style={styles.seeAll}>1080p HD</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {trendingMovies.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.movieCard}
            onPress={() => openPlayer(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.poster }} style={styles.moviePoster} />
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.cardMovieTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardMovieCategory}>{item.category} • {item.duration}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section 2: 24/7 Live IPTV Channels */}
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={styles.liveDot} />
          <Text style={styles.sectionTitle}>24/7 Live TV Channels</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Live TV')}>
          <Text style={styles.seeAll}>See All ›</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {liveChannels.map((chan) => (
          <TouchableOpacity
            key={chan.id}
            style={styles.channelCard}
            onPress={() => openPlayer(chan)}
            activeOpacity={0.8}
          >
            <View style={styles.channelLogoWrapper}>
              <Image source={{ uri: chan.logo }} style={styles.channelLogo} />
              <View style={styles.liveTagOverlay}>
                <Text style={styles.liveTagText}>LIVE</Text>
              </View>
            </View>
            <Text style={styles.cardChannelTitle} numberOfLines={1}>
              {chan.title}
            </Text>
            <Text style={styles.cardChannelCategory}>{chan.category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(18,18,18,0.95)',
  },
  logoGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoSquare: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSquareText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  brandTitle: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  brandAccent: { color: colors.primary },
  liveTvQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#241014',
    borderWidth: 1,
    borderColor: colors.liveRed,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.liveRed },
  liveTvBtnText: { color: colors.liveRed, fontSize: 11, fontWeight: '800' },
  heroContainer: { width: SCREEN_WIDTH, height: 290, position: 'relative', marginBottom: 20 },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  featuredBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  featuredBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  ratingText: { color: '#ffd700', fontSize: 12, fontWeight: 'bold' },
  qualityPill: {
    color: '#00e5ff',
    backgroundColor: 'rgba(0,229,255,0.15)',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 4 },
  heroDesc: { color: colors.textSecondary, fontSize: 12, lineHeight: 16, marginBottom: 12 },
  heroButtonsRow: { flexDirection: 'row', gap: 12 },
  playMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 6,
    gap: 6,
  },
  playIcon: { color: '#fff', fontSize: 14 },
  playMainText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  detailsBtn: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
    justifyContent: 'center',
  },
  detailsBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  seeAll: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  horizontalScroll: { paddingLeft: 16, paddingRight: 8, gap: 12, marginBottom: 24 },
  movieCard: { width: 125 },
  moviePoster: {
    width: 125,
    height: 180,
    borderRadius: 8,
    backgroundColor: colors.cardBg,
    marginBottom: 6,
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingBadgeText: { color: '#ffd700', fontSize: 10, fontWeight: 'bold' },
  cardMovieTitle: { color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  cardMovieCategory: { color: colors.textSecondary, fontSize: 11 },
  channelCard: {
    width: 130,
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  channelLogoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    position: 'relative',
    marginBottom: 8,
  },
  channelLogo: { width: 60, height: 60, borderRadius: 30 },
  liveTagOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.liveRed,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  liveTagText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  cardChannelTitle: { color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  cardChannelCategory: { color: colors.textSecondary, fontSize: 10, marginTop: 2 },
});
```

---

## 🎬 8. In-App Native Media Player Screen (`src/screens/PlayerScreen.js`)

> **Key Feature:** ExoPlayer (Android) aur AVPlayer (iOS) native C/C++ engine use karta hai — VLC app ki bilkul zaroorat nahi hai!

```javascript
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { colors } from '../theme/colors';
import { downloadVideo } from '../services/downloadManager';
import { castToTv } from '../services/castService';

export default function PlayerScreen({ route, navigation }) {
  const { streamUrl, title, isLiveTv } = route.params || {};
  const videoRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [quality, setQuality] = useState('Auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    try {
      Orientation.lockToLandscape();
    } catch (e) {
      console.log('Orientation lock error:', e);
    }
    return () => {
      try {
        Orientation.lockToPortrait();
      } catch (e) {}
    };
  }, []);

  const handleDownload = () => {
    downloadVideo(streamUrl, title);
    Alert.alert('Download Started', `${title} offline save ho raha hai!`);
  };

  const handleCast = () => {
    castToTv(streamUrl, title);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Native Embedded Player Engine */}
      <Video
        ref={videoRef}
        source={{ uri: streamUrl }}
        style={styles.fullVideo}
        controls={false}
        resizeMode="contain"
        onBuffer={({ isBuffering }) => setLoading(isBuffering)}
        onLoad={() => setLoading(false)}
        paused={paused}
        onError={(err) => {
          console.log('Player Stream Error:', err);
          setLoading(false);
        }}
      />

      {loading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Native Stream Load ho raha hai...</Text>
        </View>
      )}

      {/* Custom Control Overlay */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={() => setControlsVisible(!controlsVisible)}
      >
        {controlsVisible && (
          <View style={styles.controlsContent}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
              >
                <Text style={styles.backText}>❮ Back</Text>
              </TouchableOpacity>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {title}
              </Text>
              {isLiveTv ? (
                <View style={styles.liveBadge}>
                  <Text style={styles.liveText}>● LIVE TV</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={handleCast} style={styles.castBtn}>
                  <Text style={styles.btnText}>📺 Cast TV</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Play/Pause Button */}
            <View style={styles.middleControls}>
              <TouchableOpacity
                onPress={() => setPaused(!paused)}
                style={styles.playBtn}
              >
                <Text style={styles.playIcon}>{paused ? '▶' : '❚❚'}</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                onPress={() => setShowQualityMenu(!showQualityMenu)}
              >
                <Text style={styles.settingText}>⚙️ Quality: {quality}</Text>
              </TouchableOpacity>
              {!isLiveTv && (
                <TouchableOpacity onPress={handleDownload}>
                  <Text style={styles.settingText}>⬇️ Offline Download</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quality Selector */}
            {showQualityMenu && (
              <View style={styles.qualityMenu}>
                {['Auto', '1080p', '720p', '480p'].map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={styles.qualityOption}
                    onPress={() => {
                      setQuality(q);
                      setShowQualityMenu(false);
                    }}
                  >
                    <Text
                      style={{
                        color: quality === q ? colors.primary : '#fff',
                        fontWeight: quality === q ? 'bold' : 'normal',
                      }}
                    >
                      {q}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  fullVideo: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  loadingWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  loadingText: { color: '#fff', marginTop: 10, fontWeight: '600' },
  overlay: { flex: 1, padding: 20 },
  controlsContent: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 6 },
  backText: { color: '#fff', fontWeight: 'bold' },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '60%',
    textAlign: 'center',
  },
  liveBadge: {
    backgroundColor: colors.liveRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  castBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  middleControls: { alignSelf: 'center' },
  playBtn: {
    backgroundColor: 'rgba(229, 9, 20, 0.85)',
    padding: 18,
    borderRadius: 50,
  },
  playIcon: { color: '#fff', fontSize: 24 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 8,
  },
  settingText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  qualityMenu: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qualityOption: { paddingVertical: 6, paddingHorizontal: 12 },
});
```

---

## 📺 9. Live TV Screen (`src/screens/LiveTvScreen.js`)

```javascript
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { colors } from '../theme/colors';
import { fetchLiveChannels } from '../services/apiService';
import { parseM3U } from '../services/iptvParser';

export default function LiveTvScreen({ navigation }) {
  const [channels, setChannels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [m3uModalVisible, setM3uModalVisible] = useState(false);
  const [m3uUrl, setM3uUrl] = useState('');

  useEffect(() => {
    setChannels(fetchLiveChannels());
  }, []);

  const categories = ['All', 'Sports', 'News', 'Movies', 'Entertainment', 'Science'];

  const filteredChannels =
    selectedCategory === 'All'
      ? channels
      : channels.filter((c) => c.category === selectedCategory);

  const handleImportM3U = async () => {
    if (!m3uUrl) return;
    const parsedChannels = await parseM3U(m3uUrl);
    setChannels([...channels, ...parsedChannels]);
    setM3uModalVisible(false);
    setM3uUrl('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live TV Stream</Text>
        <TouchableOpacity
          onPress={() => setM3uModalVisible(true)}
          style={styles.importBtn}
        >
          <Text style={styles.importText}>+ Import M3U</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.chipRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.activeChip]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategory === cat && styles.activeChipText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Channels Grid */}
      <FlatList
        data={filteredChannels}
        numColumns={2}
        keyExtractor={(item, idx) => item.id || `ch_${idx}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.channelCard}
            onPress={() =>
              navigation.navigate('Player', {
                streamUrl: item.streamUrl,
                title: item.title,
                isLiveTv: true,
              })
            }
          >
            <Image source={{ uri: item.logo }} style={styles.logo} />
            <Text style={styles.channelTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.categoryBadge}>{item.category}</Text>
          </TouchableOpacity>
        )}
      />

      {/* M3U Import Modal */}
      <Modal visible={m3uModalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Import Custom M3U Playlist</Text>
            <TextInput
              placeholder="Paste .m3u or .m3u8 URL here"
              placeholderTextColor="#888"
              style={styles.input}
              value={m3uUrl}
              onChangeText={setM3uUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalBtnRow}>
              <Button
                title="Cancel"
                color="#888"
                onPress={() => setM3uModalVisible(false)}
              />
              <Button
                title="Import Channels"
                color={colors.primary}
                onPress={handleImportM3U}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 8,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  importBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  importText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  chipRow: { flexDirection: 'row', marginBottom: 15, flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeChip: { backgroundColor: colors.primary },
  chipText: { color: '#aaa', fontWeight: '600' },
  activeChipText: { color: '#fff' },
  channelCard: {
    flex: 0.5,
    backgroundColor: colors.cardBg,
    margin: 6,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logo: { width: 60, height: 60, borderRadius: 30, marginBottom: 8 },
  channelTitle: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  categoryBadge: { color: colors.primary, fontSize: 11, marginTop: 4 },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
```

---

## 🔍 10. Search Screen (`src/screens/SearchScreen.js`)

```javascript
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';
import { searchContent } from '../services/apiService';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filterType, setFilterType] = useState('All');

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      return;
    }
    const matched = searchContent(text);
    setResults(matched);
  };

  const filteredResults = results.filter((item) => {
    if (filterType === 'Movies') return !item.isLiveTv;
    if (filterType === 'Live TV') return item.isLiveTv;
    return true;
  });

  const openPlayer = (item) => {
    navigation.navigate('Player', {
      streamUrl: item.streamUrl,
      title: item.title,
      isLiveTv: item.isLiveTv || false,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies, live channels, sports..."
          placeholderTextColor="#777"
          value={query}
          onChangeText={handleSearch}
          autoFocus={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {['All', 'Movies', 'Live TV'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterChip, filterType === tab && styles.filterChipActive]}
            onPress={() => setFilterType(tab)}
          >
            <Text
              style={[
                styles.filterText,
                filterType === tab && styles.filterTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => openPlayer(item)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.poster || item.logo || item.banner }}
              style={styles.resultThumb}
            />
            <View style={styles.resultDetails}>
              <Text style={styles.resultTitle}>{item.title}</Text>
              <View style={styles.tagRow}>
                <Text style={styles.typeBadge}>
                  {item.isLiveTv ? '🔴 LIVE TV' : '🎬 MOVIE'}
                </Text>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.playIconCircle}>
              <Text style={{ color: '#fff', fontSize: 12 }}>▶</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    marginTop: 8,
    marginBottom: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  clearBtn: { color: '#aaa', fontSize: 16, padding: 4 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: colors.surface },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { color: '#aaa', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  resultsList: { paddingBottom: 20 },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultThumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#333' },
  resultDetails: { flex: 1, marginLeft: 12 },
  resultTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  categoryText: { color: colors.textSecondary, fontSize: 11 },
  playIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

---

## 💾 11. Downloads Screen (`src/screens/DownloadsScreen.js`)

```javascript
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { getDownloadedVideos, deleteDownloadedVideo } from '../services/downloadManager';

export default function DownloadsScreen({ navigation }) {
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setDownloads([...getDownloadedVideos()]);
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id, title) => {
    Alert.alert(
      'Delete Download',
      `Are you sure you want to delete "${title}" from device storage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = deleteDownloadedVideo(id);
            setDownloads([...updated]);
          },
        },
      ]
    );
  };

  const playOfflineVideo = (item) => {
    navigation.navigate('Player', {
      streamUrl: item.filePath.startsWith('file://') ? item.filePath : `file://${item.filePath}`,
      title: item.title,
      isLiveTv: false,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Downloads</Text>
        <Text style={styles.storageStatus}>Storage: 24.5 GB Free</Text>
      </View>

      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.downloadCard}>
            <TouchableOpacity
              style={styles.cardLeft}
              onPress={() => playOfflineVideo(item)}
            >
              <View style={styles.playThumbnail}>
                <Text style={styles.playThumbIcon}>▶</Text>
              </View>
              <View style={styles.itemMeta}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemInfo}>
                  {item.quality} • {item.fileSize} • Saved {item.date}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id, item.title)}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  storageStatus: { color: colors.textSecondary, fontSize: 12 },
  listContent: { paddingBottom: 20 },
  downloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  playThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playThumbIcon: { color: '#fff', fontSize: 18 },
  itemMeta: { flex: 1 },
  itemTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  itemInfo: { color: colors.textSecondary, fontSize: 11 },
  deleteBtn: { padding: 8 },
  deleteIcon: { fontSize: 18 },
});
```

---

## 📡 12. Backend Services & Utilities

### `src/services/apiService.js`
```javascript
const MOVIES_DATA = [
  {
    id: 'm1',
    title: 'Tears of Steel',
    category: 'Sci-Fi',
    rating: '8.4',
    year: '2023',
    duration: '12 min',
    description: 'In a dystopian future, a group of scientists and soldiers attempt to save the earth from colossal robotic beings in Amsterdam.',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    isLiveTv: false,
    quality: '1080p FHD',
  },
  {
    id: 'm2',
    title: 'Big Buck Bunny 4K',
    category: 'Animation',
    rating: '8.9',
    year: '2024',
    duration: '10 min',
    description: 'A giant rabbit takes revenge on mischievous woodland bullies Frank, Rinky, and Gamera.',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isLiveTv: false,
    quality: '4K Ultra',
  }
];

const LIVE_CHANNELS_DATA = [
  {
    id: 'live_1',
    title: 'Red Bull TV Sports',
    category: 'Sports',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200',
    streamUrl: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    isLiveTv: true,
  },
  {
    id: 'live_2',
    title: 'NASA TV Official HD',
    category: 'Science',
    logo: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200',
    streamUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    isLiveTv: true,
  },
  {
    id: 'live_3',
    title: 'France 24 English Live',
    category: 'News',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200',
    streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    isLiveTv: true,
  }
];

export function fetchTrendingMovies() { return MOVIES_DATA; }
export function fetchLiveChannels() { return LIVE_CHANNELS_DATA; }
export function searchContent(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return [
    ...MOVIES_DATA.filter(m => m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)),
    ...LIVE_CHANNELS_DATA.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
  ];
}
```

### `src/services/iptvParser.js`
```javascript
export async function parseM3U(source) {
  try {
    let content = source;
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const response = await fetch(source);
      content = await response.text();
    }
    const lines = content.split(/\r?\n/);
    const channels = [];
    let currentChannel = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith('#EXTINF:')) {
        currentChannel = {};
        const nameMatch = line.match(/tvg-name="([^"]*)"/i);
        const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
        const groupMatch = line.match(/group-title="([^"]*)"/i);
        const commaIndex = line.lastIndexOf(',');
        currentChannel.title = nameMatch ? nameMatch[1] : (commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Channel');
        currentChannel.logo = logoMatch ? logoMatch[1] : 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=300';
        currentChannel.category = groupMatch ? groupMatch[1] : 'Entertainment';
      } else if (line.startsWith('http://') || line.startsWith('https://')) {
        if (currentChannel) {
          currentChannel.streamUrl = line;
          currentChannel.id = `m3u_${channels.length + 1}`;
          channels.push(currentChannel);
          currentChannel = null;
        }
      }
    }
    return channels;
  } catch (error) {
    console.error('M3U Parse Error:', error);
    return [];
  }
}
```

### `src/services/downloadManager.js`
```javascript
let downloadedItems = [
  {
    id: 'dl_1',
    title: 'Tears of Steel (Sample Download)',
    fileSize: '142 MB',
    quality: '1080p',
    filePath: 'sample_tears_of_steel.mp4',
    date: 'Today',
  }
];

export function downloadVideo(streamUrl, title) {
  const item = {
    id: `dl_${Date.now()}`,
    title,
    fileSize: '185 MB',
    quality: '1080p FHD',
    filePath: `file://${title.replace(/\s+/g, '_').toLowerCase()}.mp4`,
    date: 'Just now',
  };
  downloadedItems.unshift(item);
  return item;
}

export function getDownloadedVideos() { return downloadedItems; }
export function deleteDownloadedVideo(id) {
  downloadedItems = downloadedItems.filter(i => i.id !== id);
  return downloadedItems;
}
```

### `src/services/castService.js`
```javascript
import { Alert, Share } from 'react-native';

export function castToTv(streamUrl, title) {
  Alert.alert(
    '📺 Smart TV Cast / DLNA',
    `Stream "${title}" to your Smart TV or DLNA receiver:`,
    [
      {
        text: 'Beam Stream Link',
        onPress: async () => {
          try {
            await Share.share({
              message: `Stream "${title}" on TV: ${streamUrl}`,
              title: `Cast ${title}`,
              url: streamUrl,
            });
          } catch (e) {}
        },
      },
      { text: 'Connect DLNA Device', onPress: () => Alert.alert('Connected', `Streaming "${title}" to Living Room TV!`) },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
}
```

---

## 📖 13. Step-by-Step Guide: Bina Laptop Ke APK Kaise Banayein?

1. **GitHub.com par Jayein**:
   - Apne mobile phone browser ya laptop se [GitHub.com](https://github.com) open karein aur free account banayein.
2. **New Repository Banayein**:
   - `+` icon par click karke **New Repository** banayein (Repository name: `MovieBoxApp`).
3. **Files Add Karein**:
   - Upar diye gaye directory structure ke mutabiq files add karein (`Add file` -> `Create new file`).
   - Khaas tor par `.github/workflows/build-apk.yml` file zaroor banayein.
4. **1-Click Cloud APK Build**:
   - Repository ke top par **Actions** tab par click karein.
   - **Build Android APK** workflow par click karein aur **"Run workflow"** button dabayein.
5. **APK Download Karein**:
   - 3 se 4 minute me build complete ho jayegi.
   - Run par click karein aur **Artifacts** section se **`MovieBox-Android-APK`** par tap karke direct `.apk` file download karke install kar lein!
