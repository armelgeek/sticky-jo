/**
 * FFmpeg configuration
 * Sets the path to FFmpeg binary
 */

import ffmpeg from "fluent-ffmpeg";

// Set FFmpeg path (auto-detect or use environment variable)
const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
const ffprobePath = process.env.FFPROBE_PATH || "ffprobe";

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export default ffmpeg;
