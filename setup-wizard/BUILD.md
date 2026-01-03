# Building the Setup Wizard DMG

This guide shows you how to build a DMG installer that you can share with your friends.

## Quick Build

```bash
cd setup-wizard
npm install
npm run dist:mac
```

The DMG will be created in `setup-wizard/release/Telegram Siri Setup-1.0.0.dmg`

## What Gets Built

When you run the build command, you'll get:

1. **DMG file** (`Telegram Siri Setup-1.0.0.dmg`)
   - Double-click to mount
   - Drag app to Applications folder
   - Ready to share!

2. **ZIP file** (`Telegram Siri Setup-1.0.0-mac.zip`)
   - Alternative distribution format
   - Useful for online sharing

## First Time Setup

### 1. Install Dependencies

```bash
# Make sure you have Node.js installed
node --version  # Should be 16+

# Navigate to setup-wizard directory
cd ~/telegram-siri/setup-wizard

# Install npm packages
npm install
```

### 2. (Optional) Add Custom App Icon

If you want a custom icon:

1. Create or download an `.icns` file
2. Place it at `setup-wizard/build/icon.icns`
3. Rebuild

To create an `.icns` from a PNG:
```bash
# Install iconutil (comes with Xcode)
xcode-select --install

# Create iconset folder
mkdir icon.iconset

# Add your images (16x16 to 1024x1024)
# Then convert:
iconutil -c icns icon.iconset
```

### 3. Build Production DMG

```bash
npm run dist:mac
```

This will:
- Build the React app with Vite
- Package with Electron
- Create DMG and ZIP files
- Output to `release/` directory

## Development vs Production

### Development Mode
```bash
npm run electron:dev
```
- Hot reload enabled
- DevTools open
- Faster iteration
- Not packaged

### Production Build
```bash
npm run dist:mac
```
- Minified code
- No DevTools
- Packaged as DMG
- Ready to distribute

## Distribution

### Sharing the DMG

Once built, you can share the DMG file:

1. Upload to GitHub Releases
2. Share via Google Drive / Dropbox
3. Email directly (file is ~100MB)
4. Host on your website

### Notarization (Optional)

For official distribution, you may want to notarize the app with Apple:

1. Get an Apple Developer account ($99/year)
2. Get a Developer ID certificate
3. Configure code signing in `package.json`
4. Notarize with `xcrun notarytool`

Without notarization, users will need to:
- Right-click the app
- Select "Open"
- Click "Open" in the warning dialog
- (Only needed once)

## Troubleshooting

### "electron-builder not found"

```bash
npm install --save-dev electron-builder
```

### "Cannot find module 'react'"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails with "Command failed: python"

```bash
# Install Python if needed
brew install python3
```

### DMG creation takes forever

This is normal! Building the DMG can take 2-5 minutes.

### Build succeeds but DMG won't open

Make sure you're on macOS and have enough disk space (at least 500MB free).

## Customization

### Change App Name

Edit `package.json`:
```json
{
  "name": "your-app-name",
  "productName": "Your App Display Name"
}
```

### Change Version

Edit `package.json`:
```json
{
  "version": "1.1.0"
}
```

### Add Code Signing

Edit `package.json` build section:
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAMID)"
    }
  }
}
```

## File Sizes

Approximate file sizes:
- DMG: ~100-150 MB
- ZIP: ~100-150 MB
- Installed app: ~150-200 MB

Most of the size is from Electron and Chromium.

## Clean Build

To start fresh:

```bash
# Remove all build artifacts
rm -rf dist release node_modules

# Reinstall and rebuild
npm install
npm run dist:mac
```

## Next Steps

After building:

1. Test the DMG on your Mac
2. Share with friends
3. Get feedback
4. Iterate and improve
5. Consider hosting releases on GitHub

Enjoy! 🎉
