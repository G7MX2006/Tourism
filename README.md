# 🏛️ Egypt Heritage - Luxury Tourism & Travel Experience

A modern, responsive tourism and luxury travel web application designed to showcase Egypt's top historical destinations, cultural landmarks, and exclusive travel experiences.

---

## ✨ Features

- **🔐 User Authentication:**
  - Secure User Sign-in & Registration flows.
  - "Remember Me" credential caching using browser `localStorage`.
  - Client-side form validation and dynamic error feedback.
- **🏛️ Dynamic Destination Explorer:**
  - Interactive destination browsing with real-time category filtering.
  - Asynchronous data fetching from a mock REST API.
- **🎨 Modern Luxury UI/UX:**
  - Glassmorphic card layouts with custom gold accents.
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
egypt-heritage/
├── css/
│   └── signin.css          # Custom styling and glassmorphism themes
├── js/
│   ├── main.js             # Core destination browsing & filtering logic
│   └── signin.js           # Authentication & form handling logic
├── pages/
│   ├── signin.html         # User sign-in page
│   └── signup.html         # User registration page
├── data/
│   └── db.json             # Mock database (users, destinations, bookings)
├── index.html              # Landing / Home page
└── README.md
