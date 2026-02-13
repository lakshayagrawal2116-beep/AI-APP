live link :https://nexai-lxp5.onrender.com/

# 🚀 NexAI – AI SaaS Platform

NexAI is a **full-stack AI SaaS application** that provides multiple AI-powered tools such as article generation, blog title generation, image generation, background removal, object removal, resume review, and a community showcase — all secured with **Clerk authentication and subscription-based access control**.

---

## ✨ Features

### 🔐 Authentication & Subscriptions

* Secure authentication using **Clerk**
* Free & Premium plan support
* Feature gating based on subscription
* Free usage limits for non-premium users

### 🧠 AI Tools

* **AI Article Generator**
* **AI Blog Title Generator**
* **AI Code Explainer/Reviewer**
* **AI Image Generator** (Premium)
* **Image Background Removal** (Premium)
* **Object Removal from Images** (Premium)
* **Resume Review (PDF upload)** (Premium)

### 🌍 Community

* Public AI creations feed
* Like / Unlike creations
* User-specific dashboard

### ☁️ Media & Storage

* Images handled via **Cloudinary**
* Database powered by **Neon (PostgreSQL)**

---

## 🛠️ Tech Stack

### Frontend

* **React + Vite**
* **Tailwind CSS**
* **Axios**
* **Clerk (Auth & Billing)**
* **Lucide Icons**
* **React Markdown**

### Backend

* **Node.js + Express**
* **Google Gemini API**
* **Cloudinary**
* **Neon PostgreSQL**
* **Multer (file uploads)**
* **Clerk Middleware**

---

## 📂 Project Structure

```
QuickAI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── main.jsx
│
├── server/
│   ├── controllers/
│   │   ├── aiController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   └── userRoutes.js
│   ├── configs/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── multer.js
│   ├── middlewares/
│   │   └── auth.js
│   └── server.js
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the **server** directory:

```env
DATABASE_URL=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

GOOGLE_API_KEY=

CLIPDROP_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/lakshayagrawal2116-beep/AI-APP.git
cd QuickAI
```

### 2️⃣ Install Dependencies

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd server
npm install
```

---

### 3️⃣ Run the Project

#### Start Backend

```bash
cd server
npm run dev
```

#### Start Frontend

```bash
cd client
npm run dev
```

---

## 🔑 Clerk Setup Notes

* Enable **JWT authentication**
* Configure **Premium plan** inside Clerk Dashboard
* Make sure `has({ plan: "premium" })` is enabled
* Assign plan metadata after successful subscription

---

## 📌 API Endpoints

### AI Routes

| Method | Endpoint                          | Description          |
| ------ | --------------------------------- | -------------------- |
| POST   | `/api/ai/generate-article`        | Generate AI article  |
| POST   | `/api/ai/generate-blog-title`     | Generate blog titles |
| POST   | `/api/ai/generate-image`          | AI image generation  |
| POST   | `/api/ai/remove-image-background` | Remove background    |
| POST   | `/api/ai/remove-image-object`     | Remove object        |
| POST   | `/api/ai/resume-review`           | Resume review        |

### User Routes

| Method | Endpoint                            | Description      |
| ------ | ----------------------------------- | ---------------- |
| GET    | `/api/user/get-user-creations`      | User creations   |
| GET    | `/api/user/get-published-creations` | Public creations |
| POST   | `/api/user/toggle-like-creation`    | Like / Unlike    |

---

## 🔐 Subscription Logic

* **Free users**

  * Limited AI usage (10 requests)
* **Premium users**

  * Unlimited usage
  * Access to image & resume tools

---

## 🧪 Testing Tips

* Use **Postman** with Clerk JWT
* Check `req.plan` and `req.free_usage`
* Validate uploads via Multer

---

## 🌟 Future Improvements

* Usage analytics dashboard
* Payment history
* AI model selector
* Image gallery with download options
* Admin moderation panel

---

## 🧑‍💻 Author

**Lakshay Agrawal**

⚡ Full-Stack & AI Enthusiast

---




