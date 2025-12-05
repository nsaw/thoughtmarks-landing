# Email Spam Fix Guide: thoughtmarks.app

**Issue**: Waitlist confirmation emails flagged as spam by Gmail  
**Root Cause**: DMARC policy too strict + From address domain mismatch  
**Status**: ⚠️ **PARTIALLY FIXED** (awaiting DMARC update)

---

## 🔍 PROBLEM ANALYSIS

### Gmail Warning Message
```
"The sender hasn't authenticated this message so Gmail can't verify 
that it actually came from them."
```

### Root Causes

1. **DMARC Policy Too Aggressive**
   - Current: `p=quarantine` 
   - Effect: Tells Gmail to be suspicious and filter aggressively
   
2. **From Address Domain Mismatch**
   - Sending from: `hello@thoughtmarks.app` (apex domain)
   - Authenticated domain: `em1201.thoughtmarks.app` (subdomain)
   - DKIM/SPF pass but domain alignment fails

3. **Failed Link Branding**
   - 2 SendGrid link branding domains failed validation
   - Affects click tracking and reputation

---

## ✅ FIXES APPLIED

### Fix 1: Updated From Address ✅

**Changed**: Backend From address to use authenticated subdomain

**Before**:
```
hello@thoughtmarks.app
```

**After**:
```
hello@em1201.thoughtmarks.app
```

**Command Used**:
```bash
fly secrets set SENDGRID_FROM_EMAIL="hello@em1201.thoughtmarks.app" \
  --app thoughtmarks-api
```

**Result**: Backend redeployed automatically (2 machines updated)

---

## ⏳ FIX PENDING: Update DMARC Record

### Why This Matters

DMARC policy `p=quarantine` tells email providers to:
- ✅ Check SPF (pass)
- ✅ Check DKIM (pass)
- ❌ Check domain alignment (FAIL - hello@thoughtmarks.app vs em1201.thoughtmarks.app)
- ❌ **Quarantine the email** (send to spam)

### Required Action

**Update Cloudflare DNS Record**:

1. **Navigate to**: https://dash.cloudflare.com/ff4a53e6bc626ee548c280edfbb6aa16/thoughtmarks.app/dns/records

2. **Search for**: `_dmarc` (or scroll to find TXT record for `_dmarc`)

3. **Click**: **Edit** button on the `_dmarc` record

4. **Current Value**:
   ```
   v=DMARC1; p=quarantine; rua=mailto:hello@thoughtmarks.app
   ```

5. **Replace with**:
   ```
   v=DMARC1; p=none; rua=mailto:hello@thoughtmarks.app; ruf=mailto:hello@thoughtmarks.app; pct=100; adkim=r; aspf=r
   ```

6. **Click**: **Save**

### DMARC Policy Explanation

| Parameter | Value | Meaning |
|-----------|-------|---------|
| `p=none` | none | Monitor only, don't quarantine (fixes spam issue) |
| `rua=` | hello@thoughtmarks.app | Send aggregate reports here |
| `ruf=` | hello@thoughtmarks.app | Send forensic (failure) reports here |
| `pct=100` | 100 | Apply to 100% of emails |
| `adkim=r` | relaxed | Allow DKIM from subdomains (em1201) |
| `aspf=r` | relaxed | Allow SPF from subdomains |

---

## 🔧 OPTIONAL: Fix Link Branding

### Current Status in SendGrid

| Domain | Status |
|--------|--------|
| `url2324.thoughtmarks.app` | ❌ Failed |
| `url5323.thoughtmarks.app` | ❌ Failed |
| `url7638.thoughtmarks.app` | ✅ Verified |

### Recommended Action

**Remove failed link branding domains**:
1. Go to https://app.sendgrid.com/settings/sender_auth
2. Scroll to "Link Branding" section
3. Delete `url2324.thoughtmarks.app` and `url5323.thoughtmarks.app`
4. Keep only `url7638.thoughtmarks.app` (verified)

**Why**: Failed domains hurt sender reputation

---

## ✅ VERIFICATION STEPS

### 1. Check DNS Records
```bash
# Verify DMARC (after update)
dig +short _dmarc.thoughtmarks.app TXT
# Should show: "v=DMARC1; p=none; rua=..."

# Verify SPF
dig +short thoughtmarks.app TXT
# Should include: "v=spf1 include:_spf.sendgrid.net ~all"

# Verify SendGrid DKIM
dig +short s1._domainkey.em1201.thoughtmarks.app CNAME
# Should return SendGrid CNAME
```

### 2. Test Email Delivery

**Trigger a test email**:
```bash
curl -X POST https://api.thoughtmarks.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL@gmail.com","name":"Test User","source":"spam-fix-test"}'
```

**Check**:
- Email arrives in inbox (not spam)
- From address shows: `Nick @ Thoughtmarks <hello@em1201.thoughtmarks.app>`
- Gmail doesn't show authentication warning

### 3. Check Email Headers

When you receive the test email, view the **original message** (Show Original in Gmail) and check:

```
Authentication-Results: mx.google.com;
  dkim=pass header.i=@em1201.thoughtmarks.app;
  spf=pass smtp.mailfrom=em1201.thoughtmarks.app;
  dmarc=pass (p=NONE sp=NONE dis=NONE) header.from=em1201.thoughtmarks.app
```

All three should show **"pass"**.

---

## 📊 CURRENT DNS CONFIGURATION

### SPF Record ✅
```
v=spf1 include:_spf.mx.cloudflare.net 
       include:_spf.firebasemail.com 
       include:_spf.em1201.thoughtmarks.app 
       include:_spf.sendgrid.net 
       ~all
```
**Status**: ✅ Correct (includes SendGrid)

### DMARC Record ⚠️
```
v=DMARC1; p=quarantine; rua=mailto:hello@thoughtmarks.app
```
**Status**: ⚠️ **Needs Update** (change `p=quarantine` to `p=none`)

### SendGrid DKIM ✅
- `s1._domainkey.em1201.thoughtmarks.app` → SendGrid
- `s2._domainkey.em1201.thoughtmarks.app` → SendGrid

**Status**: ✅ Configured correctly for subdomain

---

## 🚀 RECOMMENDED LONG-TERM FIX

### Phase 1: Immediate (Done + Pending)
- ✅ Updated From address to authenticated subdomain
- ⏳ Update DMARC to `p=none` (manual step)
- ⏳ Remove failed link branding domains

### Phase 2: Monitor (1-2 weeks)
- Monitor DMARC reports at `hello@thoughtmarks.app`
- Check email delivery success rate
- Verify no spam complaints

### Phase 3: Tighten (After Monitoring)
Once emails consistently pass authentication:
```
v=DMARC1; p=reject; rua=mailto:hello@thoughtmarks.app; ruf=mailto:hello@thoughtmarks.app; pct=100; adkim=s; aspf=s
```

Changes:
- `p=reject` - Reject failed emails (maximum protection)
- `adkim=s` - Strict DKIM alignment
- `aspf=s` - Strict SPF alignment

---

## 📋 CHECKLIST

### Immediate Actions
- [x] Update backend From address to `hello@em1201.thoughtmarks.app`
- [x] Deploy backend to Fly.io
- [ ] **Update DMARC record** in Cloudflare DNS to `p=none` + relaxed alignment
- [ ] Remove failed link branding domains in SendGrid
- [ ] Test email delivery

### Verification
- [ ] Send test email to Gmail account
- [ ] Check inbox (should not be in spam)
- [ ] View email headers (verify SPF, DKIM, DMARC all pass)
- [ ] Verify no Gmail authentication warning

---

## 🔗 QUICK LINKS

- **Cloudflare DNS**: https://dash.cloudflare.com/ff4a53e6bc626ee548c280edfbb6aa16/thoughtmarks.app/dns/records
- **SendGrid Sender Auth**: https://app.sendgrid.com/settings/sender_auth
- **Backend Secrets**: `fly secrets list --app thoughtmarks-api`

---

## 📧 EMAIL AUTHENTICATION EXPLAINED

### The Email Authentication Trinity

**SPF** (Sender Policy Framework):
- Verifies sending server is authorized
- Status: ✅ Pass (SendGrid included)

**DKIM** (DomainKeys Identified Mail):
- Verifies email hasn't been tampered with
- Status: ✅ Pass (SendGrid DKIM configured)

**DMARC** (Domain-based Message Authentication):
- Checks SPF + DKIM alignment with From domain
- Status: ⚠️ **Failing** due to strict policy + domain mismatch

### Why Gmail Flagged It

1. From address: `hello@thoughtmarks.app`
2. SendGrid authenticated: `em1201.thoughtmarks.app`
3. DMARC checks: From domain (`thoughtmarks.app`) vs authenticated domain (`em1201.thoughtmarks.app`)
4. **Mismatch** + DMARC `p=quarantine` = **SPAM**

### The Fix

By using `hello@em1201.thoughtmarks.app` and DMARC `adkim=r` (relaxed):
- DKIM signature: `em1201.thoughtmarks.app` ✅
- From domain: `em1201.thoughtmarks.app` ✅
- **Perfect alignment** = ✅ Inbox delivery

---

**Status**: ✅ Backend fixed, ⏳ Awaiting DMARC DNS update  
**Next**: Update DMARC record, then test email delivery

