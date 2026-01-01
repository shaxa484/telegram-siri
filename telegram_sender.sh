#!/bin/bash

# Change to script directory
cd "$(dirname "$0")" || exit 1

# Path to your Python script
SCRIPT_PATH="$(pwd)/send_telegram.py"

# Get the full input from Siri
full_input="$1"

# Parse the input
# Expected format: "send john hello there"
# or just: "john hello there"

# Remove "send" if it exists (case-insensitive)
clean_input=$(echo "$full_input" | sed -E 's/^send //I')

# Extract contact name (first word)
contact_name=$(echo "$clean_input" | awk '{print tolower($1)}')

# Extract message (everything after first word)
message=$(echo "$clean_input" | cut -d' ' -f2-)

# Run the Python script with venv Python
"$(pwd)/venv/bin/python3" "$SCRIPT_PATH" "$contact_name" "$message" 2>&1
