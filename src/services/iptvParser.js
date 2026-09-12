/**
 * IPTV M3U / M3U8 Playlist Parser for MovieBoxApp
 */

export async function parseM3U(source) {
  try {
    let content = source;
    // If source is a URL, fetch the text
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to load playlist: HTTP ${response.status}`);
      }
      content = await response.text();
    }

    const lines = content.split(/\r?\n/);
    const channels = [];
    let currentChannel = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('#EXTINF:')) {
        currentChannel = {};

        // Extract ID
        const idMatch = line.match(/tvg-id="([^"]*)"/i);
        currentChannel.id = idMatch ? idMatch[1] : `chan_${channels.length + 1}_${Date.now()}`;

        // Extract Title
        const nameMatch = line.match(/tvg-name="([^"]*)"/i);
        if (nameMatch) {
          currentChannel.title = nameMatch[1];
        }

        // Extract Logo
        const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
        currentChannel.logo = logoMatch ? logoMatch[1] : 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=300';

        // Extract Category
        const groupMatch = line.match(/group-title="([^"]*)"/i);
        currentChannel.category = groupMatch ? groupMatch[1] : 'Entertainment';

        // Fallback for title from comma
        const commaIndex = line.lastIndexOf(',');
        if (commaIndex !== -1 && !currentChannel.title) {
          currentChannel.title = line.substring(commaIndex + 1).trim();
        }

        if (!currentChannel.title) {
          currentChannel.title = `Channel ${channels.length + 1}`;
        }
      } else if (line.startsWith('http://') || line.startsWith('https://')) {
        if (currentChannel) {
          currentChannel.streamUrl = line;
          currentChannel.id = currentChannel.id || `chan_${channels.length + 1}`;
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
