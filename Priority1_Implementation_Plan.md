# Dwelio Priority 1 — Implementation Plan

## Objectives
1. **Verification System** — Enable NIN/BVN-based landlord identity verification via Dojah (PHP replacement)
2. **Property Listing Upgrade** — Complete the landlord listing flow with amenities, smart pricing, and better UX
3. **Google Maps Search Integration** — Real-time geocoded property locations with interactive map discoverability

---

## 🔍 Part 1: Verification System

### Where we are
- DB has `profiles.is_verified` and `profiles.nin_submitted` columns
- DB schema supports verification, but no UI/API for it exists
- No `verify` page, no verification API routes, no Dojah setup
- `ProfileCard`/`PropertyCard` components have a verified badge concept but it's honor-system only

### What we need

#### 1.1 — Verification database migrations
Extend schema so verification is auditable and recoverable:
- Add a `verifications` table: `id uuid, user_id uuid -> profiles, nin text, status (pending/approved/declined), dojah_reference text, admin_note text, submitted_at, reviewed_at`
- Add RLS policies for the new table

#### 1.2 — Verification landing / overview page
Route: `/verify`
- For logged-in users only (landlord check)
- Shows current verification status (pending/unverified/verified)
- Explains why verification matters (trust, badges, priority, payment eligibility)
- CTA to start or resume verification
- Status timeline component showing where user is in the process
- Edge cases: already-verified user sees celebration state, declined user sees retry path

#### 1.3 — NIN submission form (Step 1)
Route: `/verify/nin`
- Text input for NIN (11-digit Nigerian National Identification Number)
- Validation: 11 digits, numeric, not empty
- Information card explaining: what NIN is, why we need it, data handling policy
- Submit is a controlled action — user reviews NIN one final time before sending
- Edge cases: duplicate NIN detection, rate limiting on submit

#### 1.4 — Verification API route
Route: `/api/verify-nin`
- Receives `{ nin, userId }`
- Calls a Nigerian identity verification service (Dojah.io or VerifyMe.ng as fallback)
- If successful: creates `verifications` record with `status: pending`, updates `profiles.nin_submitted = true`
- If the service confirms the identity match instantly: sets `status: approved`, updates `profiles.is_verified = true`
- If the service is unavailable: still creates the record (pending), so an admin can review later
- RLS-protected: only the user can submit their own verification
- Error handling: service timeout → pending, invalid NIN → error, duplicate → error

#### 1.5 — Admin verification dashboard
Route: `/admin/verify`
- Protected by admin email env var (`ADMIN_EMAIL`)
- Table of pending verifications with: user name, NIN (masked), submitted date, Dojah match result
- Actions: Approve (sets is_verified), Decline with note
- Filter: pending only / all / approved / declined
- Simple but functional — no RBAC framework needed yet

#### 1.6 — Verified badge propagation
- `PropertyCard` already gets an `isVerified` prop — make it show badge prominently
- `SearchView` already maps `verifiedMap` — ensure it refreshes as landlords get verified
- Listing detail page: show verified landlord badge on landlord card
- Dashboard: show "Get Verified" prompt to unverified landlords with link to `/verify`

#### 1.7 — Signup → onboarding → verification flow
- After onboarding completes successfully, if role is `landlord`, add a prompt: "Get your landlord profile verified — it helps tenants trust your listings and unlocks priority placement."
- Not required to list (listings still work for unverified landlords) but gated for priority features.
- Also available from settings page and dashboard.

---

## 🏠 Part 2: Property Listing Upgrade

### Where we are
- Multi-step form at `/listings/new`: basic info → details → location → media → review
- Missing: amenities, proximity info, floor/unit details, pricing guidance, coords for map
- Form UX works but doesn't feel premium
- No draft/save-and-continue-later capability

### What we need

#### 2.1 — Database extension: property amenities
- Add `amenities` column to `properties`: `text[]` (arrays of amenity slugs)
- Amenity list (Ibadan-relevant): `water-supply`, `security`, `parking`, `generator`, `inverter`, `prepaid-meter`, `fenced`, `gated`, `wifi-ready`, `furnished`, `balcony`, `garden`, `borehole`, `washing-machine`, `ac`
- Add `latitude` and `longitude` columns: `numeric` (for real map coordinates)
- Add `floor` column: `text` (ground, first, second, etc.)
- Add `unit_count` column: `integer` (how many units in the building — for context)
- Add `draft` column: `boolean default false` (for save-and-continue-later)
- Migration SQL: single ALTER TABLE patch file

#### 2.2 — New listing form step: Amenities & Features (new Step 4)
Insert between current Step 3 (Location) and Step 4 (Media):
- Visual amenity chips/toggles with icons using Lucide icons we already have
- Grouped: Utilities (water, electricity variants), Security (fenced, gated, security guard), Comfort (furnished, AC, balcony, garden, wifi-ready), Parking & Access
- Counter showing how many selected
- Optional "Other amenities" free-text field (stored as custom amenity strings)

#### 2.3 — Location step upgrade
- Add coordinates capture: optional "Pin on map" button that opens a mini Google Maps picker — user drops a pin, we store lat/lng
- Fallback: if no pin, we can geocode the address later (but pin = authoritative)
- Show a map preview after pin is placed
- Add floor/unit fields (dropdown: Ground, 1st, 2nd, 3rd, Penthouse, Not applicable)

#### 2.4 — Smart pricing guidance
- On the Details step (Step 2), after price is entered, compare against neighbourhood averages from our data file
- Show a subtle notice: "Your price of ₦X is [above/below/within] the typical range for [neighbourhood] ([range]). [Advice line]"
- For sale listings: show different messaging
- Edge case: hide guidance until both price and neighbourhood are set

#### 2.5 — Draft / save-and-continue-later
- "Save as draft" button on every step (except review step)
- Drafts stored in Supabase with `draft: true`, viewable in dashboard under "Drafts" section
- Clicking a draft resumes from the step they left off
- Edge cases: draft expiration (auto-delete after some time), only one draft per landlord at a time

#### 2.6 — Form UX improvements
- Add a loading bar / progress indicator during image upload (already partially done)
- Better validation messages per field (inline, not just toast)
- Back button should preserve entered data (already works via state)
- Add keyboard shortcut hints (Enter to go next)
- Responsive: the form should feel native on mobile — full-width inputs, stacked layout

---

## 🗺️ Part 3: Google Maps Search Integration

### Where we are
- `@react-google-maps/api` is installed and Google Maps key is set
- `SearchMapView` exists but uses synthetic (randomized) positions — not real locations
- Map shows markers with price labels, click opens a popup card
- List/Map toggle works, URL-synced view param works
- Good fallback states for missing key, loading, and no results

### What we need

#### 3.1 — Geocode properties to real coordinates
- **When a property is listed**: if the landlord provided a pin → use that lat/lng. If not → geocode the address string (`{address}, {neighbourhood}, Ibadan, Oyo, Nigeria`) using Google Geocoding API and store lat/lng on the `properties` record.
- **API route**: `/api/geocode` — server-side geocoding to keep API key safe. Accepts address string, returns `{ lat, lng, formatted_address }`.
- **Migration**: backfill existing properties — one-time script that geocodes all properties without coordinates.

#### 3.2 — Real marker placement on map
- Update `SearchMapView` to use real `latitude`/`longitude` from properties instead of random offsets
- Keep the synthetic fallback for properties that somehow still lack coordinates (edge case)
- Auto-center map on the bounding box of all visible markers (fitBounds)
- When only one result: zoom in closer (zoom 15 instead of 12)

#### 3.3 — Enhanced map popup / info card
- Already mostly good — the popup card shows price, neighbourhood, title, beds/baths
- Add: verified landlord badge (green checkmark icon), property type icon, and a small thumbnail image
- Add distance indicator: "~X km from [nearest landmark]" using pre-computed distances

#### 3.4 — Landmark overlays
- Add key Ibadan landmarks as subtle reference points on the map: UI Campus, Bodija Market, Dugbe Market, Ring Road, Agodi Gardens, Mokola Roundabout, Challenge Roundabout
- Landmarks as small grey dots with label — non-interactive, just visual orientation
- Helps users understand where properties sit relative to known places

#### 3.5 — "Explore by neighbourhood" map mode
- When no filters are active but map is showing, render neighbourhood boundaries as semi-transparent polygons with labels
- Hovering a neighbourhood highlights it and shows: name, average rent range, property count in that area
- Clicking a neighbourhood sets it as a filter
- Uses a simple GeoJSON file for neighbourhood boundaries (approximate polygons — we'll create this)

#### 3.6 — Mobile map experience
- Map should be touch-friendly: pinch-to-zoom works (native), marker tap targets need to be large enough
- On mobile, the popup card should dock to the bottom of the screen (not floating over the map)
- "List View / Map View" toggle stays accessible at top of search

#### 3.7 — Performance optimization
- Cluster markers when zoomed out (optional — can use @react-google-maps/api's marker clustering or a simple manual approach)
- Lazy-load the map component — only load the Google Maps script when user switches to Map View
- Keep the current SSR-safe approach (loadError + !isLoaded states)

---

## 📦 Implementation Order

Given these are Priority 1 (core functionality / trust), we build in dependency order:

1. **Verification System** — foundational trust layer, no dependencies on other features
2. **Property Listing Upgrade** — depends on amenities fields (DB migration), independent of verification but benefits from it
3. **Google Maps Search Integration** — depends on lat/lng fields from listing upgrade, plus geocoding API

Within each part, we follow: **DB migration → API route → UI page/component → integration & edge cases**.

---

## 🧬 Technical Patterns (Consistency with existing codebase)

- **Client components**: `"use client"` directive, hooks, `useTransition` for pending states
- **Server data fetching**: `createSupabaseServerClient()` in async server components
- **API routes**: Next.js Route Handlers in `/app/api/*/route.ts`, `NextRequest`/`NextResponse`
- **Styling**: Tailwind with the project's design system (surface container tokens, primary-container green, editorial/panel shadows)
- **Error handling**: inline error banner pattern (`rounded-[1rem] bg-error-container px-4 py-3 text-sm`)
- **Loading states**: Tailwind `animate-pulse` skeleton pattern or explicit pending text
- **Brand colours**: primary green `#1A6B3A`, accent gold `#F4A623`, surface/on-surface tokens

---

## ✅ Success Criteria

- **Verification**: A landlord can visit `/verify`, submit their NIN, have it checked against a Nigerian ID service, and receive a verified badge visible across the platform
- **Listing**: A landlord can create a listing with amenities, a pinned map location, smart pricing guidance, and save drafts
- **Maps**: Properties appear at their real-world locations on a Google Map with neighbourhood context and landmark references