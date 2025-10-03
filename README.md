# Stick Figure Video Generator

Transform your videos into minimalist stick figure animations with synchronized lip movements on a clean white background.

## Features

- **Easy Upload**: Drag and drop video files or browse to select (supports MP4, MOV, AVI)
- **AI-Powered Pose Detection**: Uses MediaPipe to extract body movements from video frames
- **Stick Figure Generation**: Creates simple, clean stick figure animations on white background
- **Lip Sync**: Synchronizes mouth movements with audio
- **Video Processing**: Reassembles frames with audio into final MP4 video
- **Real-time Progress**: Track processing status with live progress updates

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

1. **Upload Video**: Click or drag-and-drop your video file (max 100MB)
2. **Wait for Processing**: The system will:
   - Extract frames from your video
   - Detect body poses in each frame
   - Generate stick figure animations
   - Synchronize mouth movements with audio
   - Reassemble everything into final video
3. **Preview & Download**: Watch the result and download your stick figure video

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── video/
│   │       ├── upload/     # Video upload endpoint
│   │       ├── process/    # Start processing job
│   │       ├── status/     # Check processing status
│   │       └── download/   # Download processed video
│   ├── page.tsx            # Main application page
│   └── layout.tsx          # Root layout
├── components/
│   ├── VideoUpload.tsx     # File upload UI
│   ├── ProgressIndicator.tsx  # Processing progress
│   └── VideoPreview.tsx    # Video preview and download
└── lib/
    └── video/
        ├── ffmpeg.ts          # FFmpeg utilities
        ├── poseEstimation.ts  # MediaPipe integration
        ├── stickFigure.ts     # Stick figure drawing
        ├── audioAnalysis.ts   # Lip sync logic
        └── processor.ts       # Main processing pipeline
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

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
