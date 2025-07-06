// import { VideoResult } from '../types';

// export const mockSearchResults: VideoResult[] = [
//   {
//     id: 'dQw4w9WgXcQ',
//     title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
//     thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
//     channel: 'Rick Astley',
//     duration: '3:33',
//     views: '1.4B views',
//   },
//   {
//     id: 'kJQP7kiw5Fk',
//     title: 'Despacito - Luis Fonsi ft. Daddy Yankee',
//     thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
//     channel: 'Luis Fonsi',
//     duration: '4:41',
//     views: '8.1B views',
//   },
//   {
//     id: '9bZkp7q19f0',
//     title: 'PSY - GANGNAM STYLE(강남스타일) M/V',
//     thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
//     channel: 'officialpsy',
//     duration: '4:12',
//     views: '4.9B views',
//   },
//   {
//     id: 'fJ9rUzIMcZQ',
//     title: 'Queen - Bohemian Rhapsody (Official Music Video)',
//     thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
//     channel: 'Queen Official',
//     duration: '5:55',
//     views: '1.9B views',
//   },
//   {
//     id: 'JGwWNGJdvx8',
//     title: 'Ed Sheeran - Shape of You (Official Music Video)',
//     thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
//     channel: 'Ed Sheeran',
//     duration: '3:53',
//     views: '6.0B views',
//   },
//   {
//     id: 'hT_nvWreIhg',
//     title: 'The Weeknd - Blinding Lights (Official Music Video)',
//     thumbnail: 'https://img.youtube.com/vi/hT_nvWreIhg/maxresdefault.jpg',
//     channel: 'The Weeknd',
//     duration: '4:20',
//     views: '903M views',
//   },
// ];

// export const mockRecommendations: VideoResult[] = [
//   {
//     id: 'L_jWHffIx5E',
//     title: 'The Weeknd - Save Your Tears (Official Music Video)',
//     thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg',
//     channel: 'The Weeknd',
//     duration: '3:35',
//     views: '445M views',
//   },
//   {
//     id: 'SlPhMPnQ58k',
//     title: 'Dua Lipa - Levitating (Official Music Video)',
//     thumbnail: 'https://img.youtube.com/vi/SlPhMPnQ58k/maxresdefault.jpg',
//     channel: 'Dua Lipa',
//     duration: '3:23',
//     views: '892M views',
//   },
//   {
//     id: 'YQHsXMglC9A',
//     title: 'Adele - Hello (Official Music Video)',
//     thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg',
//     channel: 'Adele',
//     duration: '6:07',
//     views: '3.2B views',
//   },
//   {
//     id: 'RgKAFK5djSk',
//     title: 'Wiz Khalifa - See You Again ft. Charlie Puth [Official Video]',
//     thumbnail: 'https://img.youtube.com/vi/RgKAFK5djSk/maxresdefault.jpg',
//     channel: 'Wiz Khalifa',
//     duration: '3:57',
//     views: '5.9B views',
//   },
// ];

// export const getRandomResults = (query: string): VideoResult[] => {
//   // Simulate API delay
//   const shuffled = [...mockSearchResults].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, Math.floor(Math.random() * 4) + 3);
// };

// export const getRecommendations = (searchQuery?: string): VideoResult[] => {
//   // In a real app, this would be based on user preferences and search history
//   return mockRecommendations.slice(0, 4);
// };