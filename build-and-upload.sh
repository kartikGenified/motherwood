#!/bin/bash

# Script to build Android APK and upload to Google Drive
# Author: Auto-generated
# Usage: ./build-and-upload.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ask user for environment: production or staging
read -p "Is this a production build? (y/n): " IS_PRODUCTION
if [[ "$IS_PRODUCTION" =~ ^[Yy]$ ]]; then
    ENV_SUFFIX="production"
else
    ENV_SUFFIX="staging"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Building Android APK${NC}"
echo -e "${GREEN}========================================${NC}"

# Navigate to android directory and build
cd android
./gradlew assembleRelease

# Find the generated APK
APK_PATH=$(find app/build/outputs/apk/release -name "*.apk" | head -n 1)

if [ -z "$APK_PATH" ]; then
    echo -e "${RED}Error: APK not found!${NC}"
    exit 1
fi

echo -e "${GREEN}APK built successfully: $APK_PATH${NC}"




# Get APK filename and append environment
APK_FILENAME_ORIG=$(basename "$APK_PATH")
APK_FILENAME="${APK_FILENAME_ORIG%.apk}-$ENV_SUFFIX.apk"

echo -e "${YELLOW}APK will be uploaded as: $APK_FILENAME${NC}"

# Copy APK to new filename with environment suffix
APK_UPLOAD_PATH="app/build/outputs/apk/release/$APK_FILENAME"
cp "$APK_PATH" "$APK_UPLOAD_PATH"

# Return to project root
cd ..

# Google Drive folder configuration
# Option 1: Upload to root (leave GDRIVE_FOLDER_ID empty)
# Option 2: Upload to specific folder (set GDRIVE_FOLDER_ID)
#
# To find existing folders: gdrive files list --query "mimeType='application/vnd.google-apps.folder'"
# To create a new folder: gdrive files mkdir "APK Builds"
# Copy the folder ID from the output and paste it below
GDRIVE_FOLDER_ID="1D-erz0gPFRZ8pLEEO27fi5bZYtrvEQc2"  # Set this to your folder ID, or leave empty for root

# Upload to Google Drive
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Uploading to Google Drive${NC}"
echo -e "${GREEN}========================================${NC}"

# Check which tool is available
if command -v gdrive &> /dev/null; then
    # Using gdrive CLI
    echo "Using gdrive for upload..."
    
    if [ -n "$GDRIVE_FOLDER_ID" ]; then
        # Upload to specific folder
        echo "Uploading to folder ID: $GDRIVE_FOLDER_ID"
        UPLOAD_OUTPUT=$(gdrive files upload "android/$APK_UPLOAD_PATH" --parent "$GDRIVE_FOLDER_ID")
    else
        # Upload to root
        echo "Uploading to Google Drive root folder"
        UPLOAD_OUTPUT=$(gdrive files upload "android/$APK_UPLOAD_PATH")
    fi
    
    # Extract file ID from upload output
    FILE_ID=$(echo "$UPLOAD_OUTPUT" | grep -o '[a-zA-Z0-9_-]\{25,\}' | head -n 1)
    
    if [ -n "$FILE_ID" ]; then
        echo -e "${GREEN}Upload completed! File ID: $FILE_ID${NC}"
        
        # Create shareable link
        echo "Creating shareable link..."
        gdrive permissions share "$FILE_ID" --role reader --type anyone
        
        # Generate the shareable URL
        SHARE_LINK="https://drive.google.com/file/d/$FILE_ID/view?usp=sharing"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Shareable Link (${ENV_SUFFIX}):${NC}"
    echo -e "${YELLOW}$SHARE_LINK${NC}"
    echo -e "${GREEN}========================================${NC}"
    else
        echo -e "${YELLOW}Upload completed but couldn't extract file ID for sharing${NC}"
    fi
    
else
    echo -e "${RED}Error: gdrive CLI tool not found!${NC}"
    echo -e "${YELLOW}Please install gdrive for your operating system:${NC}"
    echo ""
    
    # Detect OS and show appropriate instructions
    if [[ "$(uname)" == "Darwin" ]]; then
        echo "macOS (using Homebrew):"
        echo "   brew install gdrive"
    elif [[ "$(expr substr $(uname -s) 1 5)" == "Linux" ]]; then
        echo "Ubuntu/Debian (Linux):"
        echo "   1. Download the binary from the gdrive GitHub releases page."
        echo "   2. Make it executable: chmod +x gdrive_linux-x64"
        echo "   3. Move it to your path: sudo mv gdrive_linux-x64 /usr/local/bin/gdrive"
    else
        echo "Could not detect OS. Please install gdrive manually."
    fi
    
    echo ""
    echo -e "${GREEN}APK is ready at: android/$APK_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Process completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
