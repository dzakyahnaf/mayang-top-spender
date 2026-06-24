# Goal Description

The goal is to completely redesign the UI/Frontend of the "Mayang Top Spender" application to make it more attractive, simple, and modern, based on the provided teal color palette. The redesign must look polished and professional ("not AI slop") while strictly maintaining all existing backend and core logic functionality.

The target color palette provided is monochromatic Teal:
- HEX `1baeb9` (Primary / 500)
- HEX `61b2bc` (400)
- HEX `83c0c8` (300)
- HEX `b0ced4` (200)
- HEX `d1e0e3` (100)
- (And lighter background shades like `eef5f6` for 50)

These colors are already defined in `app.css` as `--color-mayang-*`. We will heavily utilize them to build a refined aesthetic.

## User Review Required

> [!IMPORTANT]
> Please review this UI redesign plan. I will **ONLY** modify frontend files (`resources/js/pages/**/*.tsx` and `app.css`) to update the styling, layout, typography, and visual hierarchy. No backend routes, controllers, or React state logic will be altered.

## Open Questions

> [!NOTE]
> 1. Are there any specific font preferences beyond the default 'Instrument Sans' currently configured?
> 2. Should I also apply the redesign to the admin/cashier pages, or primarily focus on the public-facing customer pages (Welcome, Leaderboard, Belanjaanku, Login/Register)? *My plan focuses on public-facing pages first.*

## Proposed Changes

We will transition from the current "glassmorphism heavy" look to a cleaner, more minimalist, high-contrast, and sophisticated modern aesthetic. We will use proper whitespace, subtle shadows, clean borders, and refined typography.

### 1. Global CSS & Layout Updates
- **`resources/css/app.css`**: Ensure the Mayang color palette is properly set as the primary theme color. Refine base styles for better typography scaling.
- **`resources/js/layouts/app-layout.tsx` (or main navigation)**: Redesign the navigation bar to be crisp and clean rather than overly blurred.

### 2. Public Facing Pages Redesign

#### [MODIFY] `resources/js/pages/welcome.tsx`
- **Hero Section**: Create a bold, typography-driven hero section. Instead of scattered blurry blobs, use structured, elegant layout with strong typography for the headline.
- **Call to Actions (CTAs)**: Make buttons look premium. Solid primary color (`mayang-500`) with subtle hover transitions (slight lift, shadow change), removing excessive gradient/glow "slop".
- **How to Join Section**: Redesign the steps into a sleek, horizontal scrolling or clean grid layout with minimal icons and high-contrast text.

#### [MODIFY] `resources/js/pages/leaderboard.tsx`
- **Header**: Simplify the header, bringing focus to the current period and date.
- **Table Design**: Completely revamp the leaderboard table. Use a clean, modern card layout for the top 3 (maybe a podium style or highlighted top rows), and a minimalist list for the rest.
- **Empty States**: Design elegant empty states for when no competition or transactions exist.

#### [MODIFY] `resources/js/pages/my-spending.tsx`
- **Customer Info Card**: Redesign the user info card to feel like a premium digital member card, utilizing the `mayang-500` color tastefully.
- **Transaction History**: Create a crisp, easy-to-read data table or list for transactions. Improve spacing and typography for monetary values.

#### [MODIFY] `resources/js/pages/register-member.tsx` & Auth Pages
- **Forms**: Clean up input fields. Use refined borders, floating labels (if appropriate), or clean stacked labels with good contrast. Ensure validation error states look professional.

## Verification Plan

### Automated Tests
- Run `vendor/bin/pint --format agent` to ensure PHP code (if any accidentally touched, though not planned) is clean.
- Run `npm run build` or `npm run dev` to ensure Vite compiles the new React/Tailwind code without errors.

### Manual Verification
- Visual inspection of `welcome`, `leaderboard`, and `my-spending` views to guarantee the UI matches the "modern, simple, clean" requirement and incorporates the teal color palette successfully.
- Verify that links, buttons, and Inertia routing remain fully functional.
