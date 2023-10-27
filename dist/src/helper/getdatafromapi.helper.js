"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiData = void 0;
const axios_1 = require("axios");
const youtubeconfig_1 = require("../../config/youtubeconfig");
const getApiData = async (nextPageToken, channel_id) => {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${youtubeconfig_1.YouTubeCredentials.API_KEY}&channelId=${channel_id}&part=snippet,id&order=date&maxResults=50&pageToken=${nextPageToken}`;
    console.log(url);
    const newData = await axios_1.default.get(url);
    return newData.data;
};
exports.getApiData = getApiData;
//# sourceMappingURL=getdatafromapi.helper.js.map