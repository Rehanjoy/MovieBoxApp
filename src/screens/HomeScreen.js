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

      {/* Section 3: Action & Sci-Fi Picks */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Action & Adventure</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalScroll, { marginBottom: 30 }]}
      >
        {trendingMovies.slice().reverse().map((item) => (
          <TouchableOpacity
            key={`rev_${item.id}`}
            style={styles.movieCard}
            onPress={() => openPlayer(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.poster }} style={styles.moviePoster} />
            <Text style={styles.cardMovieTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardMovieCategory}>{item.category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(18,18,18,0.95)',
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoSquare: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSquareText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  brandTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandAccent: {
    color: colors.primary,
  },
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
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.liveRed,
  },
  liveTvBtnText: {
    color: colors.liveRed,
    fontSize: 11,
    fontWeight: '800',
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: 290,
    position: 'relative',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  featuredBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ratingText: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  qualityPill: {
    color: '#00e5ff',
    backgroundColor: 'rgba(0,229,255,0.15)',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 6,
    gap: 6,
  },
  playIcon: {
    color: '#fff',
    fontSize: 14,
  },
  playMainText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsBtn: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  seeAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 12,
    marginBottom: 24,
  },
  movieCard: {
    width: 125,
  },
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
  ratingBadgeText: {
    color: '#ffd700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardMovieTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardMovieCategory: {
    color: colors.textSecondary,
    fontSize: 11,
  },
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
  channelLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  liveTagOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.liveRed,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  liveTagText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },
  cardChannelTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardChannelCategory: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
});
