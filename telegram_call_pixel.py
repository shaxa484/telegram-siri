#!/usr/bin/env python3
import sys
import time
import subprocess
import os

# Contact mapping - Must match telegram_call.sh
CONTACTS = {
    'example': 'username123',
    'friend': 'friend_username',
    # Add your contacts here
}

# Coordinates for opening profile and calling
HEADER_CLICK_COORDS = None
PROFILE_CALL_COORDS = None

def load_coordinates():
    """Load button coordinates from file"""
    global HEADER_CLICK_COORDS, PROFILE_CALL_COORDS

    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    coord_file = os.path.join(script_dir, "coordinates.txt")

    if not os.path.exists(coord_file):
        print("❌ Coordinates file not found!")
        print("   Run: ./find_coordinates.sh first to map button positions")
        return False

    try:
        with open(coord_file, 'r') as f:
            for line in f:
                if line.startswith('HEADER_CLICK_COORDS='):
                    HEADER_CLICK_COORDS = line.split('=')[1].strip().strip('"')
                elif line.startswith('PROFILE_CALL_COORDS='):
                    PROFILE_CALL_COORDS = line.split('=')[1].strip().strip('"')

        if HEADER_CLICK_COORDS and PROFILE_CALL_COORDS:
            print(f"📍 Loaded coordinates:")
            print(f"   Header click: {HEADER_CLICK_COORDS}")
            print(f"   Profile call button: {PROFILE_CALL_COORDS}")
            return True
        else:
            print("❌ Missing coordinates in file")
            print("   Run: ./find_coordinates.sh to calibrate both positions")
            return False

    except Exception as e:
        print(f"❌ Error loading coordinates: {e}")
        return False

def click_call_button(contact_name):
    """Open Telegram profile and click call button"""

    if not load_coordinates():
        return False

    contact = CONTACTS.get(contact_name.lower())
    if not contact:
        print(f"❌ Error: Contact '{contact_name}' not found")
        return False

    # Open Telegram chat
    telegram_url = f"tg://resolve?domain={contact}"
    subprocess.run(['open', telegram_url])

    print(f"📞 Opening chat with {contact_name}...")

    # Wait for Telegram to open and chat to load
    time.sleep(2)

    # Activate Telegram window
    subprocess.run([
        'osascript', '-e',
        'tell application "Telegram" to activate'
    ])

    time.sleep(0.5)

    # Click on header to open profile using cliclick via AppleScript
    # This approach avoids Siri overlay issues
    print(f"🖱️  Clicking header to open profile at {HEADER_CLICK_COORDS}...")

    applescript = f'''
    do shell script "/opt/homebrew/bin/cliclick c:{HEADER_CLICK_COORDS}"
    '''

    result = subprocess.run(
        ['osascript', '-e', applescript],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(f"⚠️  Header click may have failed: {result.stderr}")
        # Try to continue anyway

    # Wait for profile to open
    print("⏳ Waiting for profile to open...")
    time.sleep(1.5)

    # Click the call button in profile
    print(f"🖱️  Clicking call button in profile at {PROFILE_CALL_COORDS}...")

    applescript = f'''
    do shell script "/opt/homebrew/bin/cliclick c:{PROFILE_CALL_COORDS}"
    '''

    result = subprocess.run(
        ['osascript', '-e', applescript],
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        print(f"✅ Call button clicked! Call should be initiating...")
        return True
    else:
        print(f"⚠️  Call click may have failed: {result.stderr}")
        print("   Try running ./find_coordinates.sh again if button position changed")
        return False

if __name__ == '__main__':
    if len(sys.argv) >= 2:
        contact = sys.argv[1]
        click_call_button(contact)
    else:
        print("Usage: python3 telegram_call_pixel.py <contact>")
        print(f"Available contacts: {', '.join(CONTACTS.keys())}")
        print("\nNote: Run ./find_coordinates.sh first to set up button position")
