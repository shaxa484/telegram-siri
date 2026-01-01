#!/bin/bash

# Function to get username from contact name
get_username() {
    case "$1" in
        "example")
            echo "username123"
            ;;
        "friend")
            echo "friend_username"
            ;;
        # Add your contacts here following the same pattern
        *)
            echo ""
            ;;
    esac
}

# Get input from Siri
full_input="$1"

# Convert to lowercase and remove "call" keyword
input_lower=$(echo "$full_input" | tr '[:upper:]' '[:lower:]')
clean_input=$(echo "$input_lower" | sed -E 's/call//g' | xargs)

# Get contact username
contact_name="$clean_input"
username=$(get_username "$contact_name")

if [ -z "$username" ]; then
    echo "❌ Error: Contact '$contact_name' not found"
    echo "Available contacts: example, friend"
    echo "Edit telegram_call.sh to add more contacts"
    exit 1
fi

# Change to script directory
cd "$(dirname "$0")" || exit 1

# Use pixel-based clicking with cliclick for voice call
"$(pwd)/venv/bin/python3" "$(pwd)/telegram_call_pixel.py" "$contact_name"

exit 0
