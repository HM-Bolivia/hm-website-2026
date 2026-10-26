# Hackmeeting 0x7EA: color palette

Visual identity: an **80s neon (synthwave) night in the Andes**. A very dark navy base and a blue neon grid, with **amber** mountains echoing the Illimani's sunset. The page adds **magenta**, **cyan** and **yellow** accents. The neon look comes from bright colors on dark backgrounds plus a glow; it does not work on light backgrounds.

> **Try alternatives live:** open the site with `?palette` at the end of the URL (for example `https://<site>/?palette`). A panel lets you change every color, compare preset palettes, and copy a link to share your proposal.

> Source of truth: the website code. Page colors are in `src/styles/main.css` (`:root`), and the 3D background colors in `src/background/config.js` (`palette`). If you change a color there, update this document too.

## Neon accents

| Name | HEX | RGB | Where it's used |
|---|---|---|---|
| **Neon Magenta** | `#FF1493` | 255, 20, 147 | Main page accent. Glow on the "HACKMEETING 0x7EA" title, subheadings, panel borders, secondary buttons |
| **Neon Cyan** | `#00F0FF` | 0, 240, 255 | Second accent. Primary buttons, links, topic tags, dates and venue highlights |
| **Laser Amber** | `#FF9E00` | 255, 158, 0 | Wireframe mountains |
| **Neon Yellow** | `#FFE45C` | 255, 228, 92 | Highlight, used sparingly. Section titles, the year "(2026)" |
| **Electric Blue** | `#0088FF` | 0, 136, 255 | Floor grid |
| **Deep Electric Blue** | `#0070F3` | 0, 112, 243 | Sky grid (semi-transparent over the sky) |

## Backgrounds (darks)

| Name | HEX | RGB | Where it's used |
|---|---|---|---|
| **Void Base** | `#080E1A` | 8, 14, 26 | Main background, top of the sky, floor between the grid lines, button backgrounds |
| **Deep Blue** | `#033159` | 3, 49, 89 | Glow at the horizon (bottom of the sky gradient), fill of the wireframe mountains |
| **Andean Night** | `#022340` | 2, 35, 64 | Fog and distance haze |
| **Panel** | `#0A0218` at 78% opacity | 10, 2, 24 | Content panels over the scene (with a light blur) |

## Text

| Name | HEX | RGB | Where it's used |
|---|---|---|---|
| **White** | `#FFFFFF` | 255, 255, 255 | Main title (always with the pink glow) |
| **Lavender White** | `#F4E9FF` | 244, 233, 255 | Body text |
| **Muted Lilac** | `#B9A6D6` | 185, 166, 214 | Secondary text: navigation, notes, FAQ answers, footer |

## Illimani artwork

The neon Illimani (`assets-src/illimani.jpeg`) has its own colors. These are **approximate** values sampled from the image, useful for matching it in other pieces:

| Name | HEX | Where in the artwork |
|---|---|---|
| Glacier Navy | `#081D34` | Dark body of the mountain |
| Slope Blue | `#132C4E` | Lower slopes |
| Ridge Teal | `#164F69` | Rock lines and shadows |
| Snow Lilac | `#CCC4DD` | Snow highlights |
| Summit Magenta | `#CD4CBE` | Pink light on the snow |

Its outline uses the same Neon Cyan and its snow the same pink as the rest of the palette, plus touches of orange.

## Gradients

- **Night sky:** `#080E1A` (top) → `#033159` (horizon). Use it as the background for posters, banners and social media images.
- **Horizon glow:** the floor grid fades into `#022340` at the horizon, where the blue lines blend into a bright blue glow.

## The neon glow

On the site, the glow is a stack of soft shadows in the accent color behind white or neon text. For the main title:

- Text: White `#FFFFFF`
- Glow: Neon Magenta `#FF1493` at 6 px, 20 px and 45 px blur

In design tools (Figma, Illustrator, etc.), recreate it with 2 or 3 "outer glow" or "drop shadow" layers of the same color, with no offset and increasing blur.

## Contrast (accessibility)

Contrast ratio against Void Base `#080E1A` (WCAG: 4.5:1 minimum for normal text, 3:1 for large text):

| Color | Ratio | OK for |
|---|---|---|
| White `#FFFFFF` | 19.3:1 | Everything |
| Lavender White `#F4E9FF` | 16.5:1 | Everything |
| Neon Yellow `#FFE45C` | 15.2:1 | Everything |
| Neon Cyan `#00F0FF` | 13.7:1 | Everything |
| Laser Amber `#FF9E00` | 9.3:1 | Everything |
| Muted Lilac `#B9A6D6` | 8.7:1 | Everything |
| Neon Magenta `#FF1493` | 5.3:1 | Normal and large text |
| Electric Blue `#0088FF` | 5.5:1 | Normal and large text (prefer it for decoration) |
| Deep Electric Blue `#0070F3` | 4.2:1 | Large text only (prefer it for decoration) |

The values are almost the same on the content panels. For text on a solid neon background (for example a button on hover), use Void Base `#080E1A`: 13.7:1 on cyan, 5.3:1 on magenta.

## Usage guidelines

- **Always on dark backgrounds.** Neon colors on white lose the effect and readability.
- **Pink and cyan are the main pair**, and they're used in roughly equal amounts. Yellow is only for titles and highlights: if everything is yellow, nothing stands out.
- **Don't add new bright colors.** Variations should come from the same colors at different opacities (borders and glows use pink and cyan at 25–50% opacity).
- **Avoid long paragraphs in neon colors:** use Lavender White for body text and keep neon for titles, labels and buttons.

### Print

Neon colors can't be reproduced in standard CMYK: they come out dull. Options:

- **Fluorescent spot inks** (for example Pantone's 801 C–807 C neon range): ask the print shop for a proof against the HEX values above.
- If only CMYK is available, **print on a dark background** (Void Base or Glacier Navy) to keep the contrast, and accept that the colors will be less intense.

## Typography (for reference)

| Use | Font | Notes |
|---|---|---|
| Titles, logo, buttons | **Orbitron** (500, 800) | Geometric and futuristic; always in uppercase |
| Body text | **Space Mono** (400, 700) | Monospace, a nod to code and terminals |

Both are free fonts from Google Fonts (SIL Open Font License).
