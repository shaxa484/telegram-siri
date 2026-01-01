#!/bin/bash

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Coordinate Finder for Telegram Call Button ==="
echo ""
echo "Instructions:"
echo "1. Open Telegram and go to a chat"
echo "2. Make sure Telegram is in WINDOWED mode (NOT fullscreen)"
echo "3. Hover your mouse over the VOICE CALL button (phone icon in header)"
echo "4. Press ENTER when ready..."
read

echo ""
echo "You have 3 seconds to position your mouse over the VOICE CALL button..."
sleep 3

# Get current mouse position
coords=$(cliclick p)
echo ""
echo "✅ Voice Call Button Coordinates: $coords"
echo ""

echo "Writing to coordinates.txt..."

cat > "$SCRIPT_DIR/coordinates.txt" <<EOF
# Telegram Voice Call Button Coordinates
# Generated on $(date)
# Make sure Telegram window is always at the same position and size!

VOICE_CALL_COORDS="$coords"
EOF

echo "✅ Coordinates saved to coordinates.txt"
echo ""
echo "Done! Now you can use: ./telegram_call.sh \"call example\""
