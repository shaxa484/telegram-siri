#!/bin/bash

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Coordinate Finder for Telegram Call (Profile Method) ==="
echo ""
echo "This method avoids Siri overlay issues by opening the profile first."
echo ""
echo "Step 1: Click on HEADER to open profile"
echo "1. Open Telegram and go to any chat"
echo "2. Make sure Telegram is in WINDOWED mode (NOT fullscreen)"
echo "3. Hover your mouse over the contact NAME/PHOTO in the header"
echo "4. Press ENTER when ready..."
read

echo ""
echo "You have 3 seconds to position your mouse over the HEADER (name/photo)..."
sleep 3

# Get header click position
header_coords=$(cliclick p)
echo ""
echo "✅ Header Click Coordinates: $header_coords"
echo ""

echo "Step 2: Call button in profile"
echo "1. Click on the header NOW to open the profile"
echo "2. Once profile opens, hover over the CALL button (phone icon in profile)"
echo "3. Press ENTER when ready..."
read

echo ""
echo "You have 3 seconds to position your mouse over the CALL BUTTON in profile..."
sleep 3

# Get profile call button position
call_coords=$(cliclick p)
echo ""
echo "✅ Profile Call Button Coordinates: $call_coords"
echo ""

echo "Writing to coordinates.txt..."

cat > "$SCRIPT_DIR/coordinates.txt" <<EOF
# Telegram Call Button Coordinates (Profile Method)
# Generated on $(date)
# Make sure Telegram window is always at the same position and size!
# This method opens profile first to avoid Siri overlay

HEADER_CLICK_COORDS="$header_coords"
PROFILE_CALL_COORDS="$call_coords"
EOF

echo "✅ Coordinates saved to coordinates.txt"
echo ""
echo "Done! Now you can use: ./telegram_call.sh \"call example\""
