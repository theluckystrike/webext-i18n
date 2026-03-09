#!/usr/bin/env python3
"""Generate social preview image for webext-i18n"""

from PIL import Image, ImageDraw, ImageFont
import math

# Canvas size
W, H = 1280, 640

# Colors - Dark background with green accent
BG_COLOR = (10, 12, 15)  # Very dark blue-black
ACCENT_COLOR = (46, 204, 113)  # Zovo green
TEXT_COLOR = (255, 255, 255)
SUBTEXT_COLOR = (180, 180, 180)

def create_social_preview():
    # Create canvas
    img = Image.new('RGB', (W, H), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Load fonts (use default if unavailable)
    try:
        # Try to load a nice font, fallback to default
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
        small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Draw decorative grid pattern (subtle)
    grid_spacing = 40
    for i in range(0, W, grid_spacing):
        draw.line([(i, 0), (i, H)], fill=(25, 30, 38), width=1)
    for j in range(0, H, grid_spacing):
        draw.line([(0, j), (W, j)], fill=(25, 30, 38), width=1)
    
    # Draw geometric accent shapes
    # Large circle in top right
    cx, cy = W - 200, 150
    r = 120
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=ACCENT_COLOR, width=3)
    draw.ellipse([cx-r+20, cy-r+20, cx+r-20, cy+r-20], outline=ACCENT_COLOR, width=2)
    
    # Small accent dots
    draw.ellipse([100, 100, 120, 120], fill=ACCENT_COLOR)
    draw.ellipse([150, 150, 165, 165], fill=ACCENT_COLOR)
    
    # Globe/language icon representation
    # Draw multiple concentric circles to simulate globe
    globe_cx, globe_cy = W // 2 - 100, H // 2
    globe_r = 100
    
    # Outer circle
    draw.ellipse([globe_cx-globe_r, globe_cy-globe_r, globe_cx+globe_r, globe_cy+globe_r], 
                 outline=ACCENT_COLOR, width=4)
    
    # Horizontal line (equator)
    draw.line([(globe_cx-globe_r, globe_cy), (globe_cx+globe_r, globe_cy)], fill=ACCENT_COLOR, width=2)
    
    # Vertical line (meridian)
    draw.line([(globe_cx, globe_cy-globe_r), (globe_cx, globe_cy+globe_r)], fill=ACCENT_COLOR, width=2)
    
    # Curved longitude lines
    for offset in [-50, 0, 50]:
        draw.arc([globe_cx-60+offset, globe_cy-80, globe_cx+60+offset, globe_cy+80], 
                 start=0, end=180, fill=ACCENT_COLOR, width=2)
    
    # Curved latitude lines
    for offset in [-50, 50]:
        draw.arc([globe_cx-80, globe_cy-60+offset, globe_cx+80, globe_cy+60+offset], 
                 start=90, end=270, fill=ACCENT_COLOR, width=2)
    
    # Draw the main title "webext-i18n"
    title = "webext-i18n"
    # Calculate text position
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = bbox[2] - bbox[0]
    title_h = bbox[3] - bbox[1]
    title_x = W // 2 + 50
    title_y = H // 2 - 60
    
    # Draw title with slight shadow for depth
    shadow_offset = 4
    draw.text((title_x + shadow_offset, title_y + shadow_offset), title, font=title_font, fill=(30, 35, 40))
    draw.text((title_x, title_y), title, font=title_font, fill=TEXT_COLOR)
    
    # Draw subtitle "55 locales supported"
    subtitle = "55 locales supported"
    bbox_sub = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    sub_w = bbox_sub[2] - bbox_sub[0]
    sub_x = title_x + (title_w - sub_w) // 2
    sub_y = title_y + title_h + 20
    draw.text((sub_x, sub_y), subtitle, font=subtitle_font, fill=ACCENT_COLOR)
    
    # Draw bottom bar with Zovo branding
    bar_height = 60
    bar_y = H - bar_height
    
    # Subtle gradient bar background
    draw.rectangle([0, bar_y, W, H], fill=(15, 18, 22))
    draw.line([0, bar_y, W, bar_y], fill=ACCENT_COLOR, width=2)
    
    # "Built by Zovo" text
    zovo_text = "Built by Zovo"
    bbox_zovo = draw.textbbox((0, 0), zovo_text, font=subtitle_font)
    zovo_w = bbox_zovo[2] - bbox_zovo[0]
    draw.text((40, bar_y + 15), zovo_text, font=subtitle_font, fill=SUBTEXT_COLOR)
    
    # Zovo logo (simple geometric representation)
    logo_x = W - 100
    logo_y = bar_y + 10
    # Draw a stylized "Z" logo
    draw.polygon([(logo_x, logo_y), (logo_x + 40, logo_y), (logo_x + 40, logo_y + 15),
                  (logo_x + 15, logo_y + 15), (logo_x + 15, logo_y + 40), (logo_x, logo_y + 40)],
                 fill=ACCENT_COLOR)
    
    # Save the image
    img.save("social-preview.png", "PNG", quality=95)
    print("Social preview created: social-preview.png")

if __name__ == "__main__":
    create_social_preview()
