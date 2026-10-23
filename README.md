# Mini CRM Application

A full-stack Mini CRM (Customer Relationship Management) web application built using the **MERN** stack (MongoDB, Express, React, Node.js). This project allows users to manage leads, companies, and daily tasks with full authentication and authorization features.

---

## 🚀 Live Links

- **Frontend Deployment (Vercel):** [https://mini-crm-balaji-cs-projects-658b3fed.vercel.app](https://mini-crm-balaji-cs-projects-658b3fed.vercel.app)
- **Backend API Deployment (Render):** [https://mini-crm-h7bq.onrender.com](https://mini-crm-h7bq.onrender.com)
- **GitHub Repository:** [https://github.com/balajii-dev/Mini-CRM](https://github.com/balajii-dev/Mini-CRM)

---

## ✨ Features

- **User Authentication:** Secure Sign Up and Login system.
- **Dashboard Overview:** Displays key metrics including Total Leads, Qualified Leads, Companies, and Tasks.
- **Leads Management:** Create, view, update, and organize customer leads.
- **Company Tracking:** Manage client companies and associated data.
- **Task Management:** Track daily tasks and monitor completion statuses.
- **Responsive & Minimal UI:** Clean, intuitive interface built with Tailwind CSS.

---

## 🔐 Authorization Logic Explanation

The application implements a robust **JWT (JSON Web Token)** based authentication and authorization flow:

1. **User Login & Token Generation:**
   - When a user submits valid credentials at `/api/auth/login`, the Node.js/Express backend validates the password using `bcryptjs`.
   - Upon successful verification, the backend generates a signed **JWT token** containing the user's ID and payload, which is sent back to the client.

2. **Client-side Session Storage:**
   - The frontend stores the received token and user profile in `localStorage`.
   - Subsequent API requests attach this token inside the HTTP `Authorization` header (`Bearer <token>`).

3. **Protected Routes & Middleware:**
   - On the backend, restricted endpoints (Leads, Companies, Tasks) are guarded by an authentication middleware (`authMiddleware`).
   - The middleware verifies the JWT token signature using the secret key (`JWT_SECRET`). If missing or invalid, access is denied with a `401 Unauthorized` status.

4. **Frontend Route Protection:**
   - React Router monitors authentication status to prevent unauthenticated users from directly navigating to sub-pages (`/dashboard`, `/leads`, `/companies`, `/tasks`).

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router DOM, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
- **Hosting / Deployment:**
  - Frontend: **Vercel**
  - Backend: **Render**
