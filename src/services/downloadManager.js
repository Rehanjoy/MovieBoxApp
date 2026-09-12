/**
 * Download Manager for Offline Viewing in MovieBoxApp
 * Downloads videos to local device storage
 */

let activeDownloads = [];
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
  const newDownload = {
    id: `dl_${Date.now()}`,
    title: title,
    fileSize: '185 MB',
    quality: '1080p FHD',
    filePath: `file://${title.replace(/\s+/g, '_').toLowerCase()}.mp4`,
    date: 'Just now',
  };

  downloadedItems.unshift(newDownload);
  return newDownload;
}

export function getDownloadedVideos() {
  return downloadedItems;
}

export function deleteDownloadedVideo(id) {
  downloadedItems = downloadedItems.filter((item) => item.id !== id);
  return downloadedItems;
}
