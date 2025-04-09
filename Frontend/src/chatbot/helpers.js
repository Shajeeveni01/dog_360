// src/chatbot/helpers.js
export const getYoutubeSearchUrl = (query) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  
  export const getGoogleMapsSearchUrl = (query) =>
    `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  