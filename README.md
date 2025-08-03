# DevConnect: A Full-Stack Community Platform

DevConnect is a modern, full-stack social media application designed for professionals to connect, share ideas, and showcase their work. Built with the MERN stack, it features a robust backend API and a dynamic, responsive frontend.

**Live Demo:** [https://kunj-linkedin-clone.vercel.app/](https://www.google.com/search?q=https://kunj-linkedin-clone.vercel.app/)
 
-----

### ✨ Features

  * **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
  * **Dynamic Community Feed**: A central feed on the homepage that displays posts from all users in chronological order.
  * **Rich Post Creation**:
      * Create posts with text content (up to 500 characters).
      * Upload multiple images (up to 5) with a post.
  * **Post Interaction**:
      * **Like and Unlike** posts.
      * **Comment** on posts to engage in discussions.
      * Users can **edit or delete** their own posts.
  * **User Profiles**:
      * View detailed user profiles with their name, bio, join date, and profile picture.
      * Users can **update their bio and profile picture** directly from their profile page.
      * Profile pages display all posts made by that specific user.
  * **User Experience**:
      * **Dark and Light Mode** toggle for user comfort.
      * **Interactive Image Viewer** with a full-screen modal for viewing post images.
      * **Real-time feedback** with loading states and toast notifications for user actions.
      * Fully **responsive design** that works seamlessly on desktop and mobile devices.

-----

### 🛠️ Tech Stack

This project is built with a modern MERN stack, ensuring a scalable and efficient application.

  * **Frontend**:
      * **Framework**: React 18 with Vite
      * **Language**: TypeScript
      * **Styling**: Tailwind CSS
      * **Routing**: React Router DOM
      * **API Communication**: Axios
      * **Icons**: Lucide React
  * **Backend**:
      * **Runtime**: Node.js
      * **Framework**: Express
      * **Database**: MongoDB with Mongoose ODM
      * **Authentication**: JSON Web Tokens (JWT) & Bcrypt for password hashing.
      * **Image Uploads**: Multer for handling multipart/form-data.
  * **Deployment**:
      * **Frontend**: Vercel
      * **Backend**: Render

-----

### 🚀 Getting Started

**Prerequisites:**

  * Node.js (v18.x or higher)
  * npm or yarn
  * MongoDB Atlas account or a local MongoDB instance

**1. Clone the repository:**

```bash
git clone https://github.com/kunjbhatia23/LinkedIn_Clone.git
cd LinkedIn_Clone
```

**2. Backend Setup:**

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file based on .env.example
# Add your MONGODB_URI and a custom JWT_SECRET
cp .env.example .env

# Start the backend server
npm run dev
```

**3. Frontend Setup:**

```bash
# From the root directory, navigate to the client
cd .. 

# Install dependencies
npm install

# Add your backend API URL to a new .env file
# Create a file named .env and add the following line:
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start the frontend development server
npm run dev
```

The application should now be running locally\!

-----

### 🔑 Environment Variables

To run and deploy the project, you need to set the following environment variables.

#### **Backend (`/server/.env`)**

  * `MONGODB_URI`: Your MongoDB connection string.
  * `JWT_SECRET`: A long, random, and secret string for signing tokens.
  * `CLIENT_URL`: The URL of your deployed frontend (e.g., `https://your-app.vercel.app`) to configure CORS.
  * `PORT`: The port for the server to run on (defaults to 5000).

#### **Frontend (`/.env`)**

  * `VITE_API_BASE_URL`: The full URL to your deployed backend API (e.g., `https://your-api.onrender.com/api`).