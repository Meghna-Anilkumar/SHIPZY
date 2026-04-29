# 🍔 SHIPZY – Order Management System

A full-stack **Order Management feature** for a food delivery application, built using the **MERN stack with TypeScript**. This project allows users to browse a menu, place orders, and track order status with simulated real-time updates.

---

## 🚀 Live Demo

* 🌐 Frontend: https://shipzy-peach.vercel.app
* 🔗 Backend API: https://shipzy-wd61.onrender.com

---

## 📌 Features

### 🥗 Menu Display

* Displays a list of food items
* Each item includes:

  * Name
  * Description
  * Price
  * Image

---

### 🛒 Order Placement

* Add items to cart
* Update item quantity
* Checkout with:

  * Name
  * Address
  * Phone number

---

### 📦 Order Status Tracking

* Order lifecycle:

  * Order Received
  * Preparing
  * Out for Delivery
  * Delivered
* Simulated real-time updates from backend

---

### 🔌 Backend (REST API)

* Fetch menu items
* Create new orders
* Get order details
* Update order status
* MongoDB used for persistence

---

### 🧪 Test-Driven Development (TDD)

* Backend API tested using **Vitest + Supertest**
* Frontend components tested using **React Testing Library**
* Covers:

  * CRUD operations
  * Input validation
  * Order status flow

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* Zustand (state management)
* React Query (data fetching)
* React Hook Form + Zod (validation)

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* Zod (validation)
* Clean Architecture (Repository Pattern)

---

## 📂 Project Structure

```
SHIPZY/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── constants/
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── store/
│   └── package.json
│
└── README.md
```

---

## 🚀 Deployment

### Frontend

* Hosted on **Vercel**

### Backend

* Hosted on **Render**
* Build Command:

```bash
npm install && npm run build
```

* Start Command:

```bash
npm start
```

---

## 🔐 Environment Variables

### Backend

* `MONGODB_URI`
* `PORT`
* `FRONTEND_URL`

---

## ⚡ Architecture & Design Decisions

* **Clean Architecture** with separation of concerns
* **Repository Pattern** for database abstraction
* **Service Layer** for business logic
* **Controller Layer** for request handling
* **Zod** for schema validation
* **React Query** for efficient API state management
* **Zustand** for lightweight global state

---
