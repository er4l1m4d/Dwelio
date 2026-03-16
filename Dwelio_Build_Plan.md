# 🏠 DWELIO — Complete Vibe-Coding Build Plan
### Ibadan Launch Edition | v1.0 | March 2026

> **How to use this document:**
> Work through each phase in order. Do NOT skip ahead. Each phase builds on the last.
> Check off every task as you complete it. When an entire phase is done, celebrate — then move on.
> For each task, a **"How to do it"** note tells you exactly what to prompt your AI coding tool with or what steps to follow.

---

## 🗂️ Quick Overview

| Phase | Name | Weeks | Goal |
|-------|------|-------|------|
| **0** | Project Setup | Week 1 | Get your dev environment running |
| **1** | Auth & Profiles | Week 2 | Users can sign up and log in |
| **2** | Listings | Weeks 3–4 | Landlords can post properties |
| **3** | Search & Discovery | Weeks 5–6 | Tenants can find properties |
| **4** | Trust Layer | Week 7 | Verification, reviews, ratings |
| **5** | Communication | Week 8 | In-app messaging |
| **6** | Payments | Weeks 9–11 | Monthly rent via Paystack |
| **7** | Legal Docs | Week 12 | Tenancy agreement generator |
| **8** | AI & Insights | Weeks 13–14 | Smart recommendations |
| **9** | Polish & Launch | Weeks 15–16 | Bug fixes, SEO, beta launch |

---

---

# PHASE 0 — Project Setup
### 🎯 Goal: Have a working Next.js app connected to Supabase, deployed on Vercel.

---

### 0.1 — Install Your Tools

- [x] **Install Node.js (v18+)**
  > **How:** Go to [nodejs.org](https://nodejs.org) and download the LTS version. Run `node -v` in your terminal to confirm it installed.

- [x] **Install VS Code**
  > **How:** Download from [code.visualstudio.com](https://code.visualstudio.com). Install the extensions: **Tailwind CSS IntelliSense**, **Prettier**, and **ES7+ React Snippets**.

- [x] **Install Git**
  > **How:** Download from [git-scm.com](https://git-scm.com). Run `git --version` to confirm. Then run `git config --global user.name "Your Name"` and `git config --global user.email "you@email.com"`.

- [ ] **Create a GitHub account**
  > **How:** Go to [github.com](https://github.com) and sign up. This is where your code will live and where Vercel pulls from to deploy.

---

### 0.2 — Create Your Next.js Project

- [x] **Scaffold the Next.js app**
  > **How:** Open your terminal and run:
  > ```bash
  > npx create-next-app@latest dwelio --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  > cd dwelio
  > ```
  > When prompted, say **Yes** to all options. This gives you TypeScript + Tailwind out of the box.

- [x] **Install core dependencies**
  > **How:** Run this in your project folder:
  > ```bash
  > npm install @supabase/supabase-js @supabase/ssr lucide-react clsx
  > ```

- [ ] **Test that the app runs locally**
  > **How:** Run `npm run dev` and open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Next.js welcome page.

---

### 0.3 — Set Up Supabase (Your Backend)

- [x] **Create a Supabase account and project**
  > **How:** Go to [supabase.com](https://supabase.com), sign up, click **New Project**. Name it `dwelio`. Choose the **Frankfurt** region (closest to Nigeria). Save your database password somewhere safe.

- [x] **Copy your Supabase credentials**
  > **How:** In your Supabase dashboard go to **Settings → API**. Copy the `Project URL` and `anon public` key.

- [x] **Add credentials to your project as environment variables**
  > **How:** Create a file called `.env.local` in the root of your project and add:
  > ```
  > NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
  > NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
  > ```

- [x] **Create the Supabase client utility file**
  > **How:** Prompt your AI tool:
  > *"Create a Supabase client utility in `/src/lib/supabase.ts` for a Next.js 14 App Router project using `@supabase/ssr`. Include both a browser client and a server client."*

---

### 0.4 — Set Up Your Database Schema

- [x] **Create the `profiles` table**
  > **How:** In Supabase, go to **SQL Editor** and run:
  > ```sql
  > create table profiles (
  >   id uuid references auth.users on delete cascade primary key,
  >   full_name text,
  >   phone text,
  >   role text check (role in ('landlord', 'tenant', 'buyer')),
  >   avatar_url text,
  >   is_verified boolean default false,
  >   nin_submitted boolean default false,
  >   created_at timestamp with time zone default now()
  > );
  > alter table profiles enable row level security;
  > ```

- [x] **Create the `properties` table**
  > **How:** Run in SQL Editor:
  > ```sql
  > create table properties (
  >   id uuid default gen_random_uuid() primary key,
  >   landlord_id uuid references profiles(id) on delete cascade,
  >   title text not null,
  >   description text,
  >   type text check (type in ('rent', 'sale')),
  >   property_type text check (property_type in ('flat', 'house', 'room', 'duplex', 'bungalow', 'land')),
  >   price integer not null,
  >   price_period text check (price_period in ('monthly', 'yearly')),
  >   bedrooms integer,
  >   bathrooms integer,
  >   address text,
  >   neighbourhood text,
  >   city text default 'Ibadan',
  >   state text default 'Oyo',
  >   images text[],
  >   video_url text,
  >   is_available boolean default true,
  >   is_featured boolean default false,
  >   views integer default 0,
  >   created_at timestamp with time zone default now()
  > );
  > alter table properties enable row level security;
  > ```

- [x] **Create the `reviews` table**
  > **How:** Run in SQL Editor:
  > ```sql
  > create table reviews (
  >   id uuid default gen_random_uuid() primary key,
  >   reviewer_id uuid references profiles(id),
  >   reviewed_id uuid references profiles(id),
  >   property_id uuid references properties(id),
  >   rating integer check (rating between 1 and 5),
  >   comment text,
  >   created_at timestamp with time zone default now()
  > );
  > alter table reviews enable row level security;
  > ```

- [x] **Create the `messages` table**
  > **How:** Run in SQL Editor:
  > ```sql
  > create table messages (
  >   id uuid default gen_random_uuid() primary key,
  >   sender_id uuid references profiles(id),
  >   receiver_id uuid references profiles(id),
  >   property_id uuid references properties(id),
  >   content text not null,
  >   is_read boolean default false,
  >   created_at timestamp with time zone default now()
  > );
  > alter table messages enable row level security;
  > ```

- [x] **Create the `payments` table**
  > **How:** Run in SQL Editor:
  > ```sql
  > create table payments (
  >   id uuid default gen_random_uuid() primary key,
  >   tenant_id uuid references profiles(id),
  >   landlord_id uuid references profiles(id),
  >   property_id uuid references properties(id),
  >   amount integer not null,
  >   status text check (status in ('pending', 'paid', 'failed', 'in_escrow', 'released')),
  >   paystack_reference text,
  >   payment_month date,
  >   created_at timestamp with time zone default now()
  > );
  > alter table payments enable row level security;
  > ```

- [x] **Create the `tenancy_agreements` table**
  > **How:** Run in SQL Editor:
  > ```sql
  > create table tenancy_agreements (
  >   id uuid default gen_random_uuid() primary key,
  >   tenant_id uuid references profiles(id),
  >   landlord_id uuid references profiles(id),
  >   property_id uuid references properties(id),
  >   start_date date,
  >   end_date date,
  >   monthly_rent integer,
  >   terms text,
  >   tenant_signed boolean default false,
  >   landlord_signed boolean default false,
  >   created_at timestamp with time zone default now()
  > );
  > alter table tenancy_agreements enable row level security;
  > ```

---

### 0.5 — Set Up Row Level Security (RLS) Policies

- [x] **Add RLS policies so users can only access their own data**
  > **How:** Prompt your AI tool:
  > *"Write Supabase SQL Row Level Security policies for these tables: `profiles`, `properties`, `reviews`, `messages`, `payments`, `tenancy_agreements`. Rules: users can read their own profile and update it. Anyone can read available properties. Only the landlord who owns a property can update or delete it. Only the sender or receiver can see messages. Only the tenant or landlord involved can see payments and agreements."*
  > Then run the generated SQL in the Supabase SQL Editor.

---

### 0.6 — Set Up Supabase Storage

- [x] **Create storage buckets for images and videos**
  > **How:** In Supabase go to **Storage → New Bucket**. Create two buckets:
  > - `property-images` — toggle **Public** ON
  > - `property-videos` — toggle **Public** ON
  >
  > Then go to **Storage → Policies** and add a policy allowing authenticated users to upload to both buckets.

---

### 0.7 — Deploy to Vercel

- [x] **Push your project to GitHub**
  > **How:**
  > ```bash
  > git init
  > git add .
  > git commit -m "Initial Dwelio project setup"
  > git branch -M main
  > git remote add origin https://github.com/YOUR_USERNAME/dwelio.git
  > git push -u origin main
  > ```

- [x] **Connect to Vercel and deploy**
  > **How:** Go to [vercel.com](https://vercel.com), sign in with GitHub, click **New Project**, import your `dwelio` repo. Add your environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings. Click **Deploy**.

- [x] **Confirm live deployment works**
  > **How:** Visit your `.vercel.app` URL. It should load the app. From now on, every `git push` to `main` automatically redeploys.

---

---

# PHASE 1 — Authentication & User Profiles
### 🎯 Goal: Users can sign up, log in, and set their role (landlord / tenant / buyer).

---

### 1.1 — Build the Auth Pages

- [x] **Build the Sign Up page**
  > **How:** Prompt your AI tool:
  > *"Build a Next.js Sign Up page at `/app/signup/page.tsx` using Supabase Auth. The form should collect: full name, email, password, phone number, and role (landlord, tenant, or buyer — shown as card options, not a dropdown). Use Tailwind CSS. On success, redirect to `/onboarding`. Brand colours: primary green `#1A6B3A`, accent gold `#F4A623`."*

- [x] **Build the Login page**
  > **How:** Prompt your AI tool:
  > *"Build a Next.js Login page at `/app/login/page.tsx` using Supabase Auth email/password sign-in. Include a 'Forgot password' link. On success redirect to `/dashboard`. Same brand colours."*

- [x] **Build the Forgot Password + Reset flow**
  > **How:** Prompt your AI tool:
  > *"Build a forgot password flow for a Next.js Supabase app. Page 1: user enters email, Supabase sends reset link. Page 2 (at `/reset-password`): user sets new password using the token from the URL. Use Tailwind."*

- [x] **Protect routes with a middleware auth check**
  > **How:** Prompt your AI tool:
  > *"Create a `middleware.ts` file in the root of a Next.js 14 App Router project using `@supabase/ssr` that protects the following routes: `/dashboard`, `/listings/new`, `/messages`, `/payments`. Unauthenticated users should be redirected to `/login`."*

---

### 1.2 — Build the Onboarding Flow

- [x] **Build the onboarding page (post sign-up profile completion)**
  > **How:** Prompt your AI tool:
  > *"Build an onboarding page at `/app/onboarding/page.tsx`. After sign up, ask the user to upload a profile photo and confirm their phone number. Save this data to the Supabase `profiles` table. On completion, redirect to `/dashboard`. Use Tailwind."*

---

### 1.3 — Build User Profile Pages

- [x] **Build the public profile page (visible to others)**
  > **How:** Prompt your AI tool:
  > *"Build a public profile page at `/app/profile/[id]/page.tsx` in Next.js. Fetch the user's profile from Supabase `profiles` table by ID. Display: name, photo, role badge (Landlord / Tenant), verified badge if `is_verified` is true, average rating, and their reviews. For landlords, also show their active listings."*

- [x] **Build the private settings/edit profile page**
  > **How:** Prompt your AI tool:
  > *"Build a profile settings page at `/app/settings/page.tsx`. Allow the logged-in user to update: full name, phone number, profile photo. Fetch current values from Supabase and save updates back. Use Tailwind."*

---

---

# PHASE 2 — Property Listings
### 🎯 Goal: Landlords can create, edit, and manage property listings with photos and video.

---

### 2.1 — Build the Create Listing Form

- [x] **Build the multi-step listing creation form**
  > **How:** Prompt your AI tool:
  > *"Build a multi-step property listing form at `/app/listings/new/page.tsx` in Next.js with Tailwind. Step 1: Basic info (title, description, property type, listing type — rent or sale). Step 2: Details (bedrooms, bathrooms, price, price period). Step 3: Location (address, neighbourhood — include a dropdown of Ibadan neighbourhoods: Bodija, Samonda, Agodi GRA, Mokola, Ring Road, Challenge, Dugbe, Ajibode, Agbowo, UI Campus, Iwo Road, New Bodija). Step 4: Media (upload up to 10 photos and one video). Step 5: Review and submit. Save to Supabase `properties` table. Photos upload to Supabase Storage `property-images` bucket."*

- [x] **Add image upload with preview**
  > **How:** Prompt your AI tool:
  > *"Add drag-and-drop image upload to a Next.js form. Images should preview in a grid before uploading. Each image can be removed. On submit, upload all images to Supabase Storage `property-images` bucket and return their public URLs to store in the `properties` table `images` array field."*

- [x] **Add video upload for virtual tours**
  > **How:** Prompt your AI tool:
  > *"Add a video file upload input to a Next.js form. Accept MP4 and MOV under 200MB. Show a progress bar during upload. Upload to Supabase Storage `property-videos` bucket. Store the public URL in the `video_url` field of the properties table."*

---

### 2.2 — Build the Listing Detail Page

- [x] **Build the single property listing page**
  > **How:** Prompt your AI tool:
  > *"Build a property detail page at `/app/listings/[id]/page.tsx` in Next.js. Fetch the property from Supabase by ID. Display: image gallery (swipeable), video player if video_url exists, property title, price, badge (For Rent / For Sale), bedrooms, bathrooms, location, description, landlord card (photo, name, verified badge, rating, link to their profile). Include a 'Message Landlord' button and a 'Save Property' button. Track views by incrementing the `views` column on page load. Use Tailwind."*

- [x] **Build the image gallery / slideshow component**
  > **How:** Prompt your AI tool:
  > *"Build a full-width image gallery component in React/Tailwind. It should show a large main image with thumbnail strip below. Clicking a thumbnail updates the main image. Add left/right arrow navigation. Show image count (e.g. 1/8)."*

---

### 2.3 — Build the Landlord Dashboard

- [x] **Build the landlord listings management dashboard**
  > **How:** Prompt your AI tool:
  > *"Build a landlord dashboard page at `/app/dashboard/page.tsx`. For users with role `landlord`, show: a list of their properties fetched from Supabase, each with a card showing title, photo, price, status (Available / Rented), views count, and inquiry count. Include buttons to Edit, Mark as Rented, and Delete each listing. Show a prominent 'Add New Listing' button at the top."*

- [x] **Build the edit listing page**
  > **How:** Prompt your AI tool:
  > *"Build an edit listing page at `/app/listings/[id]/edit/page.tsx`. Pre-fill a form with existing property data fetched from Supabase. Allow the landlord to update any field. On save, update the record in Supabase. Only the owner of the listing should be able to access this page."*

---

---

# PHASE 3 — Search & Discovery
### 🎯 Goal: Tenants can search, filter, and browse properties on a map.

---

### 3.1 — Build the Search Page

- [x] **Build the main search/listings page**
  > **How:** Prompt your AI tool:
  > *"Build a property search page at `/app/search/page.tsx` in Next.js. Fetch all available properties from Supabase `properties` table. Display as a responsive grid of property cards. Each card shows: main image, title, price, neighbourhood, bedrooms, bathrooms, verified landlord badge, listing type badge (Rent/Sale). Add a search bar at the top and filter sidebar with: Listing Type (Rent/Sale), Property Type (Flat/House/Room/Duplex/Bungalow), Neighbourhood (Ibadan list), Min/Max Price, Bedrooms. Filters should update results in real time. Use Tailwind."*

- [x] **Build the property card component**
  > **How:** Prompt your AI tool:
  > *"Build a reusable `PropertyCard` component in React/Tailwind. Props: image, title, price, pricePeriod, neighbourhood, bedrooms, bathrooms, isVerified (show green verified badge), listingType (Rent/Sale badge). Card should have a hover shadow effect and link to the listing detail page."*

- [x] **Add URL-based search params so filters are shareable**
  > **How:** Prompt your AI tool:
  > *"Update the search page to store all active filters (type, neighbourhood, minPrice, maxPrice, bedrooms) as URL query parameters using Next.js `useSearchParams` and `useRouter`. When the page loads, read filters from the URL and apply them. This makes filtered searches shareable via link."*

---

### 3.2 — Build the Map View

- [x] **Install and set up Google Maps**
  > **How:** Go to [console.cloud.google.com](https://console.cloud.google.com), create a project, enable the **Maps JavaScript API** and **Geocoding API**. Get your API key. Add it to `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_KEY`. Then run:
  > ```bash
  > npm install @react-google-maps/api
  > ```

- [x] **Build the map view of listings**
  > **How:** Prompt your AI tool:
  > *"Add a map view toggle to the search page using `@react-google-maps/api`. When the user switches to Map View, show a Google Map centred on Ibadan (lat: 7.3775, lng: 3.9470). Place a custom marker for each property. Clicking a marker shows a small popup card with the property photo, title, price, and a 'View' button. Use the Google Maps API key from `NEXT_PUBLIC_GOOGLE_MAPS_KEY`."*

---

### 3.3 — Build the Landing / Home Page

- [x] **Build the marketing landing page**
  > **How:** Prompt your AI tool:
  > *"Build a landing page at `/app/page.tsx` for a Nigerian property marketplace called Dwelio. Sections: (1) Hero — headline 'Find Your Home in Ibadan, Without the Wahala', search bar with location and property type, CTA buttons 'Browse Listings' and 'List Your Property'. (2) How It Works — 3 steps: Search, Verify, Move In. (3) Featured listings — pull 6 latest properties from Supabase. (4) Why Dwelio — cards for: No Agent Fees, Verified Landlords, Monthly Rent Payments, Virtual Tours. (5) Stats bar — properties listed, verified landlords, happy tenants. (6) CTA section. Brand colours: green `#1A6B3A`, gold `#F4A623`. Make it look premium and modern."*

---

---

# PHASE 4 — Trust Layer
### 🎯 Goal: Landlords get verified. Tenants can leave reviews. The platform feels safe.

---

### 4.1 — Landlord Verification

- [ ] **Integrate Dojah for NIN/BVN verification**
  > **How:** Sign up at [dojah.io](https://dojah.io). Get your API key. Add to `.env.local` as `DOJAH_API_KEY`. Then prompt your AI tool:
  > *"Build a landlord verification flow in Next.js. Page at `/app/verify/page.tsx`. The user enters their NIN (National Identification Number). On submit, call the Dojah NIN lookup API from a Next.js API route (`/app/api/verify-nin/route.ts`). If successful, update the user's `is_verified` field in Supabase `profiles` to `true` and set `nin_submitted` to `true`. Show a success state."*

- [ ] **Show verified badge on listings and profiles**
  > **How:** Prompt your AI tool:
  > *"Create a reusable `VerifiedBadge` component in React/Tailwind. It shows a small green checkmark icon with the text 'Verified Landlord'. Add it to the PropertyCard component, the listing detail page landlord section, and the public profile page — only when `is_verified` is `true`."*

- [ ] **Add a manual verification admin fallback**
  > **How:** Prompt your AI tool:
  > *"Create a simple admin page at `/app/admin/verify/page.tsx` (protected — only accessible to an admin email set in env vars). Show a table of all users where `nin_submitted` is true but `is_verified` is false. Add a 'Verify' button next to each user that sets `is_verified` to true in Supabase. This is the manual fallback if Dojah integration has issues."*

---

### 4.2 — Reviews & Ratings

- [x] **Build the review submission form**
  > **How:** Prompt your AI tool:
  > *"Build a review submission component in React/Tailwind. Props: `reviewedUserId`, `propertyId`. Shows a 5-star rating selector (clickable stars) and a text comment box. On submit, insert a row into the Supabase `reviews` table with `reviewer_id`, `reviewed_id`, `property_id`, `rating`, and `comment`. Only show the form if the logged-in user has an active tenancy agreement with this landlord (check `tenancy_agreements` table)."*

- [x] **Display reviews on profile pages**
  > **How:** Prompt your AI tool:
  > *"Build a `ReviewsList` component that fetches and displays reviews for a given user ID from the Supabase `reviews` table. Show each review with: star rating (rendered as filled/empty stars), comment, reviewer name and photo, and date. Calculate and display the average rating at the top."*

---

---

# PHASE 5 — In-App Messaging
### 🎯 Goal: Tenants and landlords can chat directly inside the platform.

---

### 5.1 — Build the Messaging System

- [x] **Build the messages inbox page**
  > **How:** Prompt your AI tool:
  > *"Build a messages inbox page at `/app/messages/page.tsx` in Next.js. Fetch all conversations for the logged-in user from Supabase `messages` table, grouped by the other user and property. Show a list of conversations with: other user's photo and name, property title, last message preview, timestamp, and an unread indicator dot. Clicking a conversation opens the chat view."*

- [x] **Build the real-time chat view**
  > **How:** Prompt your AI tool:
  > *"Build a real-time chat component at `/app/messages/[conversationId]/page.tsx` using Supabase Realtime. Fetch message history between two users for a specific property. Display messages in a chat bubble UI (sent messages on the right in green, received on the left in grey). New messages appear instantly using Supabase `channel.on('postgres_changes', ...)`. Include a text input and send button at the bottom."*

- [x] **Add 'Message Landlord' button on listing pages**
  > **How:** Prompt your AI tool:
  > *"Add a 'Message Landlord' button to the property listing detail page. When a logged-in tenant clicks it, create a new conversation entry if one doesn't exist for this tenant + landlord + property combination, then redirect to `/messages/[conversationId]`. If the user is not logged in, redirect to `/login`."*

- [x] **Add unread message count badge to nav**
  > **How:** Prompt your AI tool:
  > *"Add an unread message count badge to the Messages icon in the navigation bar. Fetch the count of messages where `receiver_id` is the current user and `is_read` is false. Update in real time using Supabase Realtime."*

---

---

# PHASE 6 — Payments
### 🎯 Goal: Tenants pay rent monthly through Paystack. Landlords receive funds to their wallet.

---

### 6.1 — Set Up Paystack

- [x] **Create a Paystack account**
  > **How:** Go to [paystack.com](https://paystack.com) and sign up. Complete the business verification to enable live payments. For now, use **Test Mode**. Go to **Settings → API Keys** and copy your **Secret Key** and **Public Key**. Add them to `.env.local`:
  > ```
  > NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxx
  > PAYSTACK_SECRET_KEY=sk_test_xxxx
  > ```

- [x] **Install Paystack React library**
  > **How:** Run:
  > ```bash
  > npm install react-paystack
  > ```

---

### 6.2 — Build the Payment Flow

- [x] **Build the rent payment initiation page**
  > **How:** Prompt your AI tool:
  > *"Build a rent payment page at `/app/payments/pay/[propertyId]/page.tsx`. Show a payment summary: property name, monthly rent amount, Dwelio service fee (3% of rent), total. Include a 'Pay Now' button that opens the Paystack payment modal using `react-paystack`. Use the tenant's email for the Paystack customer. On successful payment, call a Next.js API route to record the payment."*

- [x] **Build the Paystack webhook API route**
  > **How:** Prompt your AI tool:
  > *"Create a Next.js API route at `/app/api/payments/webhook/route.ts` to handle Paystack webhook events. Verify the webhook signature using `PAYSTACK_SECRET_KEY`. On `charge.success` event, update the corresponding payment record in Supabase `payments` table — set status to `paid`. Also update the payment status to `in_escrow` if it's a first month (move-in) payment."*

- [x] **Build the escrow logic**
  > **How:** Prompt your AI tool:
  > *"Build an API route at `/app/api/payments/release-escrow/route.ts`. When called with a `paymentId`, check that the payment status is `in_escrow` and that the tenant has confirmed move-in (add a `move_in_confirmed` boolean to the payments table). If both conditions are met, update status to `released` and update the landlord's wallet balance in a `wallets` table. Protect this route so only the tenant on the payment can call it."*

- [x] **Build the tenant payment history page**
  > **How:** Prompt your AI tool:
  > *"Build a payments page at `/app/payments/page.tsx` for tenants. Show a list of all their payments fetched from Supabase, ordered by date. Each row shows: property name, month, amount, status badge (Pending/Paid/In Escrow/Released), and a download receipt link. For upcoming payments, show a 'Pay Now' button."*

- [x] **Build the landlord payment/earnings page**
  > **How:** Prompt your AI tool:
  > *"Build a landlord earnings page at `/app/dashboard/earnings/page.tsx`. Show: total earned this month, total earned all time, wallet balance. Below, show a table of all incoming payments for their properties. Each row: tenant name, property, month, amount, status. Include a 'Withdraw to Bank' button (for Phase 3 — can be a placeholder for now)."*

---

---

# PHASE 7 — Legal Documents
### 🎯 Goal: Auto-generate a tenancy agreement that both parties sign digitally.

---

### 7.1 — Build the Tenancy Agreement Generator

- [x] **Build the agreement generation API route**
  > **How:** Prompt your AI tool:
  > *"Build a Next.js API route at `/app/api/agreements/generate/route.ts`. It receives `tenantId`, `landlordId`, `propertyId`, `startDate`, `monthlyRent`. Fetch the property and both user profiles from Supabase. Generate a tenancy agreement text using a template that includes: landlord name, tenant name, property address, monthly rent, start date, standard Nigerian tenancy terms covering: rent payment schedule, maintenance responsibilities, notice period (1 month), and termination conditions. Insert the agreement into the `tenancy_agreements` table with `tenant_signed` and `landlord_signed` as false. Return the agreement ID."*

- [x] **Build the agreement review and signing page**
  > **How:** Prompt your AI tool:
  > *"Build an agreement page at `/app/agreements/[id]/page.tsx`. Fetch the agreement from Supabase. Display the full agreement text in a readable, formatted layout. At the bottom, show two states: (1) If the current user has not signed — show a checkbox 'I have read and agree to this tenancy agreement' and a 'Sign Agreement' button. Clicking it sets `tenant_signed` or `landlord_signed` to true in Supabase. (2) If both have signed — show a green 'Fully Executed' banner and a 'Download PDF' button."*

- [x] **Add PDF download of the signed agreement**
  > **How:** Run `npm install jspdf` then prompt your AI tool:
  > *"Add a 'Download as PDF' button to the agreement page at `/app/agreements/[id]/page.tsx`. When clicked, use `jspdf` to generate a PDF containing the agreement text, landlord and tenant names, property address, and a 'Digitally Signed on [date]' footer for each party. Trigger a browser download of the PDF."*

---

---

# PHASE 8 — AI & Neighbourhood Insights
### 🎯 Goal: Smart property recommendations. Neighbourhood data for informed decisions.

---

### 8.1 — AI Recommendations

- [x] **Set up OpenAI API**
  > **How:** Go to [platform.openai.com](https://platform.openai.com), create an account, generate an API key. Add to `.env.local`:
  > ```
  > OPENAI_API_KEY=sk-xxxx
  > ```
  > Run: `npm install openai`

- [x] **Build the recommendation API route**
  > **How:** Prompt your AI tool:
  > *"Build a Next.js API route at `/app/api/recommendations/route.ts`. It receives the current user's: budget range, preferred neighbourhoods, bedroom count, and property type preference. Fetch all available properties from Supabase. Use the OpenAI API to rank and recommend the top 5 most suitable properties based on the user's preferences. Return the sorted list of property IDs with a short reason for each recommendation."*

- [x] **Build the 'Recommended for You' section**
  > **How:** Prompt your AI tool:
  > *"Add a 'Recommended for You' section to the tenant dashboard at `/app/dashboard/page.tsx`. On page load, if the user has preferences saved, call the `/api/recommendations` route. Display the top 5 recommended properties as a horizontal scroll row of PropertyCards. If no preferences are saved, show a 'Tell us what you're looking for' prompt that opens a quick preferences modal."*

---

### 8.2 — Neighbourhood Insights

- [x] **Build the neighbourhood data structure**
  > **How:** Create a file `/src/data/ibadan-neighbourhoods.ts` with this data for each of the key Ibadan areas: average rent (1-bed, 2-bed, 3-bed), general description, proximity to key landmarks (UI, Dugbe market, Ring Road), and a vibe tag (Quiet & Residential / Busy & Commercial / Student-Friendly / Premium). Prompt your AI tool to help populate this data.

- [x] **Build the neighbourhood insights page**
  > **How:** Prompt your AI tool:
  > *"Build a neighbourhood guide page at `/app/neighbourhoods/page.tsx`. Show a grid of cards for each key Ibadan neighbourhood (Bodija, Samonda, Agodi GRA, Mokola, Ajibode, Agbowo, Challenge, Dugbe, Iwo Road, New Bodija). Each card shows: neighbourhood name, vibe tag badge, average rent range, short description, and a 'Browse Listings' button that links to search pre-filtered by that neighbourhood."*

---

---

# PHASE 9 — Polish, SEO & Beta Launch
### 🎯 Goal: The platform is bug-free, fast, and ready for real Ibadan users.

---

### 9.1 — Navigation & Layout

- [x] **Build the main navigation bar**
  > **How:** Prompt your AI tool:
  > *"Build a responsive navigation bar component for Dwelio. Left: Logo (Dwelio in green). Centre: links — Browse, Neighbourhoods, How It Works. Right: Messages icon with unread badge, Notifications icon, and either 'Log In / Sign Up' buttons or a user avatar dropdown (Profile, Dashboard, Settings, Log Out) if logged in. Mobile: hamburger menu. Brand colours: green `#1A6B3A`, gold `#F4A623`."*

- [x] **Build the footer**
  > **How:** Prompt your AI tool:
  > *"Build a site footer for Dwelio with columns: About (About Us, How It Works, Blog), Explore (Browse Listings, Neighbourhoods, Sell a Property), Support (Help Centre, Contact Us, Report a Listing), Legal (Privacy Policy, Terms of Service). Show the Dwelio logo and tagline. Add social media icons. Dark green background with white text."*

- [x] **Add a notifications system**
  > **How:** Prompt your AI tool:
  > *"Build a simple notifications system for Dwelio. Create a `notifications` table in Supabase with: `user_id`, `type` (new_message, payment_due, agreement_signed, listing_inquiry), `message`, `link`, `is_read`, `created_at`. Build a notifications dropdown in the nav that shows the 10 most recent notifications. Mark all as read when opened. Use Supabase Realtime to show new notifications instantly."*

---

### 9.2 — SEO & Performance

- [ ] **Add metadata to all key pages**
  > **How:** Prompt your AI tool:
  > *"Add Next.js 14 metadata exports to these pages: landing page, search page, and each property listing page (`/listings/[id]`). For listing pages, generate dynamic metadata using the property title, neighbourhood, price, and first image as the OG image. Include title, description, and OpenGraph tags."*

- [ ] **Add a sitemap**
  > **How:** Prompt your AI tool:
  > *"Create a dynamic sitemap at `/app/sitemap.ts` in Next.js 14. Include: static pages (home, search, neighbourhoods, how-it-works). Also include all available property listing URLs fetched from Supabase. This helps Google index your listings."*

- [ ] **Optimise all images with Next.js Image component**
  > **How:** Prompt your AI tool:
  > *"Audit all `<img>` tags in the codebase and replace them with Next.js `<Image>` components from `next/image`. Add `sizes` and `priority` props appropriately. Configure the `next.config.js` to allow images from the Supabase storage domain."*

---

### 9.3 — Error Handling & Edge Cases

- [ ] **Add loading skeletons to all data-fetching pages**
  > **How:** Prompt your AI tool:
  > *"Create skeleton loading components for: PropertyCard, the search results grid, the listing detail page, and the messages inbox. Use Tailwind's `animate-pulse` class with grey placeholder blocks matching the shape of the real content. Show these while data is being fetched."*

- [ ] **Add empty states to all list views**
  > **How:** Prompt your AI tool:
  > *"Add empty state components for: search results (no listings found), messages inbox (no conversations yet), landlord dashboard (no listings yet), payment history (no payments yet). Each empty state should have an illustration (use a simple SVG or emoji), a helpful message, and a clear CTA button."*

- [ ] **Add a 404 page**
  > **How:** Prompt your AI tool:
  > *"Create a custom 404 page at `/app/not-found.tsx` for Dwelio. Show a friendly message, the Dwelio logo, and buttons to go to the homepage or browse listings. Use the brand colours."*

- [ ] **Add error boundaries**
  > **How:** Prompt your AI tool:
  > *"Create an `error.tsx` file in the Next.js App Router at `/app/error.tsx`. Show a friendly error message with a 'Try Again' button that calls the `reset` function. Also add a global `error.tsx` for unhandled errors."*

---

### 9.4 — Testing Before Launch

- [ ] **Test the full tenant journey end-to-end**
  > **How:** Manually walk through: Sign up as tenant → search for a property in Bodija → view listing → message landlord → make a test payment via Paystack test mode → confirm move-in → sign agreement → download PDF. Fix any bugs you find.

- [ ] **Test the full landlord journey end-to-end**
  > **How:** Manually walk through: Sign up as landlord → verify ID → create a listing with photos and video → receive a message from a tenant → accept a tenant → countersign the agreement → check the earnings dashboard.

- [ ] **Test on mobile (phone screen)**
  > **How:** Open your Vercel deployment on a real phone. Check every page for layout issues. Pay special attention to: the search filters, the property image gallery, the chat interface, and the payment flow.

- [ ] **Test with slow Nigerian internet speeds**
  > **How:** In Chrome DevTools (F12 → Network tab), set throttling to **Slow 3G**. Navigate through the app. Anything that takes more than 3 seconds to load needs a loading skeleton or optimisation.

---

### 9.5 — Pre-Launch Checklist

- [ ] **Set up a custom domain**
  > **How:** Buy a domain (e.g. `dwelio.ng` or `getDwelio.ng`) from a registrar like Namecheap or GoDaddy. In Vercel, go to your project → **Settings → Domains** and add your custom domain. Follow the DNS instructions.

- [ ] **Switch Paystack to Live Mode**
  > **How:** In your Paystack dashboard, toggle from Test Mode to Live Mode. Update the keys in your Vercel environment variables with the live keys. Do a real ₦100 test transaction to confirm.

- [ ] **Set up Termii for SMS notifications**
  > **How:** Sign up at [termii.com](https://termii.com). Get your API key. Add to Vercel env vars. Prompt your AI tool: *"Integrate Termii SMS into the Dwelio app. Send an SMS notification when: a tenant receives a new message, a landlord receives a new inquiry, a rent payment is due in 3 days."*

- [ ] **Set up error monitoring with Sentry**
  > **How:** Sign up at [sentry.io](https://sentry.io). Run `npm install @sentry/nextjs`. Prompt your AI tool: *"Set up Sentry error monitoring in a Next.js 14 App Router project. Configure it to capture unhandled errors and show source maps."*

- [ ] **Write your Privacy Policy and Terms of Service**
  > **How:** Prompt your AI tool: *"Write a Privacy Policy and Terms of Service for a Nigerian property marketplace called Dwelio. The platform connects landlords and tenants in Nigeria, processes rent payments via Paystack, stores user identity documents, and generates tenancy agreements. Must comply with Nigeria Data Protection Regulation (NDPR)."*

- [ ] **Seed the platform with real Ibadan listings before launch**
  > **How:** Before going public, reach out to 20–30 Ibadan landlords personally. Offer to create their listings for them free of charge. Walk them through the verification process. Having real inventory before launch is critical — nobody browses an empty marketplace.

- [ ] **Launch your beta 🚀**
  > **How:** Share your link in: UI student WhatsApp groups, Ibadan property Facebook groups, your personal network, and Twitter/X with the hashtag #IbadanProperties. Ask your first 10 users for feedback directly. Fix the top 3 complaints before your full public launch.

---

---

## 🔮 Post-Launch Backlog (Phase 10+)

These are features to build after your beta is live and you have real users giving feedback.

- [ ] Saved / Favourited listings for tenants
- [ ] Push notifications (PWA)
- [ ] Native mobile app (React Native)
- [ ] Mortgage calculator for buyers
- [ ] Property sales flow (offer, counter-offer, document checklist)
- [ ] Agent Lite accounts with fee transparency
- [ ] Landlord bulk upload (for landlords with multiple properties)
- [ ] Rent-to-own listings
- [ ] Blog / content section for SEO (Ibadan neighbourhood guides, renting tips)
- [ ] Lagos expansion (duplicate neighbourhood data, update search defaults)
- [ ] Admin analytics dashboard (total listings, payments volume, active users)

---

*DWELIO | Vibe-Coding Build Plan v1.0 | Ibadan Launch Edition | Confidential*
