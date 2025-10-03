# Usage Guide - Stick Figure Video Generator

This guide will help you understand how to use the Stick Figure Video Generator effectively.

## Quick Start

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Open Your Browser**
   Navigate to http://localhost:3000

3. **Upload a Video**
   - Click the upload area or drag and drop a video file
   - Supported formats: MP4, MOV, AVI
   - Maximum size: 100MB

4. **Wait for Processing**
   The system will automatically:
   - Extract frames from your video
   - Detect body poses
   - Generate stick figures
   - Sync with audio
   - Create the final video

5. **Download Your Video**
   Once complete, preview and download your stick figure animation!

## Best Practices

### Video Requirements

For best results, your input video should:

- **Length**: 10-30 seconds (shorter is faster to process)
- **Person visibility**: Subject should be clearly visible
- **Lighting**: Good lighting helps pose detection
- **Single person**: Works best with one person in frame
- **Full body**: Person should be mostly visible from head to feet
- **Resolution**: Any resolution works, output is 512x512

### Recommended Video Characteristics

✅ **Good Videos:**
- Clear, well-lit person
- Full body visible
- Person facing camera
- Simple background
- Minimal motion blur

❌ **Challenging Videos:**
- Multiple people
- Poor lighting
- Partial body visibility
- Heavy motion blur
- Obstructed view

## Understanding the Process

### Step 1: Upload (5-10 seconds)
The video is uploaded to the server and validated.

### Step 2: Frame Extraction (10-20% progress)
FFmpeg extracts individual frames at 10 FPS.

### Step 3: Pose Detection (20-90% progress)
MediaPipe analyzes each frame to detect body keypoints:
- Head/nose position
- Shoulders, elbows, wrists
- Hips, knees, ankles

### Step 4: Stick Figure Generation (20-90% progress)
For each frame, a stick figure is drawn:
- Circle for head
- Lines connecting body joints
- Simple face features (eyes, mouth)
- Mouth animation synced with audio

### Step 5: Video Assembly (90-100% progress)
FFmpeg combines all frames with the original audio into the final MP4.

## Features

### Drag-and-Drop Upload
Simply drag your video file onto the upload area for quick uploading.

### Real-Time Progress
Watch the progress bar and status messages to see what's happening.

### Video Preview
Preview your stick figure video directly in the browser before downloading.

### Download Options
Download the processed video with a single click.

## Troubleshooting

### Upload Issues

**Problem**: "Invalid file type" error
- **Solution**: Make sure your video is MP4, MOV, or AVI format

**Problem**: "File too large" error
- **Solution**: Compress your video or trim it to under 100MB

### Processing Issues

**Problem**: "No pose detected" warnings
- **Solution**: Ensure the person is clearly visible in the video

**Problem**: Processing takes too long
- **Solution**: Use shorter videos (10-30 seconds recommended)

**Problem**: Stick figure doesn't match movements well
- **Solution**: Ensure good lighting and clear visibility of the person

### Preview/Download Issues

**Problem**: Video won't play
- **Solution**: Make sure your browser supports MP4 video playback

**Problem**: Download fails
- **Solution**: Check your browser's download permissions

## API Usage (Advanced)

If you want to integrate the API programmatically:

### 1. Upload Video

```javascript
const formData = new FormData();
formData.append('video', videoFile);

const response = await fetch('/api/video/upload', {
  method: 'POST',
  body: formData
});

const { fileId, filename } = await response.json();
```

### 2. Start Processing

```javascript
const response = await fetch('/api/video/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fileId, filename })
});

const { jobId } = await response.json();
```

### 3. Poll Status

```javascript
const checkStatus = async (jobId) => {
  const response = await fetch(`/api/video/status?jobId=${jobId}`);
  const status = await response.json();
  
  if (status.status === 'completed') {
    return status;
  } else if (status.status === 'error') {
    throw new Error(status.error);
  }
  
  // Poll again after 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));
  return checkStatus(jobId);
};

const finalStatus = await checkStatus(jobId);
```

### 4. Download Video

```javascript
window.open(`/api/video/download?jobId=${jobId}`, '_blank');
```

## Configuration

### Adjusting Processing Speed

Edit `src/lib/video/processor.ts`:

```typescript
const targetFps = 10; // Lower = faster processing, less smooth
```

### Changing Output Resolution

Edit `src/lib/video/stickFigure.ts`:

```typescript
await drawStickFigure(pose, stickFramePath, {
  width: 512,  // Change this
  height: 512, // Change this
  mouthOpen: mouthStates[i],
});
```

### Upload Size Limit

Edit `next.config.ts`:

```typescript
experimental: {
  serverActions: {
    bodySizeLimit: "100mb", // Change this
  },
}
```

## Performance Tips

1. **Video Length**: Shorter videos process much faster
2. **File Size**: Compress videos before uploading
3. **Resolution**: Lower resolution inputs process faster
4. **Server Resources**: Ensure adequate RAM (2GB+ recommended)

## Examples

### Good Use Cases

- Creating animated presentations
- Social media content
- Privacy-preserving video sharing
- Educational demonstrations
- Fun personal videos

### Sample Videos

For testing, use videos with:
- Single person doing simple movements
- Duration: 5-15 seconds
- Good lighting
- Clear background

## Need Help?

- Check the README.md for setup instructions
- Review FFMPEG_INSTALLATION.md for FFmpeg setup
- Open an issue on GitHub for bugs or feature requests

## Tips and Tricks

💡 **Tip 1**: Process shorter clips first to test
💡 **Tip 2**: Good lighting improves pose detection accuracy
💡 **Tip 3**: Keep the subject centered in frame
💡 **Tip 4**: Avoid rapid movements for smoother results
💡 **Tip 5**: The stick figure will mirror your movements!

Happy stick figure generating! 🎥✨
