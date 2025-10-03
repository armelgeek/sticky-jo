# FFmpeg Installation Guide

FFmpeg is required for the Stick Figure Video Generator to process videos. Follow the instructions below for your operating system.

## macOS

### Using Homebrew (Recommended)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install FFmpeg
brew install ffmpeg
```

### Verify Installation

```bash
ffmpeg -version
```

## Linux

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install ffmpeg
```

### Fedora/RHEL

```bash
sudo dnf install ffmpeg
```

### Arch Linux

```bash
sudo pacman -S ffmpeg
```

### Verify Installation

```bash
ffmpeg -version
```

## Windows

### Using Chocolatey (Recommended)

1. Install Chocolatey from https://chocolatey.org/install

2. Open PowerShell as Administrator and run:

```powershell
choco install ffmpeg
```

### Manual Installation

1. Download FFmpeg from https://www.gyan.dev/ffmpeg/builds/

2. Extract the ZIP file to a location (e.g., `C:\ffmpeg`)

3. Add FFmpeg to PATH:
   - Open System Properties → Environment Variables
   - Edit the `Path` variable under System Variables
   - Add `C:\ffmpeg\bin` (or your installation path)
   - Click OK to save

4. Restart your terminal

### Verify Installation

```powershell
ffmpeg -version
```

## Docker

If you're running the application in Docker, add FFmpeg to your Dockerfile:

```dockerfile
FROM node:20-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# ... rest of your Dockerfile
```

## Environment Variables (Optional)

You can specify custom FFmpeg paths using environment variables:

```bash
export FFMPEG_PATH=/custom/path/to/ffmpeg
export FFPROBE_PATH=/custom/path/to/ffprobe
```

Or add to your `.env.local` file:

```
FFMPEG_PATH=/custom/path/to/ffmpeg
FFPROBE_PATH=/custom/path/to/ffprobe
```

## Troubleshooting

### Command Not Found

If you get "command not found" after installation:

1. Close and reopen your terminal
2. Check if FFmpeg is in your PATH: `echo $PATH` (Unix) or `echo %PATH%` (Windows)
3. Try running with full path: `/usr/bin/ffmpeg -version`

### Permission Denied

On Linux/macOS, you may need to make FFmpeg executable:

```bash
chmod +x /path/to/ffmpeg
```

### Windows Execution Policy

If you get execution policy errors on Windows:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Version Requirements

- Minimum version: FFmpeg 4.0+
- Recommended version: FFmpeg 5.0+
- Tested with: FFmpeg 6.1.1

## Testing FFmpeg

After installation, test FFmpeg with a simple command:

```bash
ffmpeg -version
ffprobe -version
```

You should see version information and build details.

## Need Help?

If you're still having issues:

1. Check the FFmpeg official documentation: https://ffmpeg.org/documentation.html
2. Verify your system's package manager is up to date
3. Search for platform-specific installation guides
4. Open an issue in this repository with your error message and system details
