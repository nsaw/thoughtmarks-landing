# DNS Configuration Guide - thoughtmarks.app

**Date**: October 24, 2025  
**Current Status**: 522 Error (A records pointing to wrong IPs)  
**Required Fix**: Change A records → CNAME to Pages

---

## Current DNS Configuration (INCORRECT)

```
Type: A
Name: thoughtmarks.app
Value: 172.67.130.220, 104.21.9.127
Result: 522 Error (Connection timed out)
```

**Problem**: These are Cloudflare proxy IPs, but there's no origin server configured to handle requests.

---

## Correct DNS Configuration

### For Main Domain (Cloudflare Pages)

**Delete existing A records**, then create:

```
Type: CNAME
Name: @ (or thoughtmarks.app)
Target: thoughtmarks-landing.pages.dev
Proxy: Enabled (orange cloud ☁️)
TTL: Auto
```

### For WWW Subdomain (Optional)

```
Type: CNAME
Name: www
Target: thoughtmarks-landing.pages.dev
Proxy: Enabled (orange cloud ☁️)
TTL: Auto
```

### For API Subdomain (Your Backend)

```
Type: A (or AAAA for IPv6)
Name: api
Target: [YOUR_SERVER_IP]
Proxy: Enabled (orange cloud) OR Disabled (gray cloud) for direct connection
TTL: Auto
```

**Note**: api.thoughtmarks.app should use A record with YOUR actual server IP, not Cloudflare's proxy IPs.

---

## Why CNAME for Pages, A for API?

### Cloudflare Pages (CNAME)
- **Managed Service**: Cloudflare handles hosting
- **Load Balancing**: They route to nearest edge server
- **Auto SSL**: Certificate managed automatically
- **CDN**: Global distribution handled
- **Point to**: .pages.dev domain (CNAME)

### Your Backend API (A Record)
- **Your Infrastructure**: You host the server
- **Specific IP**: Your server has a fixed IP
- **Direct Connection**: Optionally bypass proxy
- **Custom Port**: Can use non-standard ports
- **Point to**: Your server IP address (A record)

---

## Setup Steps (Cloudflare Dashboard)

### Step 1: Remove Existing A Records

1. Go to **Cloudflare Dashboard** → thoughtmarks.app zone
2. Go to **DNS** → **Records**
3. Find A records for `thoughtmarks.app` or `@`
4. Click **Edit** → **Delete**
5. Confirm deletion

### Step 2: Create CNAME Record

1. Click **Add record**
2. Select **Type**: CNAME
3. **Name**: @ (or leave empty for root domain)
4. **Target**: thoughtmarks-landing.pages.dev
5. **Proxy status**: Proxied (click for orange cloud)
6. **TTL**: Auto
7. Click **Save**

### Step 3: Add Custom Domain to Pages Project

1. Go to **Workers & Pages** → **thoughtmarks-landing**
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `thoughtmarks.app`
5. Click **Continue**
6. Cloudflare verifies DNS and provisions SSL
7. Wait 1-5 minutes

### Step 4: Verify

```bash
# Wait for DNS propagation
sleep 60

# Check DNS points to correct target
dig thoughtmarks.app CNAME +short
# Should show: thoughtmarks-landing.pages.dev

# Test HTTPS
curl -I https://thoughtmarks.app
# Should return: HTTP/2 200 (not 522)

# Verify new content loads
curl -s https://thoughtmarks.app/legal/privacy.html | grep -o '<h1>[^<]*'
# Should return: <h1>Privacy Policy
```

---

## Common Issues

### Issue: "CNAME and A/AAAA cannot coexist"

**Solution**: Delete all A/AAAA records for the root domain before adding CNAME.

### Issue: "Subdomain already exists"

**Solution**: Delete existing @ or thoughtmarks.app records first.

### Issue: 522 Error After CNAME

**Solutions**:
1. Ensure custom domain added to thoughtmarks-landing Pages project
2. Wait 5-10 minutes for SSL provisioning
3. Check Pages project has successful deployment
4. Verify CNAME points to correct .pages.dev domain

### Issue: SSL Certificate Error

**Solutions**:
1. Wait 15 minutes for certificate provisioning
2. Check SSL/TLS mode is "Full" or "Full (Strict)"
3. Ensure "Always Use HTTPS" is enabled
4. Check Pages project shows "Active" SSL status

---

## After Configuration

Once DNS is configured, these URLs should work:

- https://thoughtmarks.app/landing/ → Landing page
- https://thoughtmarks.app/legal/ → Legal hub  
- https://thoughtmarks.app/legal/privacy.html → Privacy policy
- https://thoughtmarks.app/legal/terms.html → Terms of service
- https://thoughtmarks.app/support/ → Support center
- https://thoughtmarks.app/support/watch.html → Apple Watch guide
- https://thoughtmarks.app/about/ → About page
- https://thoughtmarks.app/docs/ → Documentation

---

## Verification Checklist

After DNS configuration:

- [ ] A records removed from thoughtmarks.app
- [ ] CNAME created: thoughtmarks.app → thoughtmarks-landing.pages.dev
- [ ] CNAME proxied (orange cloud)
- [ ] Custom domain added to thoughtmarks-landing Pages project
- [ ] SSL certificate shows "Active"
- [ ] `curl -I https://thoughtmarks.app` returns HTTP/2 200
- [ ] Privacy page loads at https://thoughtmarks.app/legal/privacy.html
- [ ] CSS loads (no 404)
- [ ] Images load (no 404)
- [ ] Navigation works

---

**Current A Records**: 172.67.130.220, 104.21.9.127 (Cloudflare proxies, causing 522)  
**Correct Config**: CNAME → thoughtmarks-landing.pages.dev (Pages managed service)  
**Action Required**: Delete A records, create CNAME, add custom domain to Pages project

