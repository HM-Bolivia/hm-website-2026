# CLAUDE.md

Website for **Hackmeeting 0x7ea (2026)**, a hacking / free software event in Bolivia (repo `HM-Bolivia/hm-website-2026`). One static page with an animated three.js background: an 80s neon (synthwave) world with the Illimani mountain on the horizon. Built with Vite + vanilla JS, deployed to S3 + CloudFront by GitHub Actions.

## Commands

```sh
npm run dev               # dev server (http://localhost:5173), hot reload
npm run build             # production build → dist/
npm run preview           # serve dist/
npm run assets:illimani   # regenerate src/assets/illimani.png (needs ImageMagick 7)
cd infra && terraform validate   # after `terraform init -backend=false`
```

There are no tests or linters. Verify changes with `npm run build` and by looking at the page (see "Visual checks" below). Delete `dist/` when done; it's gitignored but shouldn't linger.

## Layout

```
index.html                    all page content (Spanish) + inline intro script in <head>
src/main.js                   entry: starts the background, the intro, and (with ?palette) the palette editor
src/intro.js                  content slides up after Illimani has been shown alone
src/styles/main.css           page styles; palette as CSS custom properties in :root
src/background/
  config.js                   scene palette + every tunable number (speed, bloom, sizes, positions)
  NeonBackground.js           renderer, camera, loop, resize; setPalette() and glow for live tweaks
  objects/                    Sky, Grid (floor and sky), Mountains, Illimani, Sun (unused)
  effects/postprocessing.js   render → UnrealBloom → output; returns { composer, bloom }
  controls/MouseParallax.js   camera sway toward the pointer
src/palette-playground/       floating color editor, lazy-loaded only with ?palette
src/assets/illimani.png       generated; do not edit by hand
assets-src/illimani.jpeg      original neon Illimani artwork (on black)
scripts/prepare-illimani-image.sh   jpeg → transparent png
scripts/deploy.sh             S3 upload + CloudFront invalidation (used by CI, runnable locally)
infra/                        Terraform: S3, CloudFront, optional ACM cert, GitHub OIDC deploy role
.github/workflows/deploy.yml  build + deploy on push to main
docs/color-palette.md         palette for designers/marketing
```

## Architecture notes

### Background scene
- Scene objects follow a small contract (documented in `NeonBackground.js`): `object3d`, and optionally `update(delta, elapsed, speed)`, `dispose()`, `ready` (promise) and `setPalette(palette)`. To add something, write a class with that shape in `objects/` and add it in `#createObjects`.
- **Tuning goes in `config.js`**, not in the object files. Colors in `palette`, numbers in `config`.
- **The bloom washes saturated colors out to white.** That's why Illimani has `brightness: 0.45` and the sun has `intensity` < 1. If something looks too white, lower its brightness before touching the bloom.
- **Grid** is drawn in a fragment shader and scrolls with a uniform offset; nothing moves. The same class makes the sky grid (`ceiling: true`, transparent, lines only).
- **Mountains** are two leapfrogging tiles. Their height function must stay periodic along z (integer multiples of `TAU / length`), or a seam appears.
- Things at floor level sink slightly below y=0 (mountains −0.1) to avoid z-fighting with the floor grid.
- **Illimani is a textured plane**, not geometry. The artwork can't be recolored by the palette. Earlier attempts (procedural ridges, real SRTM elevation data) were rejected as not looking like the real mountain; don't reintroduce them unless asked.
- **The animation stops by itself:** after `config.stopAfter` s (default 20) the scroll and parallax ease to zero over `config.slowDown` s, then the loop ends and the background switches to static mode (no CPU while idle). `stopAfter: 0` animates forever.
- **Static mode:** with `prefers-reduced-motion` or `config.animate = false` there is no render loop; `NeonBackground` draws a frame only on load, texture load, resize and palette/glow changes. Anything new that changes the scene must call `#requestRender()` for it to show in static mode. `animate` must be `true` when deploying.
- **The Sun is intentionally removed from the scene.** `Sun.js` and `config.sun` / `palette.sunTop|sunBottom` are kept so it can come back.
- three r186: `THREE.Timer` is in core. Colors go through three's color management (hex values are sRGB, converted to linear), and `OutputPass` converts back.

### Intro
- The inline script in `index.html` adds `intro` to `<html>` before first paint, which keeps `.page` off-screen. It's skipped with a URL hash or `prefers-reduced-motion`.
- `initIntro(background.ready)` adds `intro-play` once Illimani's texture has loaded (max wait 3 s). The CSS animation delay (`--intro-delay`) is how long Illimani is shown alone. On `animationend` both classes are removed.
- A 6 s fail-safe in the inline script always reveals the content, even if JS fails to load.

### Colors (keep these in sync)
- Page colors: `:root` in `main.css` (plus the loading background in the inline `<style>` of `index.html`, which must match `--bg-deep`). Scene colors: `palette` in `config.js`. Shared: `--bg-deep` = `skyTop`, `--amber` = `mountainLine`. The grid lines are scene-only. Page accents each have one role (see the comments in `:root`).
- **Never hardcode palette colors as `rgba(...)` in CSS.** Use `color-mix(in srgb, var(--magenta) 45%, transparent)`, so the palette editor and future palette changes recolor everything.
- `src/palette-playground/tokens.js` maps each editable swatch to its CSS variable and/or scene key. Its defaults are read at runtime, so no values are duplicated there.
- When a default color changes, also update `docs/color-palette.md`.

### Palette editor
- Opened with `?palette` (a shared link carries `?palette&p=<15 hex values>&g=<glow>`). It's dynamically imported so normal visitors don't download it.
- Its own UI uses fixed neutral colors on purpose, so it stays readable whatever palette is being tried. Labels are in Spanish.

## Content and language
- **All site copy is in Latin American Spanish, using *tú*.** The UI of tools shown to organizers (palette editor) is Spanish too.
- The event name is written **`0x7ea`** in lowercase (0x7EA = 2026), including the title; `.hex` disables `text-transform` for it.
- Pending event data is marked with `[PLACEHOLDERS EN CORCHETES]`, and placeholder URLs have `TODO` comments (CFP form: a `mailto:` until the real form exists). Don't invent real dates, venues or links.
- `public/` holds `favicon.ico` (from the 0x7e3 site) and `og-image.png` (1200×630 link-preview card: a headless-Chrome shot of the hero with header, paragraphs and buttons hidden, `--force-prefers-reduced-motion` to skip the intro). Regenerate the card when the title or dates change. The `og:` tags in `index.html` need absolute URLs (domain: `0x7ea.hackmeeting.org.bo`).
- Sections and their anchors: banner `#inicio`, `#acerca` (history; links to memorias.hackmeeting.org.bo), `#cfp` (titled "Call for papers"; there is a single talk format, no workshops or lightning talks), `#fecha`, `#lugar`, `#faq`.

## Deployment and infra
- **CI deploys from `master` only.** The workflow trigger and the IAM role trust (`github_branch` in `terraform.tfvars`; the variable defaults to `main`) must change together.
- OIDC trust subject is `repo:<github_repository>:ref:refs/heads/<github_branch>`. This org sends **ID-pinned subjects** (`repo:HM-Bolivia@70455766/hm-website-2026@1412132984:...`), set via `github_owner_id` / `github_repository_id`. If the role is rejected, failed `AssumeRoleWithWebIdentity` events in CloudTrail show the exact subject GitHub sent. **Don't add `environment:` to the deploy job**: it changes the token subject and the role would reject it.
- The deploy role is least-privilege (this bucket + this distribution's invalidations). Terraform is run by hand, never in CI: it would need admin-level AWS access in a public repo.
- `scripts/deploy.sh` caching rules:
  - `assets/*` (hashed by Vite) are uploaded first with a 1-year `immutable` cache and are never invalidated.
  - Everything else uses `max-age=0, must-revalidate` and is invalidated: currently `/` and `/index.html`, plus any files from `public/`.
  - Old assets are pruned only after the invalidation completes.
- **Public repository:** `infra/backend.hcl` and `infra/terraform.tfvars` hold real bucket names and are gitignored; only `*.example` files are committed. Actions logs are public, and the workflow currently reads `vars.*`, which show unmasked in logs. Switching them to `secrets.*` was offered but not done.
- Custom domain: either set `domain_name` (Terraform creates the ACM cert in us-east-1 and waits for DNS validation done by hand), or also set `acm_certificate_arn` to reuse an existing us-east-1 cert. DNS is managed outside Terraform.
- Commit `infra/.terraform.lock.hcl`.

## Visual checks (headless Chrome)
Use `npm run build && npx vite preview --port 4789` and Chrome with software WebGL:

```sh
google-chrome --headless=new --enable-unsafe-swiftshader --use-angle=swiftshader \
  --window-size=1280,800 --virtual-time-budget=4000 --screenshot=out.png http://localhost:4789/
```

- Software rendering is very slow (seconds per frame), so **`--virtual-time-budget` doesn't reflect CSS animation timing**. To check the intro or interactions, drive Chrome over the DevTools protocol (`--remote-debugging-port`, Node's built-in `WebSocket`) and read state with `Runtime.evaluate`.
- Screenshots of a URL with a hash (`/#faq`) render blank. Scroll with `scrollIntoView` over the DevTools protocol instead.
- To see only the background, hide `main`/`.page` in a copy of `dist/index.html`.
- **Cleanup:** kill Chrome and the preview server by PID. Don't use `pkill -f <pattern>` when the pattern appears in your own command line: it kills your own shell. Make sure no headless Chrome is left running (the user has their own Chrome open, so filter by your `--user-data-dir`).
- ImageMagick gotcha in the image script: a `-compose` setting carries over to later operators like `-border`. Reset it with `-compose Over` and write `PNG32:` to keep the alpha channel.

## Working preferences
- Keep it simple and maintainable: vanilla JS modules, small files, comments explaining *why*.
- Ask before choices that change the look or the content; for small requests, just do them.
- Don't commit unless asked. The user commits themselves.
