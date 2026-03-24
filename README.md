# Yaz Evi — Boutique Hotel Booking Website

This project is deployed on: [yaz-evi.com](https://www.yaz-evi.com/)

Yaz Evi is the official website and online reservation system for a boutique hotel located on the island of **Bozcaada, Çanakkale, Turkey**. The project provides guests with a seamless browsing and booking experience — from exploring rooms and galleries to completing a secure payment, all in one place.

## Purpose

The goal of this project is to give Yaz Evi a modern, visually rich online presence where guests can:

- Discover the hotel, its rooms, and the experiences it offers
- Check room availability in real time
- Make a reservation and pay online with support for Turkish installment plans
- Browse the hotel in both **English** and **Turkish**

On the management side, a separate [admin panel](https://github.com/alpsenell/yaz-evi-admin) allows the hotel staff to update room pricing and manage reservations without touching any code.

## Rooms

The hotel has five uniquely themed rooms, each named after figures and places from mythology and local history:

- **Zeus** · **Hera** · **Tenedos** · **Tenes** · **Ilyada**

Each room page showcases a photo gallery, amenities, guest capacity, and pricing.

## How Booking Works

1. **Pick a room** — The guest selects one of the five rooms.
2. **Choose dates** — A calendar shows real-time availability; already-booked dates are automatically blocked.
3. **Review & checkout** — A summary displays the selected room, dates, total price, and guest count.
4. **Pay securely** — The guest fills in their details and is redirected to iyzico's secure payment form, which supports credit/debit cards and installment options (2, 3, or 6 months).
5. **Confirmation** — After payment, the guest sees a confirmation page with their booking reference number and details.

## Technologies & How They're Used

### Frontend

| Technology | What it does |
|---|---|
| **Vue 3** | The core framework that powers the entire user interface — pages, components, and reactive state. |
| **TypeScript** | Adds type safety across the codebase to catch errors early and improve developer experience. |
| **Vite** | The build tool and dev server — makes development fast with instant hot-reload. |
| **Tailwind CSS + SCSS** | Tailwind handles utility-based styling, SCSS is used for more structured global styles. Together they create a responsive, mobile-first design. |
| **Vue Router** | Manages page navigation (home, rooms, booking, gallery, etc.) as a single-page application. |
| **i18next** | Powers the bilingual experience — automatically detects the visitor's browser language and switches between English and Turkish. |
| **v-calendar** | Provides the interactive date-range picker used in the booking flow, with support for disabled (already booked) dates. |
| **Splide** | Drives the image carousels and sliders throughout the site (hero section, room galleries). |

### Backend & Services

| Technology | What it does |
|---|---|
| **Vercel Serverless Functions** | Handles server-side logic — payment initialization, payment callbacks, and booking retrieval — without needing a dedicated backend server. |
| **Firebase / Firestore** | The database that stores room information, pricing, and all booking records. The frontend reads availability in real time; the server writes and updates bookings. |
| **iyzico** | Turkey's leading payment gateway. Handles secure card payments with 3D Secure verification and Turkish Lira (TRY) installment support — essential for local e-commerce compliance. |
| **EmailJS** | Sends emails from the contact form directly from the browser, without a backend mail server. |
| **Google reCAPTCHA v3** | Protects forms from spam and bot submissions invisibly, without annoying checkbox challenges. |

### Infrastructure & Media

| Technology | What it does |
|---|---|
| **Vercel** | Hosts the website and serverless API functions. Also handles domain routing, redirects, and security headers. |
| **Cloudflare Workers + R2** | Serves all hotel images and media through a fast CDN at `media.yaz-evi.com`. Images are stored in a Cloudflare R2 bucket and delivered globally with long-term caching. |

## Pages

- **Home** — Hero video, gallery highlights, and a call-to-action to book.
- **Rooms** — Overview of all five rooms with links to individual room pages.
- **Room Detail** — Full photo gallery, amenities, and a direct booking button.
- **Booking** — The multi-step reservation flow (room → dates → summary).
- **Checkout** — Guest information form and payment initiation.
- **Confirmation** — Post-payment booking confirmation with reference number.
- **Gallery** — A full photo gallery of the hotel with a lightbox viewer.
- **Experiences** — Wine tasting, sunset experiences, and things to do on the island.
- **About** — The story behind the hotel.
- **Contact** — A contact form powered by EmailJS.

## Admin Panel

A separate admin panel lives in its own repository: [yaz-evi-admin](https://github.com/alpsenell/yaz-evi-admin). It provides hotel staff with a dashboard to:

- Update room pricing per night
- View and manage reservations
- Cancel bookings

The admin panel authenticates via Firebase and reads/writes to the same Firestore database used by the main site.

## Design

The visual identity uses a warm, earthy color palette — browns, creams, and soft peach tones — paired with the **Raleway** typeface. The design is fully responsive and optimized for mobile, tablet, and desktop screens.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The project is deployed automatically via **Vercel** on push to the main branch.
