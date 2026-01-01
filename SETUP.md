# Quick Setup Guide

## 1. Install Dependencies (5 minutes)

```bash
# Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install cliclick
brew install cliclick

# Clone to home directory (avoids permission issues)
cd ~
git clone https://github.com/shaxa484/telegram-siri.git

# Set up Python environment
cd ~/telegram-siri
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Get Telegram API Credentials (3 minutes)

1. Visit: https://my.telegram.org
2. Login with your phone
3. Go to "API development tools"
4. Create new app (any name works)
5. **Copy `api_id` and `api_hash`**

## 3. Configure Scripts (2 minutes)

### Edit `send_telegram.py` (line 13-15):

```python
api_id = 12345678  # Your API ID
api_hash = 'abcdef1234567890'  # Your API hash
phone = '+1234567890'  # Your phone number
```

### Add contacts in `send_telegram.py` (line 20-25):

```python
CONTACTS = {
    'john': 'john_username',
    'mom': '+1987654321',
}
```

### Add same contacts in `telegram_call.sh` (line 5-15):

```bash
get_username() {
    case "$1" in
        "john")
            echo "john_username"
            ;;
        "mom")
            echo "+1987654321"
            ;;
        *)
            echo ""
            ;;
    esac
}
```

## 4. First Login (1 minute)

```bash
source venv/bin/activate
python3 send_telegram.py john "test"
# Enter the code sent to your Telegram app
```

## 5. Calibrate Call Button (2 minutes)

```bash
# Open Telegram in windowed mode (NOT fullscreen!)
./find_coordinates.sh
# Step 1: Hover over contact NAME in header → Press Enter
# Step 2: Click header to open profile, hover over CALL button → Press Enter
```

**Why two steps?** This avoids Siri overlay blocking the call button. The script opens the profile first, where the call button won't be covered.

## 6. Test Commands

```bash
# Test message
./telegram_sender.sh "john hello"

# Test call
./telegram_call.sh "call john"
```

## 7. Set Up Siri Shortcuts

### Shortcut 1: "Send Telegram"

1. Open Shortcuts app → New Shortcut
2. Add **Text** → `Shortcut Input`
3. Add **Run Shell Script**:
   ```bash
   /Users/YOUR_USERNAME/telegram-siri/telegram_sender.sh "$1"
   ```
4. Add to Siri: "Send telegram"

### Shortcut 2: "Telegram Call"

1. New Shortcut
2. Add **Text** → `Shortcut Input`
3. Add **Run Shell Script**:
   ```bash
   /Users/YOUR_USERNAME/telegram-siri/telegram_call.sh "call $1"
   ```
4. Add to Siri: "Telegram call"

## 8. Use with Siri!

- "Hey Siri, send telegram, john what's up"
- "Hey Siri, telegram call, john"

## Troubleshooting

**Permission errors?**
→ System Settings → Privacy → Accessibility → Add Terminal

**Calls not working?**
→ Make sure Telegram is windowed (not fullscreen)
→ Re-run `./find_coordinates.sh` (both steps: header + profile call button)
→ Grant Accessibility permissions to Terminal and Shortcuts
→ Keep Telegram window at same position/size

**Module not found?**
→ `source venv/bin/activate && pip install telethon`

Done! 🎉
