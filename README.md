# Telegram Siri Integration for macOS 🤖📱

Control Telegram with Siri on macOS! Send messages and make voice calls using voice commands.

## Features

- 📨 **Send Messages**: "Hey Siri, send telegram message, John hello there"
- 📞 **Voice Calls**: "Hey Siri, telegram call, John"
- 🚀 **Fully Automated**: No manual clicking needed for calls
- 🎯 **Contact Shortcuts**: Easy contact name mapping

## Prerequisites

- **macOS** (Tested on macOS Ventura and later)
- **Python 3.8+** (comes with macOS)
- **Telegram Desktop** app installed
- **Homebrew** (for installing dependencies)
- **Telegram API credentials** (free from https://my.telegram.org)

## Installation

### 1. Clone the Repository

**Important:** Clone to your home directory to avoid macOS permission issues with nested folders.

```bash
cd ~
git clone https://github.com/shaxa484/telegram-siri.git
cd telegram-siri
```

**Why home directory?** macOS applies stricter permissions to folders like `Documents/` which can cause "operation not permitted" errors with Shortcuts and automation.

### 2. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3. Install cliclick (for automated clicking)

```bash
brew install cliclick
```

### 4. Set Up Python Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install telethon
```

### 5. Get Telegram API Credentials

1. Go to https://my.telegram.org
2. Log in with your phone number
3. Click on "API development tools"
4. Create a new application (you can use any name)
5. Copy your `api_id` and `api_hash`

### 6. Configure the Script

Edit `send_telegram.py` and replace the placeholder values:

```python
api_id = YOUR_API_ID  # Replace with your API ID (number, no quotes)
api_hash = 'YOUR_API_HASH'  # Replace with your API hash (keep quotes)
phone = '+1234567890'  # Replace with your phone number (international format)
```

### 7. Add Your Contacts

Edit both `send_telegram.py` and `telegram_call.sh` to add your contacts:

**In `send_telegram.py`:**
```python
CONTACTS = {
    'john': 'john_telegram_username', # No need to add '@' symbol before usernames
    'mom': '+1234567890',  # Can use phone numbers too
    'friend': 'friend_username',
}
```

**In `telegram_call.sh`:**
```bash
get_username() {
    case "$1" in
        "john")
            echo "john_telegram_username"
            ;;
        "mom")
            echo "+1234567890"
            ;;
        # Add more contacts here
        *)
            echo ""
            ;;
    esac
}
```

### 8. First-Time Login

Run the message script once to log in to Telegram:

```bash
cd ~/Documents/Github/telegram-siri
source venv/bin/activate
python3 send_telegram.py john "test message"
```

You'll be prompted to:
1. Enter the code sent to your Telegram app
2. Optionally enter your 2FA password (if enabled)

This creates a `telegram_session.session` file that remembers your login.

### 9. Calibrate Call Button Position

**IMPORTANT**: Telegram must be in **windowed mode**, NOT fullscreen!

1. Open Telegram Desktop
2. Resize it to your preferred window size
3. Open any chat
4. Run the calibration script:

```bash
./find_coordinates.sh
```

5. When prompted, hover your mouse over the **phone icon** (call button) in the chat header
6. Press Enter - the coordinates will be saved

**Note**: If you resize/move Telegram window, you'll need to recalibrate!

## Usage

### Send Messages

```bash
./telegram_sender.sh "john hello there"
```

### Make Voice Calls

```bash
./telegram_call.sh "call john"
```

## Siri Integration with Shortcuts

### Option 1: Create Shortcuts Manually

#### Shortcut 1: Send Telegram Message

1. Open **Shortcuts** app
2. Click **+** (New Shortcut)
3. Add **Text** action → Set to `Shortcut Input`
4. Add **Run Shell Script** action:
   - Shell: `/bin/bash`
   - Pass Input: `as arguments`
   - Script:
   ```bash
   /Users/YOUR_USERNAME/telegram-siri/telegram_sender.sh "$1"
   ```
5. Name it "Send Telegram"
6. Click ⓘ → Add to Siri: "Send telegram message"

#### Shortcut 2: Telegram Call

1. Create new shortcut
2. Add **Text** action → Set to `Shortcut Input`
3. Add **Run Shell Script** action:
   - Shell: `/bin/bash`
   - Pass Input: `as arguments`
   - Script:
   ```bash
   /Users/YOUR_USERNAME/telegram-siri/telegram_call.sh "call $1"
   ```
4. Name it "Telegram Call"
5. Click ⓘ → Add to Siri: "Telegram call"

### Option 2: Import Shortcuts (if shared)

If someone shares `.shortcut` files:
1. Double-click the `.shortcut` file
2. Click "Add Shortcut"
3. Edit the file paths to match your username

### Grant Permissions

When you first run shortcuts via Siri, you may need to grant permissions:

1. **Accessibility**: System Settings → Privacy & Security → Accessibility → Enable Terminal/Python
2. **Files and Folders**: Allow Shortcuts to access your Documents folder

## Siri Commands

Once shortcuts are set up:

- **Send message**: "Hey Siri, send telegram message, john what's up"
- **Voice call**: "Hey Siri, telegram call, john"

## Troubleshooting

### "Operation not permitted" error
- Grant Accessibility permissions to Terminal/Python in System Settings
- **If you cloned to `Documents/` or other nested folders**: Move the entire `telegram-siri` folder to your home directory (`~/telegram-siri`) to avoid macOS permission restrictions
- Update the paths in your Shortcuts after moving

### Calls not working
- Make sure Telegram is in **filled windowed mode** (not fullscreen!)
- Recalibrate by running `./find_coordinates.sh`
- Keep Telegram window at the same position and size

### "Module not found: telethon"
```bash
cd ~/telegram-siri
source venv/bin/activate
pip install telethon
```

### Session expired
- Delete `telegram_session.session`
- Run `python3 send_telegram.py john "test"` to log in again

### Wrong contact
- Check that contact names in `CONTACTS` dictionary match Telegram usernames exactly no need to add '@' to username
- Use international phone format: `+1234567890`

## File Structure

```
telegram-siri/
├── send_telegram.py          # Message sending logic
├── telegram_sender.sh         # Message shell wrapper
├── telegram_call.sh           # Call shell wrapper
├── telegram_call_pixel.py     # Automated call clicking
├── find_coordinates.sh        # Button calibration tool
├── coordinates.txt            # Saved button position
├── telegram_session.session   # Your login session
└── venv/                      # Python dependencies
```

## Important Notes

- **Privacy**: Never commit `telegram_session.session` or files with API credentials to GitHub
- **Installation Location**: Always install to home directory (`~/telegram-siri`) to avoid macOS permission issues with nested folders like `Documents/`
- **Window Position**: Keep Telegram window consistent for calls to work
- **Telegram Mode**: Must use filled window mode, NOT fullscreen
- **Session File**: The `.session` file keeps you logged in - don't delete it

## Security

- Keep your `api_id` and `api_hash` private
- Don't share your `telegram_session.session` file

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT License - feel free to use and modify!

## Credits

Built with [Telethon](https://github.com/LonamiWebs/Telethon) - Python Telegram client library

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Make sure all prerequisites are installed
3. Verify Telegram API credentials are correct
4. Open an issue on GitHub with error details

---

**Enjoy controlling Telegram with your voice! 🎉**
