#!/usr/bin/env bash
# Turns the neon Illimani artwork (glowing lines on black) into a transparent PNG.
#
#   - The mountain body (inside the outline) stays fully opaque so it hides the sun.
#   - Outside the body, black becomes transparent and the glow keeps its color
#     (brightness is moved into alpha, then the color is un-premultiplied).
#
# Requires ImageMagick 7. Usage: npm run assets:illimani
set -euo pipefail

SRC="${1:-assets-src/illimani.jpeg}"
OUT="${2:-src/assets/illimani.png}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Body mask: flood-fill the black background from the corner; what's left is the mountain.
magick "$SRC" -alpha set -fuzz 7% -fill none -draw "color 0,0 floodfill" \
  -alpha extract -morphology Erode Disk:2 -blur 0x0.8 "$TMP/body.png"

# 2. Glow alpha: brightest channel, with the near-black JPEG noise cut off.
magick "$SRC" -fx "max(r,max(g,b))" -level 4%,55% "$TMP/glow.png"

# 3. Final alpha = body OR glow.
magick "$TMP/body.png" "$TMP/glow.png" -compose Lighten -composite "$TMP/alpha.png"

# 4. Un-premultiply so semi-transparent glow keeps its full neon color.
magick "$SRC" "$TMP/alpha.png" -fx "v > 0.01 ? min(1, u / v) : 0" "$TMP/color.png"

# 5. Combine, crop to the mountain with a small margin for the glow.
mkdir -p "$(dirname "$OUT")"
magick "$TMP/color.png" \( "$TMP/alpha.png" -colorspace gray \) -alpha off -compose CopyAlpha -composite \
  -compose Over -trim +repage -bordercolor none -border 8 "PNG32:$OUT"

magick identify "$OUT"
