# Hackmeeting 0x7EA: color palette

Visual identity: an **80s neon (synthwave) dusk in the Andes**. A deep blue sky fading to a plum horizon, with **orange** neon on the floor grid and mountains that echoes the Illimani's sunset light. The neon look comes from bright colors on dark backgrounds plus a glow; it does not work on light backgrounds.

> **Try alternatives live:** open the site with `?palette` at the end of the URL (for example `https://<site>/?palette`). A panel lets you change every color, compare preset palettes, and copy a link to share your proposal.

> Source of truth: the website code. Page colors are in `src/styles/main.css` (`:root`), and the 3D background colors in `src/background/config.js` (`palette`). If you change a color there, update this document too.

## Neon accents

| Name | HEX | RGB | Where it's used |
|---|---|---|---|
| **Sunset Orange** | `#F2884B` | 242, 136, 75 | Main accent (page `--coral` and `--amber`). Primary buttons, glow on the "HACKMEETING 0x7EA" title, logo, section titles, the year "(2026)", menu hover, open FAQ. Also the floor grid and the wireframe mountains |
| **Hot Pink** | `#FF2A85` | 255, 42, 133 | Secondary accents: subheadings, topic tags, secondary buttons, dividers and FAQ markers |
| **Electric Blue** | `#0A98C7` | 10, 152, 199 | Links, panel and card borders, card hover, FAQ hover |
| **Andean Green** | `#4B8B1D` | 75, 139, 29 | Small details (page `--cyan`): the dates/city line, card titles, date and venue highlights |
| **Sky Blue** | `#0070F3` | 0, 112, 243 | Sky grid (semi-transparent over the sky) |

## Backgrounds (darks)

| Name | HEX | RGB | Where it's used |
|---|---|---|---|
| **Deep Blue** | `#033159` | 3, 49, 89 | Main background, top of the sky, text on solid buttons |
| **Plum Horizon** | `#4A2A5E` | 74, 42, 94 | Glow at the horizon (bottom of the sky gradient) |
| **Dusk Haze** | `#1D1640` | 29, 22, 64 | Fog and distance haze |
| **Andean Night** | `#022340` | 2, 35, 64 | Floor between the grid lines |
| **Mountain Ink** | `#10122E` | 16, 18, 46 | Fill of the wireframe mountains |
| **Panel** | `#030805` at 78% opacity | 3, 8, 5 | Content panels over the scene (with a light blur) |

## Text

| Name | HEX | RGB | Where it's used |
|---|---|---|---|
| **White** | `#FFFFFF` | 255, 255, 255 | Body text and the main title (always with the orange glow) |
| **Muted Lilac** | `#B9A6D6` | 185, 166, 214 | Secondary text: navigation, notes, FAQ answers, footer |

## Illimani artwork

The low-poly Illimani (`src/assets/illimani.png`) has its own colors. These are **approximate** values sampled from the image, useful for matching it in other pieces:

| Name | HEX | Where in the artwork |
|---|---|---|
| Slate Shadow | `#333D54` | Shaded faces and lower slopes |
| Terracotta | `#D0685C` | Lit faces in mid-tone |
| Peach | `#F79779` | Sunlit faces |
| Light Peach | `#FAA58E` | Brightest faces near the summits |

Its sunlit faces are close to Sunset Orange, which is why the grid and mountains use it.

## Gradients

- **Dusk sky:** `#033159` (top) → `#4A2A5E` (horizon). Use it as the background for posters, banners and social media images.
- **Horizon glow:** the floor grid fades into `#1D1640` at the horizon, where the orange lines blend into a warm glow.

## The neon glow

On the site, the glow is a stack of soft shadows in the accent color behind white or neon text. For the main title:

- Text: White `#FFFFFF`
- Glow: Sunset Orange `#F2884B` at 6 px, 20 px and 45 px blur

In design tools (Figma, Illustrator, etc.), recreate it with 2 or 3 "outer glow" or "drop shadow" layers of the same color, with no offset and increasing blur.

## Contrast (accessibility)

WCAG asks for 4.5:1 for normal text and 3:1 for large text. Most text sits on the content panels (`#030805` at 78%); the hero sits more directly on the Deep Blue sky.

| Color | On panels | On Deep Blue `#033159` | OK for |
|---|---|---|---|
| White `#FFFFFF` | 20.2:1 | 13.2:1 | Everything |
| Muted Lilac `#B9A6D6` | 9.1:1 | 6.0:1 | Everything |
| Sunset Orange `#F2884B` | 8.1:1 | 5.3:1 | Everything |
| Electric Blue `#0A98C7` | 6.1:1 | 4.0:1 | Text on panels; large text on the sky |
| Hot Pink `#FF2A85` | 5.7:1 | 3.7:1 | Text on panels; large text on the sky |
| Andean Green `#4B8B1D` | 4.8:1 | 3.2:1 | Text on panels; large text only on the sky |
| Sky Blue `#0070F3` | 4.4:1 | 2.9:1 | Decoration only |

For text on a solid accent (the primary button, or a secondary button on hover), the site uses Deep Blue `#033159`: 5.3:1 on orange, 3.7:1 on hot pink (fine for the large, bold button labels).

## Usage guidelines

- **Always on dark backgrounds.** Neon colors on white lose the effect and readability.
- **Orange leads.** It's the main call to action, the title glow, section titles and the scene's neon. Hot pink is for secondary accents, blue for links and structure, green for small details.
- **Don't add new bright colors.** Variations should come from the same colors at different opacities (borders and glows use the accents at 25–50% opacity).
- **Avoid long paragraphs in neon colors:** use White for body text and keep neon for titles, labels and buttons.

### Print

Neon colors can't be reproduced in standard CMYK: they come out dull. Options:

- **Fluorescent spot inks** (for example Pantone's 801 C–807 C neon range): ask the print shop for a proof against the HEX values above.
- If only CMYK is available, **print on a dark background** (Deep Blue or Andean Night) to keep the contrast, and accept that the colors will be less intense.

## Typography (for reference)

| Use | Font | Notes |
|---|---|---|
| Main title and section titles | **VCR OSD Mono** (regular only) | 80s VHS on-screen display; always in uppercase |
| Everything else (text, logo, buttons, labels) | **Share Tech Mono** (regular only) | Monospace, a nod to code and terminals |

Share Tech Mono is a free font from Google Fonts (SIL Open Font License). VCR OSD Mono is by Riciery Leal and is distributed as free; the font file itself includes no license text.
