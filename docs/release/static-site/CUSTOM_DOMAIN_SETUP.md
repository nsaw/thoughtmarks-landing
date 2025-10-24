# Custom Domain Configuration - thoughtmarks.app

**Date**: October 24, 2025  
**Project**: thoughtmarks-landing  
**Domain**: thoughtmarks.app  
**Target**: thoughtmarks-landing.pages.dev

---

## Current Status

✅ **Pages Deployment**: Live at https://production.thoughtmarks-landing.pages.dev  
✅ **Domain Owned**: thoughtmarks.app (Cloudflare account)  
⏳ **Custom Domain**: Pending DNS configuration

---

## Configuration Steps

### Option 1: Cloudflare Dashboard (Recommended)

#### Step 1: Add Custom Domain to Pages Project

1. Open Cloudflare Dashboard: https://dash.cloudflare.com
2. Navigate to **Pages** → **thoughtmarks-landing**
3. Go to **Custom Domains** tab
4. Click **Set up a custom domain**
5. Enter: `thoughtmarks.app`
6. Click **Continue**
7. Cloudflare will automatically:
   - Detect existing zone
   - Create required DNS records
   - Provision SSL certificate
   - Enable proxy

#### Step 2: Verify DNS Records

After adding custom domain, verify these DNS records exist:

| Type  | Name              | Target                          | Proxy |
|-------|-------------------|---------------------------------|-------|
| CNAME | thoughtmarks.app  | thoughtmarks-landing.pages.dev  | ✅     |
| CNAME | www               | thoughtmarks-landing.pages.dev  | ✅     |

#### Step 3: Verify SSL/TLS

1. Go to **SSL/TLS** → **Overview**
2. Set mode to **Full (Strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

#### Step 4: Test Domain

```bash
# Test DNS resolution
dig thoughtmarks.app

# Test HTTPS
curl -I https://thoughtmarks.app

# Test WWW redirect
curl -I https://www.thoughtmarks.app
```

---

### Option 2: Cloudflare API

#### Prerequisites
- Cloudflare API Token with Zone:Edit and Pages:Edit permissions
- Zone ID for thoughtmarks.app domain
- Account ID: ff4a53e6bc626ee548c280edfbb6aa16

#### Step 1: Get Zone ID

```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones?name=thoughtmarks.app" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" | jq -r '.result[0].id'
```

#### Step 2: Add DNS Records

```bash
ZONE_ID="<from_step_1>"

# Add CNAME for root domain
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "thoughtmarks.app",
    "content": "thoughtmarks-landing.pages.dev",
    "proxied": true,
    "ttl": 1
  }'

# Add CNAME for www subdomain
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "www",
    "content": "thoughtmarks-landing.pages.dev",
    "proxied": true,
    "ttl": 1
  }'
```

#### Step 3: Add Custom Domain to Pages

```bash
ACCOUNT_ID="ff4a53e6bc626ee548c280edfbb6aa16"
PROJECT_NAME="thoughtmarks-landing"

curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/domains" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name": "thoughtmarks.app"}'
```

---

### Option 3: Manual DNS Configuration

If automatic setup doesn't work, manually configure DNS:

1. Go to **DNS** → **Records** for thoughtmarks.app
2. Add or update these records:

```
Type: CNAME
Name: @ (or thoughtmarks.app)
Target: thoughtmarks-landing.pages.dev
Proxy: Enabled (orange cloud)
TTL: Auto

Type: CNAME
Name: www
Target: thoughtmarks-landing.pages.dev
Proxy: Enabled (orange cloud)
TTL: Auto
```

3. Save changes
4. Wait for DNS propagation (usually 1-5 minutes with Cloudflare)

---

## Verification

### DNS Verification

```bash
# Check DNS resolution
dig thoughtmarks.app +short
# Should show: thoughtmarks-landing.pages.dev

# Check WWW
dig www.thoughtmarks.app +short
# Should show: thoughtmarks-landing.pages.dev

# Check HTTPS
curl -I https://thoughtmarks.app
# Should return: HTTP/2 200

# Check page content
curl -s https://thoughtmarks.app | grep -i "thoughtmarks"
# Should find Thoughtmarks branding
```

### Browser Verification

1. Visit: https://thoughtmarks.app
2. Verify:
   - ✅ Site loads correctly
   - ✅ HTTPS is active (padlock icon)
   - ✅ CSS styles applied
   - ✅ Navigation works
   - ✅ Legal pages accessible
   - ✅ No mixed content warnings

---

## Cloudflare Settings (Recommended)

### SSL/TLS
- **Encryption Mode**: Full (Strict)
- **Minimum TLS Version**: 1.3
- **Always Use HTTPS**: Enabled
- **Automatic HTTPS Rewrites**: Enabled
- **Opportunistic Encryption**: Enabled

### Speed
- **Auto Minify**: HTML, CSS, JS
- **Brotli**: Enabled
- **Early Hints**: Enabled
- **HTTP/2**: Enabled
- **HTTP/3 (QUIC)**: Enabled

### Caching
- **Browser Cache TTL**: 4 hours
- **Edge Cache TTL**: 24 hours
- **Cache Level**: Standard
- **Always Online**: Enabled

### Security
- **Security Level**: Medium
- **Bot Fight Mode**: Enabled
- **WAF**: Enabled (if available)
- **Rate Limiting**: Configure as needed

### Page Rules (Optional)

```
Rule 1: thoughtmarks.app/*
- Cache Level: Cache Everything
- Browser Cache TTL: 4 hours
- Edge Cache TTL: 24 hours

Rule 2: thoughtmarks.app/assets/*
- Cache Level: Cache Everything
- Browser Cache TTL: 1 week
- Edge Cache TTL: 1 month
```

---

## Troubleshooting

### Issue: Domain Not Resolving

**Symptoms**: `dig thoughtmarks.app` doesn't show pages.dev target

**Solutions**:
1. Check DNS records in Cloudflare Dashboard
2. Ensure CNAME points to `thoughtmarks-landing.pages.dev`
3. Ensure Proxy is enabled (orange cloud)
4. Wait 1-5 minutes for propagation
5. Clear local DNS cache: `sudo dscacheutil -flushcache`

### Issue: SSL Certificate Error

**Symptoms**: "Your connection is not private" warning

**Solutions**:
1. Wait for SSL certificate provisioning (can take 5-15 minutes)
2. Verify SSL/TLS mode is "Full (Strict)"
3. Check Universal SSL is enabled
4. Force certificate regeneration in SSL/TLS settings

### Issue: 404 Errors

**Symptoms**: Custom domain shows 404

**Solutions**:
1. Verify deployment is active at .pages.dev URL first
2. Check custom domain is added to Pages project
3. Verify DNS records are correct
4. Check _redirects file is present in dist/
5. Rebuild and redeploy if needed

### Issue: Mixed Content Warnings

**Symptoms**: HTTP resources on HTTPS page

**Solutions**:
1. Enable "Automatic HTTPS Rewrites" in SSL/TLS settings
2. Update any hardcoded HTTP links to HTTPS
3. Use relative URLs for internal assets

---

## Post-Configuration Checklist

- [ ] Custom domain added to Pages project
- [ ] DNS records configured (CNAME for @ and www)
- [ ] Proxy enabled (orange cloud)
- [ ] SSL certificate active (usually automatic)
- [ ] Site loads at https://thoughtmarks.app
- [ ] WWW redirect works (if configured)
- [ ] All pages accessible
- [ ] CSS and assets load correctly
- [ ] No mixed content warnings
- [ ] Navigation and links functional

---

## URLs After Configuration

### Primary URLs
- **Custom Domain**: https://thoughtmarks.app
- **WWW**: https://www.thoughtmarks.app (optional redirect)
- **Pages.dev**: https://thoughtmarks-landing.pages.dev (backup)

### Key Pages
- **Landing**: https://thoughtmarks.app/landing/
- **About**: https://thoughtmarks.app/about/
- **Legal**: https://thoughtmarks.app/legal/
- **Support**: https://thoughtmarks.app/support/
- **Docs**: https://thoughtmarks.app/docs/

---

## Next Actions

### Immediate
1. ⏳ Add custom domain via Cloudflare Dashboard
2. ⏳ Verify DNS records configured correctly
3. ⏳ Test site loads at thoughtmarks.app
4. ⏳ Configure SSL/TLS settings
5. ⏳ Test all pages and navigation

### Monitoring
1. Set up Cloudflare Web Analytics
2. Configure cache performance
3. Monitor SSL certificate renewal
4. Track page load performance
5. Monitor error rates

### Documentation
1. Update deployment summary with custom domain
2. Document final URLs
3. Create runbook for future deployments
4. Document cache and SSL configuration

---

**Status**: ⏳ Ready for custom domain configuration via Cloudflare Dashboard  
**Next Step**: Configure thoughtmarks.app in Cloudflare Dashboard  
**Estimated Time**: 5-10 minutes for DNS propagation

