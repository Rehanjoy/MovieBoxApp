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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Downloads</Text>
        <Text style={styles.storageStatus}>Storage: 24.5 GB Free</Text>
      </View>

      {/* Downloads List */}
      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⬇️</Text>
            <Text style={styles.emptyTitle}>No Offline Videos</Text>
            <Text style={styles.emptyDesc}>
              Movies you download will appear here so you can watch them anytime, anywhere without an internet connection.
            </Text>
          </View>
        }
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  storageStatus: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  downloadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  playThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playThumbIcon: {
    color: '#fff',
    fontSize: 18,
  },
  itemMeta: {
    flex: 1,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemInfo: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
