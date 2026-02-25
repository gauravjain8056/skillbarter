# 🔄 SkillBarter - P2P Skill Exchange Platform

A full-stack web application designed to help students and professionals exchange knowledge without financial transactions. Users can offer skills they are proficient in, request to learn skills from others, and coordinate their learning sessions via real-time chat.

## 🚀 Live Demo
**[https://skillbarter-flax.vercel.app/]**

## 📖 Project Overview
SkillBarter solves the problem of accessible education by creating a peer-to-peer marketplace for skills. Rather than paying for courses, users trade their expertise. The platform handles the complete lifecycle of a barter request: from secure user authentication and profile creation, to a relational request system (Inbox), down to real-time WebSocket-powered communication once a barter is accepted.

## ✨ Key Features
- **Secure Authentication:** Complete registration and login system using JWT and Bcrypt.
- **Barter Request System:** Browse available skills and send targeted barter requests (e.g., "I will teach you React if you teach me DSA").
- **Centralized Inbox:** A dynamic dashboard to view active, accepted barters and initiate communication.
- **Real-Time Messaging:** Live, bi-directional chat implemented with Socket.io for users with accepted barter agreements.
- **Responsive UI:** Modern, dark-themed user interface built with Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios, Socket.io-client
- **Backend:** Node.js, Express.js, MongoDB & Mongoose, Socket.io (WebSockets), JWT & Bcrypt

## 💻 Local Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/gauravjain8056/skillbarter.git
cd skillbarter
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend client:

```bash
npm run dev
```

## 🧠 Engineering & Architecture Decisions

* **Separation of Concerns:** Strict MVC-like architecture on the backend for scalable API management.
* **WebSocket Room Isolation:** Predictive room-ID generation combining user IDs to ensure private, isolated Socket.io connections between bartering partners.
* **Optimized Data Fetching:** Utilized MongoDB's `.populate()` method to minimize database queries when rendering the Inbox and chat relationships.

## 👤 Author

**Gaurav Jain**

* GitHub: [@gauravjain8056](https://github.com/gauravjain8056)

