# Implementation Plan: Painel Dinheiro Mudo

Building a "Private Digital Billboard" system for tablets in rear seats of ride-share cars.

## 1. Project Goals
- **Driver Dashboard (Mobile):** Manage up to 6 local advertisers (Image, Timer).
- **Ad Display (Tablet):** Fullscreen, automated looping of active ads.
- **Monetization Engine:** Simple, high-impact UI that makes the driver look professional when selling spaces to local businesses.

## 2. Tech Stack
- **Structure:** Semantic HTML5.
- **Styling:** Vanilla CSS (Modern, Dark Mode, Gradients, Smooth Transitions).
- **Logic:** Vanilla JavaScript (LocalStorage for data persistence).
- **Fonts:** "Outfit" or "Inter" from Google Fonts.

## 3. Core Features
- **Advertiser Slot Management:** 6 slots with "Active/Inactive" toggle.
- **Image Upload:** Local file selection (saved to base64 for persistent browser testing).
- **Loop Timing:** Adjustable time per ad (default 10s).
- **Fullscreen Display:** One-click transition to the loop mode.
- **Live Preview:** Real-time feedback on the dashboard.

## 4. UI/UX Design (Premium Aesthetic)
- **Primary Color:** Deep Purple / Electric Blue (Teaser of premium/tech).
- **Surface:** Glassmorphism on dark background.
- **Animations:** Subtle fade-ins and scale-up effects on ad transitions.

## 5. File Structure
- `index.html`: Shell for both Dashboard and Display views.
- `style.css`: Design system and layout.
- `app.js`: State management and display logic.

## 6. Development Stages
1. **Foundation (`style.css`):** Setup CSS variables, resets, and utility classes.
2. **Skeleton (`index.html`):** Define the multi-view structure (Manager vs. Player).
3. **Logic (`app.js`):** Handle data persistence and the carousel engine.
4. **Assets (`generate_image`):** Create high-quality placeholder ads (Dentist, Barber, Pet Shop) for the initial demo.
5. **Testing & Polish:** Ensure smooth transitions on mobile/tablets.
