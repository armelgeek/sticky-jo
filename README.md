# Stick Figure Video Generator

Transform your videos into minimalist stick figure animations with synchronized lip movements on a clean white background. Also includes a manual animation creator for crafting custom stick figure animations from scratch.

## Features

### Video Processing Mode
- **Easy Upload**: Drag and drop video files or browse to select (supports MP4, MOV, AVI)
- **AI-Powered Pose Detection**: Uses MediaPipe to extract body movements from video frames
- **Stick Figure Generation**: Creates simple, clean stick figure animations on white background
- **Lip Sync**: Synchronizes mouth movements with audio
- **Video Processing**: Reassembles frames with audio into final MP4 video
- **Real-time Progress**: Track processing status with live progress updates

### Manual Animation Creator (Tweencraft)
- **Interactive Canvas**: Create animations by posing a stick figure directly
- **Keyframe System**: Add, edit, and delete keyframes at any time position
- **Automatic Tweening**: Smooth interpolation between keyframes
- **Timeline Editor**: Visual timeline with drag-and-drop keyframe management
- **Playback Controls**: Preview your animation in real-time
- **Export to Video**: Render your animation as MP4 (30 FPS, 512x512)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes (Node.js runtime)
- **Video Processing**: FFmpeg for frame extraction and video assembly
- **Pose Estimation**: MediaPipe for body keypoint detection
- **Drawing**: node-canvas for stick figure rendering

## Getting Started

### Prerequisites

- Node.js 20 or higher
- FFmpeg installed on your system

#### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH

### Installation

1. Clone the repository:
```bash
git clone https://github.com/armelgeek/sticky-jo.git
cd sticky-jo
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Video Processing Mode

1. **Upload Video**: Click or drag-and-drop your video file (max 100MB)
2. **Wait for Processing**: The system will:
   - Extract frames from your video
   - Detect body poses in each frame
   - Generate stick figure animations
   - Synchronize mouth movements with audio
   - Reassemble everything into final video
3. **Preview & Download**: Watch the result and download your stick figure video

### Manual Animation Creator

1. **Access the Animator**: Click "Create Animation Manually" on the home page
2. **Add Keyframes**: Click "Add Keyframe" to create poses at different times
3. **Pose the Figure**: Drag the blue control points to position the stick figure
4. **Add More Keyframes**: Move the timeline playhead and add more keyframes
5. **Preview**: Use the play button to see your animation with automatic tweening
6. **Adjust**: Drag keyframes on the timeline to change timing
7. **Export**: Click "Export as Video" to render your animation as MP4

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── animator/
│   │   │   ├── export/      # Animation export endpoint
│   │   │   ├── status/      # Export status checking
│   │   │   └── download/    # Download rendered animation
│   │   └── video/
│   │       ├── upload/      # Video upload endpoint
│   │       ├── process/     # Start processing job
│   │       ├── status/      # Check processing status
│   │       └── download/    # Download processed video
│   ├── animator/
│   │   └── page.tsx         # Manual animation creator page
│   ├── page.tsx             # Main application page
│   └── layout.tsx           # Root layout
├── components/
│   ├── animator/
│   │   ├── AnimationCanvas.tsx  # Interactive canvas with drag controls
│   │   ├── Timeline.tsx         # Timeline with playback controls
│   │   ├── Controls.tsx         # Keyframe and duration controls
│   │   └── ExportPanel.tsx      # Export configuration
│   ├── VideoUpload.tsx          # File upload UI
│   ├── ProgressIndicator.tsx    # Processing progress
│   └── VideoPreview.tsx         # Video preview and download
└── lib/
    ├── animator/
    │   └── renderer.ts          # Animation rendering pipeline
    └── video/
        ├── ffmpeg.ts            # FFmpeg utilities
        ├── poseEstimation.ts    # MediaPipe integration
        ├── stickFigure.ts       # Stick figure drawing
        ├── audioAnalysis.ts     # Lip sync logic
        └── processor.ts         # Main processing pipeline
```

## Configuration

### Video Settings

Edit `/src/lib/video/processor.ts` to customize:

- **FPS**: Change `targetFps` (default: 10)
- **Resolution**: Modify in `stickFigure.ts` (default: 512x512)

### Upload Limits

Edit `/next.config.ts` to adjust:

- **Max file size**: Currently 100MB

## API Endpoints

### POST /api/video/upload
Upload a video file

**Request:** multipart/form-data with `video` field

**Response:**
```json
{
  "success": true,
  "fileId": "uuid",
  "filename": "uuid.mp4",
  "filepath": "/path/to/file"
}
```

### POST /api/video/process
Start processing a video

**Request:**
```json
{
  "fileId": "uuid",
  "filename": "uuid.mp4"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "uuid",
  "message": "Video processing started"
}
```

### GET /api/video/status?jobId=uuid
Get processing status

**Response:**
```json
{
  "id": "uuid",
  "status": "processing",
  "progress": 45,
  "message": "Processing frame 12/30..."
}
```

### GET /api/video/download?jobId=uuid
Download processed video (returns MP4 file)

## Limitations

- Maximum video size: 100MB
- Recommended video length: 10-30 seconds
- Processing time: ~2-5 minutes for 10-second video
- Single person pose detection only
- Simplified lip sync (rhythm-based)

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Troubleshooting

### FFmpeg not found
Ensure FFmpeg is installed and in your system PATH

### Out of memory
Reduce video length or resolution in processor settings

### Pose detection fails
Ensure person is clearly visible in video frames

## Future Improvements

- Multiple person support
- Advanced audio analysis for better lip sync
- Custom stick figure styling options
- Batch processing
- Video preview before processing
- Progress persistence across page refreshes
- More easing functions for tweening (ease-in, ease-out, bounce, etc.)
- Onion skinning in animator
- Copy/paste keyframes
- Export as GIF option
- Save/load animation projects

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
