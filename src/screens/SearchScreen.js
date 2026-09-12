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
      {/* Search Input */}
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

      {/* Filter Tabs */}
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

      {/* Results List */}
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsList}
        ListEmptyComponent={
          query.trim().length > 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No results found for "{query}"</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.initialText}>Search for your favorite movies, sports, and live TV channels.</Text>
            </View>
          )
        }
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
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
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  clearBtn: {
    color: '#aaa',
    fontSize: 16,
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  resultDetails: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  playIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  initialText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
