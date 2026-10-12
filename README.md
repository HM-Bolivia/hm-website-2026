# Hackmeeting 2026

Single-page site with an animated neon 80s (synthwave) background built with [three.js](https://threejs.org) and [Vite](https://vite.dev).

## Getting started

```sh
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run assets:illimani  # regenerate the transparent Illimani PNG (needs ImageMagick 7)
```

## Project structure

```
index.html                  page markup (placeholder content)
src/
  main.js                   entry point: loads styles, starts the background
  styles/main.css           page styles (colors as CSS variables in :root)
  background/
    config.js               palette + every tunable number (speed, bloom, sizes…)
    NeonBackground.js       renderer, camera, scene, animation loop, resize
    objects/                one file per thing in the world
      Sky.js                gradient sky dome
      Sun.js                striped retro sun (shader)
      Grid.js               infinite scrolling neon grid (shader), used for floor and sky
      Mountains.js          wireframe mountains, two leapfrogging tiles
      Illimani.js           neon Illimani artwork on the horizon, in front of the sun
  assets/illimani.png       transparent artwork used in the scene (generated)
assets-src/illimani.jpeg    original artwork on black
scripts/
  prepare-illimani-image.sh turns the original into the transparent PNG
    effects/postprocessing.js   bloom glow
    controls/MouseParallax.js   camera sway that follows the pointer
```

### Tweaking the look

Most visual changes only need `src/background/config.js`: colors (`palette`), scroll `speed`, `bloom` strength, sun size and position, mountain height, and so on.

### Illimani

The mountain is a picture: `assets-src/illimani.jpeg` (neon art on black) is converted by `scripts/prepare-illimani-image.sh` into `src/assets/illimani.png`. The black background becomes transparent, the glow keeps its color, and the mountain body stays opaque so it hides the sun. To swap the artwork, replace the source file and run `npm run assets:illimani`.

Size, position and brightness are in `config.illimani`.

### Trying out palettes

Add `?palette` to the URL (e.g. `http://localhost:5173/?palette` or the deployed site) to open a floating color editor. It recolors the page and the 3D scene live, has a few preset palettes to compare, and remembers your choice in the browser.

- **Copiar enlace** copies a link with the palette encoded in it (`?palette&p=…`), so others can see exactly the same colors.
- **Copiar valores** copies the HEX values plus ready-to-paste snippets for `src/styles/main.css` and `src/background/config.js`, to make a chosen palette the default.

The editor lives in `src/palette-playground/` and is only downloaded when `?palette` is present. Which page/scene colors each swatch controls is defined in `tokens.js`; presets are in `presets.js`.

### Adding something to the world

Create a class in `src/background/objects/` that exposes:

- `object3d`: the `THREE.Object3D` to add to the scene
- `update(delta, elapsed, speed)`: optional, called every frame
- `dispose()`: optional, frees GPU resources

Then add it to the list in `NeonBackground#createObjects`.

### Accessibility and fallbacks

- If the user has `prefers-reduced-motion` set, the world stays still and mouse parallax is off.
- If WebGL isn't available, the canvas is removed and a CSS gradient shows instead.

## Deployment

The site is served from a private S3 bucket through CloudFront. GitHub Actions deploys on every push to `main`, authenticating to AWS with OIDC (no stored AWS keys).

```
infra/                         Terraform: S3, CloudFront, optional ACM certificate, GitHub OIDC role
scripts/deploy.sh              uploads dist/ to S3 and invalidates CloudFront
.github/workflows/deploy.yml    build + deploy on push to main
```

### 1. Create the infrastructure (once)

Prerequisites: Terraform ≥ 1.10, AWS credentials with admin-level access for the first apply, and an S3 bucket for Terraform state.

```sh
cd infra
cp backend.hcl.example backend.hcl            # point at your state bucket
cp terraform.tfvars.example terraform.tfvars  # set github_repository = "owner/name"
terraform init -backend-config=backend.hcl
terraform apply
```

- If the AWS account already has the GitHub OIDC provider (`token.actions.githubusercontent.com`), set `create_github_oidc_provider = false`. There can only be one per account.
- **Custom domain (optional):** set `domain_name`. The certificate is created in us-east-1 and `apply` waits until it is validated: add the record from the `certificate_validation_records` output at your DNS provider while it waits. Then point the domain at `cloudfront_domain_name` (CNAME, or ALIAS/ANAME at the apex).

### 2. Configure GitHub

In the repository: **Settings → Secrets and variables → Actions → Variables**, create the four variables printed by:

```sh
terraform output github_actions_variables
```

(`AWS_REGION`, `AWS_ROLE_ARN`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`). None of them are secrets.

### 3. Deploy

Push to `main` (or run the workflow manually from the Actions tab). The AWS role only trusts workflows from `github_repository` running on `github_branch`, so forks, pull requests and other branches cannot deploy.

### Caching

- `assets/*` files have content hashes in their names: cached for a year (`immutable`), never invalidated.
- `index.html` and anything from `public/`: `max-age=0, must-revalidate`, and invalidated after each deploy.
- Old hashed assets are deleted only after the invalidation completes. The bucket keeps previous object versions for 30 days in case you need to roll back.
