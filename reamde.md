# 🌍 Natours Application

Natours is a complete tour booking application built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**.  
It allows users to explore tours, sign up, log in, book tours, make payments, and view their bookings – all in one place.

---

## 🚀 Features

- **User Authentication & Authorization**
  - Signup, Login, Logout
  - Password reset & update
  - Role-based access (user/admin/lead-guide)

- **Tour Management**
  - View all tours and detailed information
  - Filter, sort, paginate tours
  - Add, update, and delete tours (admin/guide only)

- **Booking System**
  - Secure payments via Stripe
  - View your booked tours in your account

- **Security**
  - Data sanitization against NoSQL injection & XSS
  - Secure cookies & JWT authentication
  - Rate limiting & helmet for HTTP security

---

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Payment Gateway:** Stripe
- **Templating Engine:** Pug
- **Frontend:** Vanilla JS, SCSS