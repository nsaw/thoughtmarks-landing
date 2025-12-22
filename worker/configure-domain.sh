#!/bin/bash
# Script to configure custom domain for Cloudflare Worker
# This requires the domain to be added to Cloudflare first

set -e

ACCOUNT_ID="ff4a53e6bc626ee548c280edfbb6aa16"
WORKER_NAME="dontforgetthisapp-redirect"
DOMAIN="dontforgetthisapp.com"
WWW_DOMAIN="www.dontforgetthisapp.com"

echo "Checking if domain $DOMAIN is in Cloudflare..."
echo ""
echo "To configure the custom domain:"
echo "1. Ensure $DOMAIN is added to Cloudflare (if not, add it in the dashboard)"
echo "2. Go to: https://dash.cloudflare.com/$ACCOUNT_ID/workers/services/view/$WORKER_NAME"
echo "3. Click 'Settings' → 'Triggers'"
echo "4. Under 'Custom Domains', click 'Add Custom Domain'"
echo "5. Add: $DOMAIN"
echo "6. Add: $WWW_DOMAIN"
echo "7. Save changes"
echo ""
echo "After configuration, test with:"
echo "  curl -I https://$DOMAIN"
echo "  Expected: HTTP/2 301 with location: https://thoughtmarksapp.com/"
echo ""


