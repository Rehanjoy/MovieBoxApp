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

      {/* Native Embedded Player Engine (ExoPlayer on Android / AVPlayer on iOS) */}
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
