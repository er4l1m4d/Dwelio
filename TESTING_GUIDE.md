# Dwelio UI Revamp — Testing Guide
**Date:** April 6, 2026  
**Current Step:** 14 (Final QA) — Release Readiness

---

## Quick Start

### 1. Start Development Server
```powershell
cd "c:\Users\hp\Documents\my apps\dwelio"
npm run dev
```
Server will run at: `http://localhost:3000`

### 2. Build for Production
```powershell
npm run build
```
Verify static routes are generated: `/` and `/search`

### 3. Run Production Build Locally
```powershell
npm run build
npm start
```

---

## Manual Testing Checklist

### Home Page (`/`)
- [ ] Hero slideshow auto-advances
- [ ] Slide indicators clickable
- [ ] CTA buttons route correctly
- [ ] Featured listings load from Supabase
- [ ] Platform stats display correctly
- [ ] "How it works" section renders
- [ ] Problem cards layout properly
- [ ] Footer hidden on search page only

**Responsive checks:**
- [ ] 375px: Hero badges wrap, problem cards stack
- [ ] 768px: Problem cards 2-column
- [ ] 1024px+: Problem cards 4-column bento

### Search Page (`/search`)
- [ ] Listings load from Supabase
- [ ] Filters update URL params
- [ ] Quick filters toggle correctly
- [ ] Sidebar filters apply properly
- [ ] List/Map view toggle works
- [ ] Verified badge shows for verified landlords
- [ ] Active filter count updates
- [ ] Results count updates

**Responsive checks:**
- [ ] 375px: Sidebar stacks, pills wrap
- [ ] 768px: Sidebar stacks, map status pills stack
- [ ] 1024px+: Split-pane (320px sidebar + content)

### Listing Detail (`/listings/[id]`)
Pick a test listing ID from your database and visit `/listings/{id}`

- [ ] Gallery displays all images
- [ ] Gallery navigation works (thumbnails, prev/next)
- [ ] Video player loads (if video_url exists)
- [ ] Price displays correctly
- [ ] Landlord info loads
- [ ] Verified badge shows if landlord verified
- [ ] "Message Landlord" button present
- [ ] "Book This Home" routes to payment
- [ ] Amenities/features render
- [ ] Neighbourhood info displays

**Responsive checks:**
- [ ] 375px: Gallery full-width, content stacks
- [ ] 768px: Gallery + sticky sidebar
- [ ] 1024px+: Gallery main + thumbnail strip

### Payment/Checkout (`/payments/pay/[propertyId]`)
- [ ] Property details load
- [ ] Landlord info displays
- [ ] Agreement preview renders
- [ ] Tenant name field (requires auth)
- [ ] Paystack button configured
- [ ] Trust modules render
- [ ] Support contact info present

**Responsive checks:**
- [ ] 375px: Single column stack
- [ ] 768px: Main + sticky summary
- [ ] 1024px+: Split layout maintained

### Navigation & Footer
- [ ] Logo routes to home
- [ ] Nav links highlight active page
- [ ] "List Property" routes correctly
- [ ] Auth state toggles Sign In/Dashboard
- [ ] Messages icon shows unread badge (if authed)
- [ ] Notifications dropdown works (if authed)
- [ ] Footer links all route correctly
- [ ] Footer email links clickable

---

## Screenshot Capture Guide

### Tools
- **Chrome DevTools:** F12 → Toggle device toolbar (Ctrl+Shift+M)
- **Firefox DevTools:** F12 → Responsive Design Mode (Ctrl+Shift+M)

### Breakpoints to Capture
For each page (Home, Search, Listing Detail, Checkout):

1. **Mobile Small:** 375px × 667px (iPhone SE)
2. **Mobile Large:** 390px × 844px (iPhone 13)
3. **Tablet:** 768px × 1024px (iPad)
4. **Desktop Small:** 1024px × 768px
5. **Desktop Medium:** 1280px × 720px
6. **Desktop Large:** 1440px × 900px

### Screenshot Naming Convention
```
[page]_[state]_[width].png

Examples:
home_loaded_375px.png
search_filtered_1024px.png
listing_detail_gallery_768px.png
checkout_payment_ready_1280px.png
```

---

## Performance Testing

### Lighthouse Audit
```powershell
# Build production bundle
npm run build
npm start

# Then in Chrome:
# F12 → Lighthouse tab → Generate report
```

**Target Metrics:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Bundle Analysis
```powershell
# Check build output
npm run build

# Review output in terminal for:
# - Route segment sizes
# - First Load JS
# - Static vs dynamic routes
```

---

## Functional Flow Testing

### Flow 1: Search → Detail → Payment
1. Go to `/search`
2. Apply filters (e.g., "Rent", "3+ Beds", "Bodija")
3. Verify URL updates with params
4. Click a listing card
5. Verify listing detail loads
6. Click "Book This Home"
7. Verify payment page loads with correct data

### Flow 2: Message Landlord (Unauthenticated)
1. Go to `/listings/[id]` (logged out)
2. Click "Message Landlord"
3. Verify redirect to `/login?redirect=/messages/new?landlord=[id]&property=[id]`

### Flow 3: Search View Toggle
1. Go to `/search`
2. Click "Map View"
3. Verify URL updates: `?view=map`
4. Verify map component renders
5. Click "List View"
6. Verify URL updates (view param removed)
7. Verify list returns

### Flow 4: Quick Filters
1. Go to `/search`
2. Click "All Homes" → verify filters cleared
3. Click "Rent" → verify `?type=rent` in URL
4. Click "Under ₦1.5M" → verify `?maxPrice=1500000` added
5. Click "3+ Beds" → verify `?bedrooms=3` added
6. Verify active filter count updates
7. Verify results update

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through nav links (visible focus states)
- [ ] Tab through search filters
- [ ] Tab through listing cards
- [ ] Tab through gallery controls
- [ ] Enter/Space activates buttons
- [ ] Escape closes dropdowns

### Screen Reader Test (Optional)
```powershell
# Windows: Enable Narrator
Win + Ctrl + Enter

# Test:
# - Page landmarks announced
# - Headings hierarchy logical
# - Form labels read correctly
# - Button purposes clear
```

### Contrast Check
Use browser extension or manual check:
- Primary green on white: ✓ AAA
- Amber on light surface: ✓ AA (after darkening)
- Muted text: ✓ AA minimum

---

## Known Issues & Limitations

### Requires Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key (for map view)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_key (for payments)
```

### Test Data Required
- At least 3-5 properties in Supabase `properties` table
- At least 2 landlord profiles (1 verified, 1 unverified)
- Property images uploaded to Supabase storage

### Features Not Yet Implemented
- Dark mode (reference only)
- Mobile bottom navigation (excluded)
- Auth screen redesign (Step 15)
- Dashboard redesign (Step 15)

---

## Sign-Off Checklist

### Design Review
- [ ] Color palette matches approved mockups
- [ ] Typography hierarchy correct
- [ ] Spacing consistent (8px grid)
- [ ] Component styles unified
- [ ] Motion feels premium, not distracting
- [ ] No old theme remnants visible

### Product Review
- [ ] Core flows work end-to-end
- [ ] Trust indicators prominent (verified badges, escrow messaging)
- [ ] Copy aligns with "Find it. Trust it. Move in." vision
- [ ] Call-to-action hierarchy clear
- [ ] Error states handled gracefully

### Technical Review
- [ ] Build succeeds with no errors
- [ ] No TypeScript errors
- [ ] No console warnings in browser
- [ ] Performance acceptable (Lighthouse 90+)
- [ ] Accessibility compliant (WCAG AA)
- [ ] Responsive at all breakpoints

---

## Next Steps After Sign-Off

Once Step 14 is complete and all sign-offs obtained:

### Step 15: Follow-On Screens
Apply the design system to excluded screens:

1. **Auth Screens** (Priority 1)
   - `/login`
   - `/signup`
   - `/forgot-password`
   - `/reset-password`

2. **Dashboard** (Priority 2)
   - `/dashboard`
   - `/dashboard/earnings`

3. **Messages** (Priority 3)
   - `/messages`
   - `/messages/[conversationId]`

4. **Settings** (Priority 4)
   - `/settings`

5. **Other** (Priority 5)
   - `/onboarding`
   - `/agreements/[id]`
   - `/neighbourhoods`
   - Notifications full page (if needed)

---

**Current Status:** Ready for manual testing and stakeholder review.
**Blocking Items:** Screenshot capture, design sign-off, product sign-off.
**Timeline:** Steps 1-13 complete. Step 14 in final QA. Step 15 queued.
