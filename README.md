# 🏥 MedRex - AI-Powered Healthcare Management Platform

MedRex is a full-stack healthcare platform designed to simplify healthcare workflows through secure authentication, medical record management, and AI-powered medical report analysis. The platform enables users to securely access healthcare services while leveraging AI to assist in understanding and analyzing medical information.

## 🌐 Live Demo

**Frontend:** https://medrx-frontend-f8k6.onrender.com/

---

## 🚀 Features

### 🔐 Authentication & Security

* User Registration & Login
* JWT-Based Authentication
* Secure Cookie-Based Sessions
* Protected Routes
* Logout with Token Blacklisting
* Password Hashing using bcrypt

### 🏥 Healthcare Management

* Patient/User Management
* Medical Information Handling
* Secure Data Storage
* Responsive Dashboard Experience

### 🤖 AI-Powered Analysis

* AI-assisted medical report interpretation
* Healthcare information insights
* Intelligent healthcare assistance
* API-based AI integration

### 🎨 User Experience

* Modern Responsive UI
* Fast Navigation using React Router
* Context-Based Global State Management
* Loading States & Error Handling

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Context API
* SCSS
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js
* Cookie Parser
* CORS

### Database

* MongoDB Atlas
* Mongoose ODM

### AI & APIs

* AI Model Integration
* REST APIs
* Third-Party AI Services

### Deployment

* Render

---

## 📂 Project Structure

```bash
MedRex
│
├── Backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
└── Frontend
    ├── src
    │   ├── features
    │   ├── style
    │   ├── App.jsx
    │   ├── app.routes.jsx
    │   └── main.jsx
    └── package.json
```

## 🔑 Authentication Flow

```text
User Login/Register
        │
        ▼
Backend Validation
        │
        ▼
JWT Token Generated
        │
        ▼
Stored in Secure Cookie
        │
        ▼
Protected Route Access
        │
        ▼
User Authorized
```

### Security Measures

* JWT Token Authentication
* Password Hashing with bcrypt
* Cookie-Based Authentication
* Route Protection Middleware
* Token Blacklisting on Logout
* Environment Variable Protection

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/medrex.git

cd medrex
```

---

### Backend Setup

```bash
cd Backend

npm install
```

Create `.env`

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Run Backend

```bash
npm run dev
```

or

```bash
nodemon server.js
```

---

### Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

Backend runs on:

```bash
http://localhost:3000
```

---

## 🔌 API Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

---

#### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

#### Logout

```http
GET /api/auth/logout
```

---

#### Get Current User

```http
GET /api/auth/get-me
```

Protected Route

---

## 🧠 AI Integration

MedRex integrates AI-powered healthcare assistance to analyze medical reports and provide intelligent insights. The AI layer is connected through API integrations and is designed to support healthcare-related decision-making and report interpretation.

---

## 📈 Future Enhancements

* Doctor Dashboard
* Appointment Booking System
* Medical Report Uploads
* OCR-Based Prescription Reading
* AI Chat Assistant
* E-Prescriptions
* Healthcare Analytics Dashboard
* Multi-Role Authentication
* Real-Time Notifications
* Hospital Management Module

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

## 👨‍💻 Author

### Joydip Deb

Computer Science Student | Full-Stack Developer

* LinkedIn: https://www.linkedin.com/in/joydipdeb7/
* Email: [joydip.insight@gmail.com](mailto:joydip.insight@gmail.com)

---

## ⭐ Support

If you found this project useful, please consider giving it a star on GitHub.
