/**
 * API Service for MovieBoxApp
 * Curated 100% legal public-domain movies and 24/7 live IPTV streams
 */

const MOVIES_DATA = [
  {
    id: 'm1',
    title: 'Tears of Steel',
    category: 'Sci-Fi',
    rating: '8.4',
    year: '2023',
    duration: '12 min',
    description: 'In a dystopian future, a group of scientists and soldiers attempt to save the earth from colossal robotic beings in Amsterdam.',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
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
    description: 'A giant rabbit takes revenge on mischievous woodland bullies Frank, Rinky, and Gamera in glorious animated color.',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isLiveTv: false,
    quality: '4K Ultra',
  },
  {
    id: 'm3',
    title: 'Elephant\'s Dream',
    category: 'Sci-Fi',
    rating: '7.8',
    year: '2022',
    duration: '11 min',
    description: 'Proog guides young Emo through a giant surreal machine whose rules and mechanisms shift dangerously without warning.',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isLiveTv: false,
    quality: '1080p FHD',
  },
  {
    id: 'm4',
    title: 'Sintel: The Dragon Hunt',
    category: 'Fantasy',
    rating: '8.7',
    year: '2023',
    duration: '15 min',
    description: 'A lonely young woman rescues an orphaned baby dragon and embarks on a perilous quest across deserts and snowy peaks to find him.',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    isLiveTv: false,
    quality: '1080p FHD',
  },
  {
    id: 'm5',
    title: 'For Bigger Blazes',
    category: 'Action',
    rating: '8.1',
    year: '2024',
    duration: '15 min',
    description: 'High octane cinematic technology demo highlighting extreme speed racing and explosive stunts in vibrant high dynamic range.',
    banner: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1000&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isLiveTv: false,
    quality: '1080p FHD',
  }
];

const LIVE_CHANNELS_DATA = [
  {
    id: 'live_1',
    title: 'Red Bull TV Sports',
    category: 'Sports',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    isLiveTv: true,
  },
  {
    id: 'live_2',
    title: 'NASA TV Official HD',
    category: 'Science',
    logo: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    isLiveTv: true,
  },
  {
    id: 'live_3',
    title: 'France 24 English Live',
    category: 'News',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    isLiveTv: true,
  },
  {
    id: 'live_4',
    title: 'Bloomberg Markets',
    category: 'News',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://liveprodupm.global.ssl.fastly.net/us/Channel-us-fast-1/m3u8-live/live.m3u8',
    isLiveTv: true,
  },
  {
    id: 'live_5',
    title: 'Euronews HD',
    category: 'News',
    logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://euronews-euronews-world-1-us.samsung.wurl.com/manifest/playlist.m3u8',
    isLiveTv: true,
  },
  {
    id: 'live_6',
    title: 'Anime All-Day Action',
    category: 'Entertainment',
    logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://stream.ads.ottera.tv/playlist.m3u8?network_id=2081',
    isLiveTv: true,
  },
  {
    id: 'live_7',
    title: 'Classic Cinema Retro',
    category: 'Movies',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://d2e1asnsl7br7b.cloudfront.net/7782/master.m3u8',
    isLiveTv: true,
  },
  {
    id: 'live_8',
    title: 'Lofi Chill Vibes Music',
    category: 'Entertainment',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    isLiveTv: true,
  }
];

export function fetchTrendingMovies() {
  return MOVIES_DATA;
}

export function fetchLiveChannels() {
  return LIVE_CHANNELS_DATA;
}

export function searchContent(query) {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase();

  const matchedMovies = MOVIES_DATA.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
  );

  const matchedChannels = LIVE_CHANNELS_DATA.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );

  return [...matchedMovies, ...matchedChannels];
}
