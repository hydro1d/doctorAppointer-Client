# DocAppoint 🩺 
> **Hi! I'm Sourabh Baura, and this is DocAppoint**—a full-stack MERN application I built to make finding and scheduling medical appointments smooth, secure, and beautiful. 

DocAppoint features a premium glassmorphic visual style with a custom responsive layout system. Under the hood, it's powered by secure session-persistent JWT authentication, dynamic light/dark modes, and live data models connected directly to MongoDB Atlas.

💻 **Live Client URL:** [https://doctor-appointer-client.vercel.app](https://doctor-appointer-client.vercel.app)  
⚙️ **Live Backend API URL:** [https://docappoint-api.onrender.com](https://docappoint-api.onrender.com)

---

## ✨ Standout Features I Built

Here are five key features of DocAppoint that I'm especially proud of:

1. **🎨 Dynamic Dual-Theme & Responsive UI Design**
   - I designed this interface from scratch using vanilla CSS variables with carefully tuned HSL color tokens.
   - It features dynamic transitions between light and dark mode, premium glassmorphism panels, and highly interactive micro-animations (like hover shifts and custom spinners) that render beautifully on both mobile screens and large desktop monitors.

2. **🔍 Server-Side Live Search & Sorting**
   - I implemented real-time filtering where patients can instantly search for clinical specialists by name (case-insensitive).
   - I also built a server-driven sorting drop-down so users can sort the specialist cards by **Consultation Fee (low-to-high or high-to-low)** or **Average Patient Rating** on the fly.

3. **🛡️ Live Password Security Rules Panel**
   - Security is essential, so I created a reactive feedback panel on the Registration form.
   - As the user types their password, the interface dynamically runs regex tests to check for **at least 1 uppercase letter**, **1 lowercase letter**, and a **minimum length of 6 characters**, blocking submission until all indicators turn green.

4. **⚡ Patient Appointment CRUD Dashboard**
   - **Create:** Bookings are created via scheduling modals that pull the doctor's specific slots.
   - **Read:** The private dashboard organizes all booked appointments clearly.
   - **Update:** Users can update their booked appointment details through a pre-filled edit modal. To protect backend data integrity, critical parameters like the doctor's name and user's email are strictly locked as read-only.
   - **Delete:** Patients can instantly cancel bookings with real-time UI state updates—no page reloads required!

5. **🔁 Session-Resilient Navigation (Reload Protection)**
   - I engineered an asynchronous state checking pattern in `PrivateRoute.jsx` with a custom clinical loader.
   - This ensures that when a logged-in patient reloads their browser from any private page (such as `/dashboard`), they are not redirected back to the login screen and the page does not crash!

---

## 🛠️ Tech Stack & Packages I Used

- **Frontend:** React (Vite SPA), React Router v6, Lucide Icons, Pure Vanilla CSS (Variables & HSL themes).
- **Backend:** Node.js, Express, JSON Web Tokens (JWT), bcrypt.js (for password hashing).
- **Database:** MongoDB (Mongoose ODM).
- **Hosting:** Client on Vercel, Server on Render, Database on MongoDB Atlas.

---

## 🚀 Running the Project Locally

If you want to run this application on your local machine, follow these steps:

### Prerequisites
- Node.js installed (v18+ recommended)
- A running local MongoDB instance or Atlas connection

### 1. Server Setup (`/server`)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `/server` directory and add your keys:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/docappoint
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. **Seed the database** with the 6 clinical doctor profiles I curated:
   ```bash
   npm run seed
   ```
5. Start the API server:
   ```bash
   npm run dev
   ```

---

### 2. Client Setup (`/client`)
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```
   *The client will boot up locally at `http://localhost:5173`.*

---

## 👨‍💻 Author & Lead Developer

*   **Developer:** Sourabh Baura
*   **Role:** Full-Stack Web Developer
*   **Technologies:** MERN Stack, UI/UX Engineering, Database Design
*   **Contact/GitHub:** [hydro1d](https://github.com/hydro1d)

---

## ⚖️ Custom System Rules
- **No standard alerts:** I custom-built a sliding glassmorphic Toast notification queue to handle all successful bookings, registrations, updates, and errors without ever using default browser alerts.
- **Data Integrity:** Ensured that update forms keep the patient email and practitioner name entirely read-only both in the frontend views and inside the backend API request handlers.
