#!/usr/bin/env python3
"""
Create social preview image for webext-i18n
1280x640: dark bg, green accent, "webext-i18n", globe/language icon, "55 locales supported", Zovo logo
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Constants
WIDTH = 1280
HEIGHT = 640

# Colors
BG_COLOR = (18, 18, 22)  # Dark background
ACCENT_GREEN = (34, 197, 94)  # Bright green
ACCENT_GREEN_DARK = (22, 142, 56)  # Darker green
TEXT_WHITE = (255, 255, 255)
TEXT_GRAY = (160, 160, 160)
TEXT_DIM = (100, 100, 100)

# Font paths (using system fonts or fallback to default)
def get_font(size, bold=False):
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SF Pro Display.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                pass
    return ImageFont.load_default()

def get_font_bold(size):
    return get_font(size, bold=True)

# Create image
img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Draw geometric background pattern
# Vertical lines (subtle)
for i in range(0, WIDTH, 80):
    draw.line([(i, 0), (i, HEIGHT)], fill=(30, 30, 35), width=1)

# Horizontal lines (subtle)
for i in range(0, HEIGHT, 80):
    draw.line([(0, i), (WIDTH, i)], fill=(30, 30, 35), width=1)

# Draw accent shapes
# Left accent bar
draw.rectangle([0, 0, 8, HEIGHT], fill=ACCENT_GREEN)

# Bottom accent bar
draw.rectangle([0, HEIGHT-6, WIDTH, HEIGHT], fill=ACCENT_GREEN)

# Draw globe/language icon (simplified geometric representation)
# Circle background
cx, cy = 200, HEIGHT // 2 - 40
r = 100
draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(30, 30, 35), outline=ACCENT_GREEN, width=3)

# Globe grid lines (horizontal)
for i in range(-3, 4):
    y_offset = i * 20
    draw.arc([cx-r+10, cy-r+10, cx+r-10, cy+r-10], start=0, end=180, fill=ACCENT_GREEN_DARK, width=2)

# Vertical arc
draw.arc([cx-r+10, cy-r+10, cx+r-10, cy+r-10], start=270, end=90, fill=ACCENT_GREEN_DARK, width=2)

# Language dots/symbols
draw.ellipse([cx-30, cy-30, cx-10, cy-10], fill=ACCENT_GREEN)
draw.ellipse([cx+10, cy-30, cx+30, cy-10], fill=ACCENT_GREEN_DARK)
draw.ellipse([cx-20, cy+10, cx, cy+30], fill=ACCENT_GREEN_DARK)
draw.ellipse([cx+10, cy+10, cx+30, cy+30], fill=ACCENT_GREEN)

# Main title: "webext-i18n"
title_font = get_font_bold(72)
title = "webext-i18n"
title_bbox = draw.textbbox((0, 0), title, font=title_font)
title_width = title_bbox[2] - title_bbox[0]
draw.text((WIDTH//2 - 40, 120), title, font=title_font, fill=TEXT_WHITE)

# Subtitle line under title
subtitle_y = 205
draw.line([(WIDTH//2 - 40 - 200, subtitle_y), (WIDTH//2 - 40 + title_width + 200, subtitle_y)], fill=ACCENT_GREEN, width=2)

# Tagline
tagline_font = get_font(28)
tagline = "Chrome Extension Internationalization Toolkit"
draw.text((WIDTH//2 - 40, 240), tagline, font=tagline_font, fill=TEXT_GRAY)

# Feature pills
features = [
    "Generate",
    "Validate",
    "Extract",
    "Stats",
    "CLI + API"
]

pill_y = 340
start_x = WIDTH//2 - 40 - 150
for i, feature in enumerate(features):
    pill_width = len(feature) * 16 + 40
    x = start_x + i * (pill_width + 20)
    
    # Pill background
    draw.rounded_rectangle([x, pill_y, x + pill_width, pill_y + 50], radius=25, fill=(40, 40, 45))
    draw.rounded_rectangle([x, pill_y, x + pill_width, pill_y + 50], radius=25, outline=ACCENT_GREEN_DARK, width=1)
    
    # Pill text
    feature_font = get_font(20)
    text_bbox = draw.textbbox((0, 0), feature, font=feature_font)
    text_width = text_bbox[2] - text_bbox[0]
    draw.text((x + (pill_width - text_width)//2, pill_y + 14), feature, font=feature_font, fill=TEXT_WHITE)

# 55 locales supported - prominent display
locales_y = 440
locales_font = get_font_bold(36)
locales_text = "55 Locales Supported"
text_bbox = draw.textbbox((0, 0), locales_text, font=locales_font)
text_width = text_bbox[2] - text_bbox[0]
draw.text((WIDTH//2 - 40 - text_width//2, locales_y), locales_text, font=locales_font, fill=ACCENT_GREEN)

# Zovo branding at bottom right
zovo_y = HEIGHT - 80
zovo_font = get_font(24)
zovo_text = "Built by Zovo"
text_bbox = draw.textbbox((0, 0), zovo_text, font=zovo_font)
text_width = text_bbox[2] - text_bbox[0]
draw.text((WIDTH - text_width - 60, zovo_y), zovo_text, font=zovo_font, fill=TEXT_GRAY)

# Zovo logo (simple "Z" mark)
zovo_x = WIDTH - 60 - text_width - 30
draw.polygon([
    (zovo_x, zovo_y),
    (zovo_x + 20, zovo_y),
    (zovo_x + 20, zovo_y + 10),
    (zovo_x + 10, zovo_y + 10),
    (zovo_x + 10, zovo_y + 30),
    (zovo_x, zovo_y + 30),
], fill=ACCENT_GREEN)

# Version info
version_font = get_font(16)
version_text = "v0.1.0 • MIT License"
draw.text((60, HEIGHT - 40), version_text, font=version_font, fill=TEXT_DIM)

# Save
output_path = "/Users/mike/zovo-workspaces/a17/webext-i18n/social-preview.png"
img.save(output_path, "PNG", quality=95)
print(f"Saved to {output_path}")

# Also create the docs-social-preview.png that GitHub expects
github_output = "/Users/mike/zovo-workspaces/a17/webext-i18n/docs/social-preview.png"
os.makedirs("/Users/mike/zovo-workspaces/a17/webext-i18n/docs", exist_ok=True)
img.save(github_output, "PNG", quality=95)
print(f"Saved to {github_output}")
