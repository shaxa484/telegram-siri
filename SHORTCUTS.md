# Sharing Shortcuts

## Can You Share Shortcuts?

**Yes!** macOS Shortcuts can be exported and shared.

## How to Export Shortcuts

1. Open **Shortcuts** app
2. Right-click on the shortcut
3. Select **"Export..."**
4. Save as `.shortcut` file
5. Share the file (email, cloud storage, GitHub, etc.)

## How to Import Shortcuts

1. Download the `.shortcut` file
2. Double-click it
3. Click **"Add Shortcut"**
4. **IMPORTANT**: Edit the file paths in the script to match your username!

## Creating Shareable Shortcuts for This Project

### Send Telegram Message Shortcut

**Configuration:**
- Name: `Send Telegram`
- Input: Text (Shortcut Input)
- Action: Run Shell Script
  - Shell: `/bin/bash`
  - Pass Input: `as arguments`
  - Script:
  ```bash
  /Users/YOUR_USERNAME/Documents/Github/telegram-siri/telegram_sender.sh "$1"
  ```
- Siri Phrase: `Send telegram message`

### Telegram Call Shortcut

**Configuration:**
- Name: `Telegram Call`
- Input: Text (Shortcut Input)
- Action: Run Shell Script
  - Shell: `/bin/bash`
  - Pass Input: `as arguments`
  - Script:
  ```bash
  /Users/YOUR_USERNAME/Documents/Github/telegram-siri/telegram_call.sh "call $1"
  ```
- Siri Phrase: `Telegram call`

## Important Notes for Users Importing Shortcuts

⚠️ **After importing, you MUST edit the shortcuts:**

1. Open the imported shortcut in Shortcuts app
2. Click on the "Run Shell Script" action
3. Replace `YOUR_USERNAME` with your actual macOS username
4. Example:
   - Before: `/Users/YOUR_USERNAME/Documents/Github/telegram-siri/...`
   - After: `/Users/john/Documents/Github/telegram-siri/...`

## Alternative: Create Shortcuts from Scratch

If import doesn't work, follow the manual steps in README.md. It only takes 2 minutes per shortcut!

## Troubleshooting Imported Shortcuts

**Shortcut doesn't work after import?**
1. Verify the file path points to your actual username
2. Make sure scripts are executable: `chmod +x *.sh *.py`
3. Grant permissions when prompted

**"File not found" error?**
1. Check that you cloned the repo to `~/Documents/Github/telegram-siri`
2. If you used a different location, update the paths in shortcuts

**Permission denied?**
1. System Settings → Privacy & Security → Accessibility
2. Add Terminal and/or Python to allowed apps

## Tips for Sharing

If you're sharing shortcuts in the GitHub repo:
1. Create a `shortcuts/` folder
2. Export both shortcuts
3. Add clear instructions that users must edit paths
4. Include screenshots of the configuration

---

**Note**: Shortcuts are user-specific due to file paths. Always document path requirements clearly!
