# DocAppoint 🩺
> **DocAppoint** is an ultra-premium, full-stack Doctor Appointment Booking and Clinical Management portal designed with modern aesthetics (glassmorphism), responsive dual-theme custom styling (CSS Variables), and secure JWT session recovery.

🌐 **Live Deployment URL (Client side):** [https://docappoint-client.vercel.app](https://docappoint-client.vercel.app)
🌐 **Live Deployment URL (Server API):** [https://docappoint-api.render.com](https://docappoint-api.render.com)

---

## 🌟 Standout Features

DocAppoint is built to deliver an outstanding patient and practitioner experience. Five core features include:

1. **🎨 Premium Dual-Theme & Glassmorphism Design System**
   - Features a custom, harmonious vanilla HSL-based color palette supporting instantaneous dynamic light/dark modes.
   - Micro-animations, responsive layout transitions, and glassmorphism hover panels deliver a state-of-the-art visual experience.
   
2. **🔍 Advanced Server-Driven Search & Sorting**
   - Features an interactive real-time search engine queryable by doctor name (case-insensitive).
   - Dynamic sorting dropdown enabling patients to arrange specialist results instantly by **Consultation Fee (low-to-high or high-to-low)** or **Patient Satisfaction Rating**.

3. **🛡️ Live Password Security Rules Panel**
   - Interactive security engine assessing registration passwords on-the-fly.
   - Renders dynamic color indicators checking for at least **1 uppercase letter**, **1 lowercase letter**, and a **minimum length of 6 characters** before enabling user submission.

4. **⚡ Complete Patient Booking CRUD Control**
   - **Create**: Beautiful overlay scheduling modals dynamically populating doctor availability slots.
   - **Read**: Dynamic tabbed Dashboard showing full histories.
   - **Update**: Interactive update forms with locked read-only fields (Doctor Name and Email) to maintain strict data integrity.
   - **Delete**: Cancellations with instant layout updating and without browser page reloads.

5. **🔁 Session-Resilient Navigation (Refresh-Safe Private Routes)**
   - Protects private patient dashboards and details pages using an asynchronous state loading spinner.
   - Prevents unauthenticated page errors and ensures logged-in patients are never redirected back to the login screen on browser reloads.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite SPA), React Router v6, Lucide Icons, Pure Vanilla CSS (dual-theme styling variables).
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), bcrypt.js.
- **Database**: MongoDB (Mongoose ODM).

---

## 💻 Local Installation & Setup

Follow these simple steps to run both the frontend client and backend server locally.

### Prerequisites
- Node.js installed (v18+ recommended)
- A running MongoDB instance (Local or Atlas cloud cluster)

---

### 1. Server Setup (`/server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install server-side dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `/server` directory and add your configurations:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/docappoint
   JWT_SECRET=super_secret_clinical_key_99
   ```
4. **Seed the database** (Populates MONGODB with 6 detailed top-rated specialist profiles):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start running at `http://localhost:5000`.*

---

### 2. Client Setup (`/client`)

1. Navigate to the client folder in a new terminal window:
   ```bash
   cd client
   ```
2. Install client-side dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client will start running at `http://localhost:5173`.*

---

## 🗂️ Project Directory Layout

```
d:/ass9/
├── client/                     # React Vite Single Page App
│   ├── src/
│   │   ├── components/         # PrivateRoute, Navbar, Footer, Toast, Spinner
│   │   ├── context/            # AuthContext (Handles global state & toasts)
│   │   ├── pages/              # Home, AllAppointments, DoctorDetails, Login, Register, Dashboard, NotFound
│   │   ├── App.jsx             # SPA Routes wiring
│   │   ├── index.css           # Premium Custom Styles & Dual-Theme CSS variables
│   │   └── main.jsx            # React root bootstrap
│   ├── package.json
│   └── README.md               # Client documentation
│
└── server/                     # Express REST API
    ├── models/                 # User, Doctor, Booking schemas
    ├── middleware/             # auth verification middleware
    ├── routes/                 # auth, doctors, bookings endpoint routers
    ├── seedDoctors.js          # Database clinical profile seed script
    ├── index.js                # Core API entry point
    └── package.json
```

---

## ⚖️ Security and Integrity Enforcements

- **No default alerts used**: All success/error messages are delivered using a beautiful slide-in Toast notification queue.
- **Strict Read-Only Fields**: Patient registration emails and booked Doctor Names are strictly locked from updates in the booking modals (enforced on both client-side elements and backend routing layers).
- **Hashed Credentials**: All passwords are encrypted with a 10-salt-round bcrypt hashing algorithm prior to MongoDB write.
