#!/usr/bin/env python3
from telethon.sync import TelegramClient
import sys
import asyncio

# Fix for Python 3.14+ event loop issues
try:
    asyncio.get_event_loop()
except RuntimeError:
    asyncio.set_event_loop(asyncio.new_event_loop())

# ========== CONFIGURATION ==========
# Get these from https://my.telegram.org
api_id = YOUR_API_ID  # Replace with your API ID (integer)
api_hash = 'YOUR_API_HASH'  # Replace with your API hash (string)
phone = '+1234567890'  # Replace with your phone number

# Contact mapping - Add all your contacts here
# Format: 'name': 'username' or 'name': '+phonenumber'
CONTACTS = {
    'example': 'username123',      # If they have a username
    'friend': '+1234567890',       # Or use their phone number
    # Add more contacts as needed
}
# ===================================

def send_message(contact_name, message):
    """Send a Telegram message to a contact"""
    try:
        # Create client (session file will be created in same directory)
        with TelegramClient('telegram_session', api_id, api_hash) as client:
            # Start client with phone lambda to avoid interactive prompts
            client.start(phone=lambda: phone)

            # Get contact identifier
            contact = CONTACTS.get(contact_name.lower())

            if not contact:
                print(f"❌ Error: Contact '{contact_name}' not found in CONTACTS")
                print(f"Available contacts: {', '.join(CONTACTS.keys())}")
                return False

            # Send the message
            client.send_message(contact, message)
            print(f"✅ Message sent to {contact_name}: {message}")
            return True

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        contact_name = sys.argv[1]
        message = ' '.join(sys.argv[2:])
        send_message(contact_name, message)
    else:
        print("Usage: python3 send_telegram.py <contact_name> <message>")
        print(f"Available contacts: {', '.join(CONTACTS.keys())}")
