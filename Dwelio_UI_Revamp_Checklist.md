# Dwelio UI Revamp Checklist

> Purpose: use this checklist to execute the Dwelio visual revamp carefully and consistently across the app.
> Date: 2026-04-01
> Status: Planning / Pre-implementation

---

## 1. Source Of Truth

- [x] Confirm the approved design sources for the revamp:
  - `dwelio UI revamp/stitch/lush_heritage/DESIGN.md`
  - `dwelio UI revamp/stitch/dwelio_brand_identity_showcase_refined/code.html`
  - `dwelio UI revamp/stitch/dwelio_search_refined_branding/code.html`
  - `dwelio UI revamp/stitch/property_detail_refined_branding/code.html`
  - `dwelio UI revamp/stitch/dwelio_checkout_refined_branding/code.html`
- [x] Record what each approved design source controls:
  - `lush_heritage/DESIGN.md` = creative north star, surface rules, spacing, typography, and component philosophy
  - `dwelio_brand_identity_showcase_refined/code.html` = brand identity, palette, typography, logo presentation, and editorial tone
  - `dwelio_search_refined_branding/code.html` = discovery screen, split-pane search, filters, listing cards, and map treatment
  - `property_detail_refined_branding/code.html` = listing detail hierarchy, gallery layout, trust blocks, landlord section, and sticky pricing card
  - `dwelio_checkout_refined_branding/code.html` = secure checkout, booking summary, tenancy agreement area, payment panel, and trust/support modules
- [x] Lock the first-pass revamp scope to the screens that already have refined mockups:
  - global layout
  - home page
  - search / discovery
  - listing detail
  - payment / checkout
- [x] Record the exact phase-1 implementation scope:
  - global shell = `src/app/layout.tsx`, `src/components/NavBar.tsx`, `src/components/Footer.tsx`
  - home page = `src/app/page.tsx`
  - search / discovery = `src/app/search/page.tsx`, `src/components/search/SearchView.tsx`, `src/components/search/SearchSidebar.tsx`, `src/components/search/SearchResults.tsx`, `src/components/search/SearchMapView.tsx`, `src/components/PropertyCard.tsx`
  - listing detail = `src/app/listings/[id]/page.tsx`, `src/components/ImageGallery.tsx`, `src/components/messages/MessageLandlordButton.tsx`
  - payment / checkout = `src/app/payments/pay/[propertyId]/page.tsx`
- [x] Record the phase-1 exclusions so the revamp does not sprawl:
  - auth screens
  - dashboard screens
  - messages screens
  - settings
  - onboarding
  - agreements pages outside the checkout surface
  - notifications redesign beyond keeping current behavior intact
  - neighbourhoods page
  - admin / backoffice surfaces if introduced later
- [x] Decide whether the brand showcase is an internal reference only or a public page.
  - Decision: keep it as an internal reference only for phase 1. It should guide implementation, not ship as part of the public app yet.

---

## 2. Pre-Revamp Decisions

- [x] Choose one final brand name treatment and use it everywhere:
  - `Dwelio`
  - `Dwelio Heritage`
- [x] Record the chosen brand name treatment:
  - Decision: use `Dwelio` as the product brand across nav, footer, metadata, CTAs, and page copy.
  - Rule: treat `Heritage` as an editorial style reference only, not as the shipped product name.
- [ ] Choose one logo treatment and define where each version is used:
  - wordmark
  - icon-only mark
  - wordmark + icon lockup
- [x] Choose one logo treatment and define where each version is used:
  - Decision: use the wordmark + icon lockup for primary navigation and brand moments.
  - Decision: use the icon-only mark for compact contexts if a stable asset is created.
  - Decision: use the wordmark-only version as the fallback until the icon asset is fully production-ready.
- [x] Choose one icon system for production UI:
  - Material Symbols
  - Lucide
  - hybrid approach with rules
- [x] Record the chosen icon system:
  - Decision: use Material Symbols for the phase-1 revamp because the approved mockups rely on it heavily.
  - Rule: do not expand Lucide usage in the revamped surfaces unless a specific missing icon forces it.
- [x] Confirm whether dark mode is actually in scope or just present in the mockups.
  - Decision: dark mode is not in phase 1. Any dark-mode classes in mockups are reference-only for now.
- [x] Confirm whether the mobile bottom navigation from the search mockup is in scope.
  - Decision: mobile bottom navigation is out of scope for phase 1. Keep mobile navigation within the existing top-nav flow unless we explicitly design the app shell later.
- [x] Confirm whether the "Heritage / premium editorial" tone applies to the whole app or only selected surfaces.
  - Decision: apply this tone to the phase-1 customer-facing surfaces only: global shell, home, search, listing detail, and checkout.
  - Rule: do not force this tone onto dashboard, settings, or utility surfaces until those screens are redesigned.

---

## 3. Shared Design System

### Brand Foundations

- [x] Replace the current default app typography with the approved brand typography:
  - headline: `Epilogue`
  - body: `Manrope`
- [x] Update `src/app/layout.tsx` to load and expose the chosen font tokens.
- [x] Define shared color tokens based on the approved palette:
  - forest green
  - amber gold
  - surface / surface-container scale
  - outline / muted text scale
  - trust / error / success states
- [ ] Move repeated one-off colors into reusable theme variables or Tailwind tokens.
- [x] Define a reusable radius scale that matches the mockups.
- [x] Define shared shadow recipes for:
  - editorial cards
  - sticky sidebars
  - floating CTA buttons
  - glass / blur surfaces
- [x] Verify the shared design-system foundation builds successfully.

### Reusable UI Rules

- [ ] Standardize container widths across marketing and app pages.
- [ ] Standardize section spacing for desktop and mobile.
- [ ] Standardize button styles:
  - primary dark green CTA
  - light surface secondary CTA
  - text-only nav action
  - icon-only circular button
- [ ] Standardize pill / chip styles for:
  - verified
  - AI match
  - listing type
  - neighbourhood tags
- [ ] Standardize card styles for:
  - listing cards
  - trust cards
  - feature bento cards
  - payment summary cards
- [ ] Standardize hover, pressed, and focus states so they feel consistent.

### Shared Files To Touch

- [ ] `src/app/layout.tsx`
- [ ] `src/components/NavBar.tsx`
- [ ] `src/components/Footer.tsx`
- [ ] `src/components/PropertyCard.tsx`
- [ ] `src/components/ImageGallery.tsx`
- [ ] `src/components/skeletons/SearchGridSkeleton.tsx`
- [ ] `src/components/skeletons/PropertyCardSkeleton.tsx`
- [ ] `src/components/skeletons/ListingDetailSkeleton.tsx`

---

## 4. Global Shell Revamp

### Navigation

- [x] Restyle `src/components/NavBar.tsx` to match the approved top bar:
  - clean glass / blurred background
  - stronger wordmark presence
  - refined nav labels
  - premium primary CTA
- [x] Replace placeholder / inconsistent nav links with the real intended IA.
- [x] Add active state styling for the current route.
- [x] Keep authentication, notifications, and messages behavior intact after the visual update.
- [x] Make sure desktop and mobile nav variants feel like the same product.

### Footer

- [x] Restyle `src/components/Footer.tsx` to match the new editorial brand language.
- [x] Align footer sections with current product IA and remove dead or fake links where possible.
- [x] Decide whether the footer should be hidden on specific app-heavy screens like search.
  - Decision: hide the footer on `/search` in phase 1 to preserve the focused discovery layout.

---

## 5. Home Page Revamp

### Target File

- [ ] `src/app/page.tsx`

### Checklist

- [x] Replace the current generic hero with the approved premium editorial hero direction.
- [x] Add the stronger tagline hierarchy: `Find it. Trust it. Move in.`
- [x] Upgrade the hero search module to match the refined brand treatment.
- [x] Rework "featured listings" into the more editorial verified-grid style.
- [x] Rebuild "how it works" into the bento-card format from the mockups.
- [x] Rework the problem / trust story section to better reflect the product vision.
- [x] Rebuild the landlord CTA section with the stronger full-width branded treatment.
- [x] Keep the page grounded in Ibadan-first positioning and trust-first messaging.
- [x] Remove placeholder-sounding copy that feels generic or template-like.

---

## 6. Search / Discovery Revamp

### Target Files

- [ ] `src/app/search/page.tsx`
- [ ] `src/components/search/SearchView.tsx`
- [ ] `src/components/search/SearchSidebar.tsx`
- [ ] `src/components/search/SearchResults.tsx`
- [ ] `src/components/search/SearchMapView.tsx`
- [ ] `src/components/PropertyCard.tsx`

### Checklist

- [x] Move the search screen closer to the approved split-pane discovery layout.
- [x] Rework the page header into the branded "Discovery" experience.
- [x] Introduce the horizontal filter-chip row from the design where it improves usability.
- [x] Refine the filter sidebar styling without breaking current query-param behavior.
- [x] Make the list / map view switch feel native to the screen instead of bolted on.
- [x] Restyle map markers to reflect listing prices and active state more clearly.
- [x] Restyle listing cards to match the visual direction:
  - large image first
  - stronger title / price hierarchy
  - verified badge
  - favorite action
  - richer metadata row
- [x] Decide whether "AI Match" appears now or only when recommendation logic is real.
  - Decision: omit AI Match in phase 1 until recommendation logic is real enough to justify the UI.
- [x] Add an intentional empty state that matches the new design system.
- [x] Make sure the mobile search experience does not become cramped or over-layered.

---

## 7. Listing Detail Revamp

### Target Files

- [ ] `src/app/listings/[id]/page.tsx`
- [ ] `src/components/ImageGallery.tsx`
- [ ] `src/components/messages/MessageLandlordButton.tsx`

### Checklist

- [x] Rework the listing detail page to match the approved visual hierarchy.
- [x] Add or refine the breadcrumb row if it helps orientation.
- [x] Replace the current gallery with the more premium collage-style presentation.
- [x] Preserve video support while making it visually consistent with the gallery.
- [x] Upgrade the title, location, and stat row hierarchy.
- [x] Split content into clearer sections:
  - narrative / description
  - property highlights
  - trust indicators
  - landlord profile
- [x] Introduce the trust block for verified listing / legal readiness if supported by real data.
- [x] Rebuild the sidebar into a sticky pricing / action card.
- [x] Include pricing breakdown, escrow framing, and direct messaging CTA.
- [x] Add a mini-map or location summary treatment if the data is available.
- [x] Keep all existing behavior working:
  - listing fetch
  - view count update
  - landlord lookup
  - message landlord flow

---

## 8. Payment / Checkout Revamp

### Target File

- [ ] `src/app/payments/pay/[propertyId]/page.tsx`

### Checklist

- [x] Reframe the page as a secure checkout / tenancy completion experience.
- [x] Replace the simple payment card with the approved two-column summary + payment layout.
- [x] Add a richer booking summary with:
  - property snapshot
  - landlord summary
  - rent breakdown
- [x] Add a tenancy agreement presentation area.
- [x] Decide whether digital signature is visual-only for now or tied to real agreement flow.
  - Decision: keep the signature area visible in phase 1 as a visual preview only.
  - Rule: final agreement execution still continues in the dedicated agreement flow after payment confirmation.
- [x] Keep Paystack integration intact while upgrading the payment option UI.
- [x] Clearly separate:
  - rent amount
  - service fee
  - caution / escrow fees
  - total payable
- [x] Add trust-supporting UI:
  - escrow explanation
  - support contact module
  - no-hidden-fees reassurance
- [x] Ensure loading, error, and missing-key states still look deliberate after the redesign.

---

## 9. Copy And Content Consistency

- [x] Audit all updated screens for one consistent tone: warm, trustworthy, modern, proudly Nigerian.
- [x] Use one consistent terminology set for actions and labels:
  - Discover vs Browse
  - Verified Homes vs Verified Listings
  - Secure with Escrow vs Pay Now
  - List Property vs List Your Property
- [x] Remove leftover placeholder brand names, cities, and fake links that conflict with Dwelio's Ibadan-first focus.
- [x] Make sure pricing labels reflect real product logic:
  - monthly
  - yearly
  - service charge
  - caution fee
  - escrow
- [x] Make sure all static examples feel Nigerian and match the product vision.

---

## 10. Interaction And Motion

- [x] Add subtle, intentional hover states instead of generic scaling everywhere.
- [x] Use motion sparingly on:
  - cards
  - image zoom
  - CTA emphasis
  - sticky panels
- [x] Keep blur, glass, and shadow effects performant on lower-end devices.
- [x] Ensure transitions do not interfere with keyboard focus or touch interactions.

---

## 11. Responsive Review

Code pass note:
- Hero badges now wrap more safely on narrow widths.
- Homepage problem-card mosaic now stacks on mobile before shifting to two columns.
- Search map status pills now stack on small screens instead of competing for the same top row.

- [ ] Review all updated screens at:
  - 360px
  - 390px
  - 768px
  - 1024px
  - 1280px
  - 1440px
- [ ] Verify that hero sections do not collapse awkwardly on small screens.
- [ ] Verify search filters remain usable on mobile.
- [ ] Verify listing cards keep readable price and metadata hierarchy on tablet.
- [ ] Verify sticky sidebars gracefully become stacked sections on mobile.
- [ ] Verify gallery layouts degrade cleanly on narrow widths.
- [ ] Verify footer remains readable and not overcrowded on small screens.

---

## 12. Accessibility Checklist

Code pass note:
- Contrast was tightened for amber-on-light usage by darkening `on-tertiary-container`.
- Nav menus, notifications, search toggles, slide indicators, and payment error states now expose clearer accessibility semantics.

- [x] Check color contrast for green, amber, and muted text combinations.
- [x] Ensure all icon-only buttons have accessible labels.
- [x] Ensure keyboard navigation works for nav, filters, gallery controls, and payment actions.
- [x] Ensure focus states are visible and consistent.
- [x] Ensure headings follow a logical hierarchy on each page.
- [x] Ensure links and buttons are visually distinct.
- [x] Ensure form controls have labels and helpful error states.

---

## 13. Performance And Implementation Safety

- [ ] Avoid importing unnecessary font weights.
- [x] Prefer Next.js image optimization where practical.
- [x] Avoid shipping huge background images without optimization.
- [x] Keep the map view from blocking first meaningful paint for list-first users.
- [x] Ensure skeletons and loading states match the new UI instead of flashing the old style.
- [x] Check that the global redesign does not accidentally regress auth or messaging flows.

---

## 14. Final QA And Sign-Off

### Functional QA

- [ ] Home page still loads with live listing data.
- [ ] Search filters still update URL params correctly.
- [ ] Search map still loads with valid Google Maps key.
- [ ] Listing detail still loads images, video, and landlord data correctly.
- [ ] Payment screen still records successful Paystack payments.
- [ ] Navigation and footer links still route correctly.

### Visual QA

- [ ] Nav, footer, cards, pills, and buttons all look like one system.
- [ ] Fonts, colors, radius, and shadows are consistent across screens.
- [ ] No screen still looks like the old theme after the revamp.
- [ ] No obvious mismatch remains between marketing pages and app pages.

### Content QA

- [ ] Copy is consistent with the product vision.
- [ ] No lorem ipsum, template copy, or confusing placeholders remain.
- [ ] No conflicting brand expressions remain.

### Release Readiness

- [ ] Capture before / after screenshots for:
  - home
  - search
  - listing detail
  - checkout
- [ ] Get design sign-off.
- [ ] Get product sign-off.
- [ ] Get final implementation sign-off before continuing to auth, dashboard, messages, and settings.

---

## 15. Follow-On Screens After Phase 1

- [ ] Auth screens
- [ ] Dashboard
- [ ] Messages
- [ ] Agreements
- [ ] Notifications
- [ ] Settings
- [ ] Onboarding

---

## File Mapping Summary

- Global shell:
  - `src/app/layout.tsx`
  - `src/components/NavBar.tsx`
  - `src/components/Footer.tsx`
- Home:
  - `src/app/page.tsx`
- Search:
  - `src/app/search/page.tsx`
  - `src/components/search/SearchView.tsx`
  - `src/components/search/SearchSidebar.tsx`
  - `src/components/search/SearchResults.tsx`
  - `src/components/search/SearchMapView.tsx`
  - `src/components/PropertyCard.tsx`
- Listing detail:
  - `src/app/listings/[id]/page.tsx`
  - `src/components/ImageGallery.tsx`
- Checkout:
  - `src/app/payments/pay/[propertyId]/page.tsx`
