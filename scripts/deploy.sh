#!/usr/bin/env bash
# Uploads the built site (dist/) to S3 and invalidates CloudFront.
# Used by .github/workflows/deploy.yml; also works locally with AWS credentials.
#
#   S3_BUCKET=... CLOUDFRONT_DISTRIBUTION_ID=... scripts/deploy.sh
#
# Caching strategy:
#   - dist/assets/* have content hashes in their names (Vite), so they are cached
#     for a year and never need invalidating.
#   - Everything else (index.html, files from public/) is revalidated on every
#     request and is the only thing invalidated after a deploy.
set -euo pipefail

: "${S3_BUCKET:?S3_BUCKET is required}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?CLOUDFRONT_DISTRIBUTION_ID is required}"
DIST_DIR="${DIST_DIR:-dist}"

IMMUTABLE="public, max-age=31536000, immutable"
REVALIDATE="public, max-age=0, must-revalidate"

[ -f "$DIST_DIR/index.html" ] || { echo "No $DIST_DIR/index.html; run the build first." >&2; exit 1; }

echo "1/4 Uploading hashed assets"
if [ -d "$DIST_DIR/assets" ]; then
  aws s3 sync "$DIST_DIR/assets" "s3://$S3_BUCKET/assets" --cache-control "$IMMUTABLE" --no-progress
fi

# New assets are in place before the HTML that references them goes live.
echo "2/4 Uploading HTML and other files"
aws s3 sync "$DIST_DIR" "s3://$S3_BUCKET" --exclude "assets/*" --cache-control "$REVALIDATE" --delete --no-progress

echo "3/4 Invalidating CloudFront"
mapfile -t paths < <(cd "$DIST_DIR" && find . -type f ! -path "./assets/*" | sed 's|^\.||' | sort)
paths=("/" "${paths[@]}")
printf '  %s\n' "${paths[@]}"
invalidation_id=$(aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "${paths[@]}" \
  --query 'Invalidation.Id' --output text)
aws cloudfront wait invalidation-completed --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --id "$invalidation_id"
echo "  invalidation $invalidation_id completed"

# Only now remove assets from previous deploys, once no cached HTML points at them.
echo "4/4 Removing assets from previous deploys"
if [ -d "$DIST_DIR/assets" ]; then
  aws s3 sync "$DIST_DIR/assets" "s3://$S3_BUCKET/assets" --cache-control "$IMMUTABLE" --delete --no-progress
fi

echo "Deployed."
