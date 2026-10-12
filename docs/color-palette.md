# Hackmeeting 0x7EA: color palette

Visual identity: an **80s neon (synthwave) night**. A very dark violet base, lit by three neon accents: **pink**, **cyan** and **yellow**. The neon look comes from bright colors on dark backgrounds plus a glow; it does not work on light backgrounds.

> **Try alternatives live:** open the site with `?palette` at the end of the URL (for example `https://<site>/?palette`). A panel lets you change every color, compare preset palettes, and copy a link to share your proposal.

> Source of truth: the website code. Page colors are in `src/styles/main.css` (`:root`), and the 3D background colors in `src/background/config.js` (`palette`). If you change a color there, update this document too.

## Neon accents

| Name | HEX | RGB | Where it's used |
|---|---|---|---|
| **Neon Pink** | `#FF2BD6` | 255, 43, 214 | Main accent. Floor grid, glow on the "HACKMEETING 0x7EA" title, subheadings, panel borders, secondary buttons |
| **Neon Cyan** | `#00F0FF` | 0, 240, 255 | Second accent. Wireframe mountains, primary buttons, links, topic tags, dates and venue highlights |
| **Neon Yellow** | `#FFE45C` | 255, 228, 92 | Highlight, used sparingly. Section titles, the year "(2026)" |
| **Electric Violet** | `#B04DFF` | 176, 77, 255 | Sky grid (semi-transparent over the sky) |

## Backgrounds (darks)

| Name | HEX | RGB | Where it's used |
|---|---|---|---|
| **Deep Night** | `#05010F` | 5, 1, 15 | Main background, top of the sky, button backgrounds |
| **Midnight Plum** | `#3A0A4A` | 58, 10, 74 | Glow at the horizon (bottom of the sky gradient) |
| **Dusk Haze** | `#1A0626` | 26, 6, 38 | Fog and distance haze |
| **Floor Black** | `#07020F` | 7, 2, 15 | Floor between the grid lines |
| **Mountain Ink** | `#0A0418` | 10, 4, 24 | Fill of the wireframe mountains |
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

Its outline uses the same Neon Cyan and its snow the same Neon Pink as the rest of the palette, plus touches of orange.

## Gradients

- **Night sky:** `#05010F` (top) → `#3A0A4A` (horizon). Use it as the background for posters, banners and social media images.
- **Horizon glow:** the floor grid fades into `#1A0626` at the horizon, where the pink lines blend into a bright magenta glow.

## The neon glow

On the site, the glow is a stack of soft shadows in the accent color behind white or neon text. For the main title:

- Text: White `#FFFFFF`
- Glow: Neon Pink `#FF2BD6` at 6 px, 20 px and 45 px blur

In design tools (Figma, Illustrator, etc.), recreate it with 2 or 3 "outer glow" or "drop shadow" layers of the same color, with no offset and increasing blur.

## Contrast (accessibility)

Contrast ratio against Deep Night `#05010F` (WCAG: 4.5:1 minimum for normal text, 3:1 for large text):

| Color | Ratio | OK for |
|---|---|---|
| White `#FFFFFF` | 20.6:1 | Everything |
| Lavender White `#F4E9FF` | 17.6:1 | Everything |
| Neon Yellow `#FFE45C` | 16.2:1 | Everything |
| Neon Cyan `#00F0FF` | 14.6:1 | Everything |
| Muted Lilac `#B9A6D6` | 9.3:1 | Everything |
| Neon Pink `#FF2BD6` | 6.5:1 | Normal and large text |
| Electric Violet `#B04DFF` | 5.3:1 | Normal and large text (prefer it for decoration) |

The values are almost the same on the content panels. For text on a solid neon background (for example a button on hover), use Deep Night `#05010F`: 14.6:1 on cyan, 6.5:1 on pink.

## Usage guidelines

- **Always on dark backgrounds.** Neon colors on white lose the effect and readability.
- **Pink and cyan are the main pair**, and they're used in roughly equal amounts. Yellow is only for titles and highlights: if everything is yellow, nothing stands out.
- **Don't add new bright colors.** Variations should come from the same colors at different opacities (borders and glows use pink and cyan at 25–50% opacity).
- **Avoid long paragraphs in neon colors:** use Lavender White for body text and keep neon for titles, labels and buttons.

### Print

Neon colors can't be reproduced in standard CMYK: they come out dull. Options:

- **Fluorescent spot inks** (for example Pantone's 801 C–807 C neon range): ask the print shop for a proof against the HEX values above.
- If only CMYK is available, **print on a dark background** (Deep Night or Glacier Navy) to keep the contrast, and accept that the colors will be less intense.

## Typography (for reference)

| Use | Font | Notes |
|---|---|---|
| Titles, logo, buttons | **Orbitron** (500, 800) | Geometric and futuristic; always in uppercase |
| Body text | **Space Mono** (400, 700) | Monospace, a nod to code and terminals |

Both are free fonts from Google Fonts (SIL Open Font License).
