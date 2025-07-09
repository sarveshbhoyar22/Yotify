import { VideoResult, SearchSuggestion, ApiError } from '../types';

// SECURITY WARNING: Embedding API keys in client-side code is a security risk for production applications.
// For production use, implement a backend proxy to keep API keys secure.
// This frontend-only approach is for development/demonstration purposes only.
const API_KEYS = [import.meta.env.VITE_YOUTUBE_API_KEY2, import.meta.env.VITE_YOUTUBE_API_KEY3, import.meta.env.VITE_YOUTUBE_API_KEY1];

let API_KEY_INDEX = 0;

function getNextApiKey(): string | undefined {
  const apiKey = API_KEYS[API_KEY_INDEX];
  API_KEY_INDEX = (API_KEY_INDEX + 1) % API_KEYS.length;
  return apiKey;
}

let API_KEY = getNextApiKey();
if (!API_KEY) {
  console.warn('YouTube API key not found.');
}
const BASE_URL = 'https://www.googleapis.com/youtube/v3';



// Helper function to format duration from ISO 8601 to readable format
const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1]?.replace('H', '') || '0');
  const minutes = parseInt(match[2]?.replace('M', '') || '0');
  const seconds = parseInt(match[3]?.replace('S', '') || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Helper function to format view count
const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount);
  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1)}B views`;
  } else if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  return `${count} views`;
};

// Search for videos with full details
export const searchVideos = async (query: string, maxResults: number = 12): Promise<VideoResult[]> => {
  if (!API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  try {
    // First, search for videos
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
    );

    if (!searchResponse.ok) {
      API_KEY = getNextApiKey();
      if (!API_KEY) {
        throw new Error(`All API keys exhausted. Search API error: ${searchResponse.status}`);
      }
      return searchVideos(query, maxResults);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Get video IDs for detailed info
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Get detailed video information including duration and view count
    const videosResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
    );

    if (!videosResponse.ok) {
      throw new Error(`Videos API error: ${videosResponse.status}`);
    }

    const videosData = await videosResponse.json();

    // Combine search results with detailed video info
    return searchData.items.map((item: any, index: number) => {
      const videoDetails = videosData.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channel: item.snippet.channelTitle,
        duration: videoDetails ? formatDuration(videoDetails.contentDetails.duration) : 'N/A',
        views: videoDetails ? formatViewCount(videoDetails.statistics.viewCount) : 'N/A',
        publishedAt: item.snippet.publishedAt,
      };
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};

// Get search suggestions for real-time typing
export const getSearchSuggestions = async (query: string, maxResults: number = 5): Promise<SearchSuggestion[]> => {
  if (!API_KEY || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
    );

    if (!response.ok) {
      
        API_KEY = getNextApiKey();
        if (!API_KEY) {
          throw new Error(`All API keys exhausted. Search API error: ${response.status}`);
        }
        return getSearchSuggestions(query, maxResults);
      
      
    }

    const data = await response.json();
    
    return data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default?.url,
      channel: item.snippet.channelTitle,
    })) || [];
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
};

// Get trending/popular videos
export const getTrendingVideos = async (maxResults: number = 30): Promise<VideoResult[]> => {
  if (!API_KEY) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=10&maxResults=${maxResults}&key=${API_KEY}`
    );
    
    
    
    

    if (!response.ok) {
      API_KEY = getNextApiKey();
        if (!API_KEY) {
          throw new Error(`All API keys exhausted. Search API error: ${response.status}`);
        }
        return getTrendingVideos(maxResults);
      throw new Error(`Trending API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items?.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channel: item.snippet.channelTitle,
      duration: formatDuration(item.contentDetails.duration),
      views: formatViewCount(item.statistics.viewCount),
      publishedAt: item.snippet.publishedAt,
    })) || [];
  } catch (error) {
    console.error('Error getting trending videos:', error);
    return [];
  }
};

// Get related videos based on a video ID
export const getRelatedVideos = async (videoId: string, maxResults: number = 8): Promise<VideoResult[]> => {
  if (!API_KEY) {
    return [];
  }

  try {
    // Get video details first to extract relevant keywords
    const videoResponse = await fetch(
      `${BASE_URL}/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );

    if (!videoResponse.ok) {
      return getTrendingVideos(maxResults); // Fallback to trending
    }

    const videoData = await videoResponse.json();
    const video = videoData.items[0];
    
    if (!video) {
      return getTrendingVideos(maxResults);
    }

    // Use the channel name and some keywords from title for related search
    const searchQuery = `${video.snippet.channelTitle} ${video.snippet.title.split(' ').slice(0, 3).join(' ')}`;
    
    return await searchVideos(searchQuery, maxResults);
  } catch (error) {
    console.error('Error getting related videos:', error);
    return getTrendingVideos(maxResults); // Fallback to trending
  }
};