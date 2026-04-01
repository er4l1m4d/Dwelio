# Design System: Modern Heritage Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Cultivated Estate."** 

This system moves away from the "templated" look of generic real estate platforms. Instead, it adopts a high-end editorial approach that mirrors a premium lifestyle magazine. We bridge the gap between Nigeria’s rich architectural heritage and the future of digital property commerce. 

The visual language is defined by **intentional asymmetry**, where large-scale typography overlaps high-quality photography, and **tonal depth** replaces traditional structural lines. By utilizing generous whitespace and a sophisticated layering of surfaces, we create an environment that feels authoritative yet welcoming—a digital sanctuary for property seekers.

---

## 2. Colors & Surface Philosophy
The palette is grounded in the deep, fertile tones of the Nigerian landscape, punctuated by the warmth of the savanna sun.

### Tonal Strategy
*   **Primary (Security):** `primary_container` (#013220) acts as our anchor. It is used for hero sections and high-priority branding to evoke stability and growth.
*   **Accent (Optimism):** `tertiary_fixed_dim` (#fbbc00) is our "Amber Gold." Use it sparingly for CTAs, "Verified" indicators, and moments of celebration to provide warmth.
*   **The "No-Line" Rule:** We explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` section should sit directly on a `surface` background to create a soft, sophisticated transition.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper. 
    *   **Level 0:** `surface` (#f9faf6) – The base canvas.
    *   **Level 1:** `surface_container_low` (#f3f4f0) – Main content areas.
    *   **Level 2:** `surface_container_lowest` (#ffffff) – Elevated cards or interactive elements.
*   **The "Glass & Gradient" Rule:** To avoid a flat, "web 1.0" feel, use Glassmorphism for floating navigation or image overlays. Apply `surface_container_lowest` at 70% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** Use a subtle linear gradient transitioning from `primary_container` (#013220) to `primary` (#001b0f) for hero backgrounds to add "visual soul."

---

## 3. Typography
Our typography pairing is a dialogue between heritage and modernism.

*   **Display & Headlines (Epilogue):** This typeface carries the weight of a masthead. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for property titles. Bold weights should feel like an architectural statement.
*   **Body & Utility (Manrope):** We use Manrope for its high legibility and contemporary feel. `body-lg` (1rem) provides a comfortable reading experience for property descriptions, while `label-md` (0.75rem) in all-caps handles metadata with precision.
*   **Hierarchy as Identity:** Create "Editorial Moments" by pairing a massive `display-md` headline with a small, wide-tracked `label-sm` subtitle. This contrast is the hallmark of premium design.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than traditional drop shadows.

*   **The Layering Principle:** Place a `surface_container_lowest` card on top of a `surface_container_low` background. The subtle shift in hex value creates a natural lift that feels integrated, not "pasted on."
*   **Ambient Shadows:** When a floating effect is mandatory (e.g., a "Book Viewing" sticky bar), use an extra-diffused shadow: `Y: 20px, Blur: 40px, Opacity: 4%` using a tint of the `on_surface` color.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in forms, use the `outline_variant` token at **20% opacity**. 100% opaque borders are strictly forbidden as they clutter the editorial aesthetic.
*   **Heritage Watermarks:** Incorporate subtle Nigerian heritage patterns (inspired by Adire or Uli) as vector masks within `surface_variant` areas at 5% opacity.

---

## 5. Components

### Property Listing Cards
*   **Structure:** No borders. A `surface_container_lowest` background. 
*   **Image:** 4:5 aspect ratio (editorial style) with an `xl` (0.75rem) corner radius.
*   **Spacing:** Use `spacing.4` (1.4rem) for internal padding to allow the content to breathe.
*   **Status Badge:** For "Verified" status, use `tertiary_container` background with `on_tertiary_fixed_variant` text. Apply a `full` (9999px) radius.

### Buttons
*   **Primary:** `primary_container` background with `on_primary` text. Use `md` (0.375rem) roundedness for a professional, sharp look.
*   **Secondary/Ghost:** `surface_container_high` background. No border. On hover, transition to `surface_container_highest`.
*   **Tertiary:** `on_surface` text with a 2px underline in `tertiary_fixed_dim`.

### Elegant Form Elements (Search & Filtering)
*   **Inputs:** Use `surface_container_low` backgrounds. Forgo the traditional box; use a "Bottom Line Only" approach or a fully flooded background with no border.
*   **Focus State:** A soft 4px glow using the `surface_tint` at 15% opacity.
*   **Dropdowns:** Use the Glassmorphism rule—semi-transparent `surface_container_lowest` with backdrop blur.

### Chips & Badges
*   **Filter Chips:** `secondary_fixed` background. When selected, switch to `primary_container` with `on_primary` text.
*   **Dividers:** Strictly forbidden. Use `spacing.8` (2.75rem) of vertical whitespace or a tonal shift to separate content blocks.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical image grids (e.g., one large image paired with two smaller stacked images).
*   **Do** prioritize `primary_container` (#013220) for text to ensure high-contrast accessibility against light surfaces.
*   **Do** use `spacing.20` (7rem) between major sections to emphasize the "Editorial" feel.
*   **Do** use high-quality photography that features warm, natural Nigerian sunlight.

### Don’t
*   **Don’t** use 1px solid borders to separate cards or sections.
*   **Don’t** use pure black (#000000) for shadows; always use a tinted neutral.
*   **Don’t** crowd the interface. If a screen feels "busy," increase the whitespace using the `spacing.10` or `12` tokens.
*   **Don’t** use standard "system" blues or reds for alerts. Use the `error` and `tertiary` tokens provided in the palette.

---
*Note: This design system is a living document. Every pixel should serve the goal of making the user feel they are not just browsing a list, but entering a curated home.*