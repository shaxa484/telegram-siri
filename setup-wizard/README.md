# Telegram Siri Setup Wizard

A beautiful, interactive setup wizard for the Telegram Siri Integration project. Built with Electron, React, and Framer Motion.

## Features

- ✨ Beautiful, modern UI with smooth animations
- 📋 One-click copy buttons for all commands
- ✅ Built-in validation checks for installations
- 💾 Progress persistence (auto-saves your setup progress)
- 🎨 Premium design with gradients and glass morphism
- 📱 Native macOS app experience

## Development

### Prerequisites

- Node.js 16+ and npm
- macOS (for building DMG)

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

```bash
npm run electron:dev
```

This will start both Vite (for hot reloading the React app) and Electron.

## Building

### Build for Production

To create a DMG installer for macOS:

```bash
npm run dist:mac
```

The built app will be in the `release/` directory:
- `Telegram Siri Setup-1.0.0.dmg` - DMG installer
- `Telegram Siri Setup-1.0.0-mac.zip` - ZIP archive

### Build Configuration

The build settings are configured in `package.json` under the `"build"` section. You can customize:

- App icon (place `icon.icns` in `build/` directory)
- App ID and name
- DMG appearance
- Code signing (if you have a developer certificate)

## Project Structure

```
setup-wizard/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script (IPC bridge)
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Styles
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── build/               # Build assets (icons, etc.)
├── dist/                # Built web assets (generated)
├── release/             # Final packaged apps (generated)
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts

```

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build React app for production
- `npm run electron` - Run Electron (requires built app)
- `npm run electron:dev` - Run in development mode (recommended)
- `npm run dist` - Build for all platforms
- `npm run dist:mac` - Build DMG for macOS

## Technologies Used

- **Electron** - Desktop app framework
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **electron-builder** - App packaging

## Customization

### Change Colors

Edit the gradients and colors in `src/App.css`:

```css
/* Primary gradient */
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);

/* Background gradient */
background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
```

### Add App Icon

1. Create an `.icns` file (macOS icon format)
2. Place it in `build/icon.icns`
3. Rebuild the app

### Modify Steps

Edit the `steps` array and `StepContent` component in `src/App.jsx` to add, remove, or modify setup steps.

## Troubleshooting

### App won't start in dev mode

Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails

Ensure you're on macOS and have Xcode Command Line Tools installed:
```bash
xcode-select --install
```

### DMG creation errors

Make sure you have enough disk space and permissions. Try cleaning the build cache:
```bash
rm -rf release dist
npm run dist:mac
```

## License

MIT License - Same as parent project

## Credits

Built for the [Telegram Siri Integration](https://github.com/shaxa484/telegram-siri) project.
