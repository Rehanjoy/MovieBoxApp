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
