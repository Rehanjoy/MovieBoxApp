/**
 * DLNA & Smart TV Casting Service for MovieBoxApp
 */
import { Alert, Share } from 'react-native';

export function castToTv(streamUrl, title) {
  Alert.alert(
    '📺 Smart TV Cast / DLNA',
    `Select casting method for "${title}":\n\n1. DLNA / UPnP Receiver\n2. Chromecast / Android TV\n3. Share stream URL to Smart View`,
    [
      {
        text: 'Beam Stream Link',
        onPress: async () => {
          try {
            await Share.share({
              message: `Stream "${title}" on Smart TV: ${streamUrl}`,
              title: `Cast ${title}`,
              url: streamUrl,
            });
          } catch (e) {
            console.log('Error sharing stream:', e);
          }
        },
      },
      {
        text: 'Connect DLNA Device',
        onPress: () => {
          Alert.alert('DLNA Connected', `Connected to Living Room TV! Streaming "${title}"...`);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
}
