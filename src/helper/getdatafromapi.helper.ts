import axios from 'axios';
import { YouTubeCredentials } from 'config/youtubeconfig';

export const getApiData = async (nextPageToken, channel_id) => {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YouTubeCredentials.API_KEY}&channelId=${channel_id}&part=snippet,id&order=date&maxResults=50&pageToken=${nextPageToken}`;
    console.log(url);
  const newData = await axios.get(
    url
  );
  return newData.data
};
