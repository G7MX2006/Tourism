# 🏛️ Egypt Heritage - Luxury Tourism & Travel Experience

A modern, responsive tourism and luxury travel web application designed to showcase Egypt's top historical destinations, cultural landmarks, curated tour packages, and seamless trip booking management.

---

## ✨ Features

- **🔐 User Authentication:**
  - Secure User Sign-in (`signin.html`) & Registration (`signup.html`, `createacc.html`) flows.
  - "Remember Me" credential caching and session persistence using browser `localStorage`.
  - Client-side form validation and dynamic error feedback.
- **🏛️ Dynamic Destination Explorer:**
  - Interactive destination browsing (`Destiantions.html`) with real-time category filtering.
  - Seamless redirection from selected destinations directly to relevant tour packages.
- **🎫 Curated Tour Packages & Booking Pipeline:**
  - View detailed itineraries, pricing, and tour information (`Tours.html`) linked to chosen destinations.
  - Direct integration from tours to a complete trip reservation system (`Booking.html`).
- **🎨 Modern Luxury UI/UX:**
  - Glassmorphic card layouts with custom gold accents across all pages.
  - Fully responsive design optimized for mobile, tablet, and desktop screens.
  - Integrated Bootstrap Icons and Google Fonts (`Playfair Display` & `Inter`).

---

## 🛠️ Built With

- **HTML5 & CSS3** – Semantic structure, custom responsive design, and glassmorphism styling.
- **JavaScript (ES6+)** – DOM manipulation, asynchronous `fetch` API workflows, and state persistence.
- **Bootstrap 5.3** – Grid system, responsive utility classes, and layout scaffolding.
- **JSON Server** – Lightweight mock REST API for simulating backend endpoints.

---

## 📁 Project Structure

```text
Tourism-main/
├── css/
│   ├── Destination.css     # Destinations styling and grid layouts
│   ├── home.css            # Main landing page styles
│   ├── signin.css          # Sign-in glassmorphism theme
│   └── signup.css          # Registration and form styles
├── js/
│   ├── Booking.js          # Trip reservation & booking form logic
│   ├── createAccount.js    # Account creation helper scripts
│   ├── Destination.js      # Destinations fetching & filtering logic
│   ├── main.js             # Core navigation and landing page scripts
│   ├── signin.js           # Authentication & form handling logic
│   ├── signup.js           # User registration validation
│   └── Tours.js            # Tour packages linked to destinations
├── pages/
│   ├── Booking.html        # Trip booking & reservation page
│   ├── createacc.html      # Account creation page
│   ├── Destiantions.html   # Destinations catalog page
│   ├── signin.html         # User sign-in page
│   ├── signup.html         # User registration page
│   └── Tours.html          # Destination-linked tours page
├── data.json               # Mock database (users, destinations, tours, bookings)
├── index.html              # Landing / Home page
└── README.md
