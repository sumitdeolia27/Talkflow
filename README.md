# TalkFlow

TalkFlow is a full-stack social networking app built with React, Vite, Express, MongoDB, and Firebase Authentication. It includes posts, stories, profiles, connections, private messages, notifications, dark mode, and basic call controls for chat.

## Features

- Modern landing page and authentication flow
- Firebase email/password and Google login
- User profiles with cover area, avatar, bio, location, joined date, and profile tabs
- Feed with posts, images, likes, and post delete option for the post owner
- Stories bar
- Discover page for finding users
- Connection system with followers, following, pending requests, and connections
- Private messaging between connected users
- Notification bell for messages, calls, and connection requests
- Unread message and connection request badges
- Audio and video call UI with call signaling support
- Light and dark mode
- Responsive sidebar layout
- Image uploads through ImageKit
- Inngest integration for background workflows
- Nodemailer SMTP support

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Firebase client SDK
- Axios
- Lucide React icons

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Firebase Admin SDK
- ImageKit
- Inngest
- Nodemailer
- Multer

## Project Structure

```txt
pingup-full-stack/
+-- client/          # React + Vite frontend
+-- server/          # Express backend API
+-- README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas database
- Firebase project with Authentication enabled
- ImageKit account
- SMTP credentials if you want email features

## Environment Variables

Create these files before running the app.

### `client/.env`

```env
VITE_BASEURL=http://localhost:4000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### `server/.env`

```env
FRONTEND_URL=http://localhost:5173

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_PRIVATE_KEY=your_firebase_admin_private_key

MONGODB_URI=your_mongodb_connection_string

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

SENDER_EMAIL=your_sender_email
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

Do not commit real `.env` files. Keep keys and passwords private.

## MongoDB Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add your IP address in Network Access.
4. Copy the MongoDB connection string.
5. Replace `<db_password>` with the database user's password.
6. Put the full connection string in `server/.env` as `MONGODB_URI`.

Example format:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

The backend connects using the app database name configured in `server/configs/db.js`.

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication.
3. Enable Email/Password and Google sign-in providers.
4. Copy the Firebase web app config into `client/.env`.
5. Create a Firebase Admin service account key.
6. Add the Admin SDK values to `server/.env`.

If phone login is disabled, do not enable or expose phone auth UI unless your Firebase region supports SMS.

## Install Dependencies

Open two terminals or run these one after another.

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

## Start The App

Run the backend first.

```bash
cd server
npm start
```

Backend runs at:

```txt
http://localhost:4000
```

Run the frontend in another terminal.

```bash
cd client
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

Open the frontend URL in the browser.

## Useful Commands

### Frontend

```bash
cd client
npm run dev
npm run build
npm run lint
npm run test
```

### Backend

```bash
cd server
npm start
npm run server
npm run test
```

`npm run server` uses nodemon for development. `npm start` uses plain Node.

## API Overview

Main API groups:

- `GET /` - health check
- `/api/user` - user profile, discovery, connection actions
- `/api/post` - feed, add post, like post, delete post
- `/api/story` - story upload and feed
- `/api/message` - messages, live message stream, call signaling
- `/api/inngest` - Inngest webhook endpoint

## Common Problems

### Database connection failed: bad auth

Your MongoDB username or password is wrong, or the password was not replaced in the connection string. Create a new database user in MongoDB Atlas and update `MONGODB_URI`.

### Firebase invalid credential

Check that the Firebase web config in `client/.env` belongs to the same Firebase project as the Admin SDK credentials in `server/.env`.

### Decoding Firebase ID token failed

The backend did not receive a full Firebase ID token. Log out, log in again, and make sure requests include:

```txt
Authorization: Bearer <firebase_id_token>
```

### Request failed with status code 404

Make sure the backend is running on port `4000` and restart it after changing routes:

```bash
cd server
npm start
```

### Vite ENOENT asset error

If Vite complains that an image or SVG is missing, restart the Vite dev server after fixing the asset path:

```bash
cd client
npm run dev
```

### Dark mode looks broken

Hard refresh the browser after frontend style changes. On Windows/Linux use:

```txt
Ctrl + F5
```

## Development Notes

- Restart the backend whenever backend route files or controllers change.
- Restart the frontend whenever Vite reports a missing asset that has already been fixed.
- Keep `VITE_BASEURL` pointed to the backend URL, usually `http://localhost:4000`.
- The app expects authenticated requests to include a Firebase ID token.

## Build For Production

Build the frontend:

```bash
cd client
npm run build
```

Start the backend:

```bash
cd server
npm start
```

Configure deployed environment variables for both frontend and backend before deployment.

## Deploy With Vercel And Render

Use this setup:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### 1. Push The Project To GitHub

Vercel and Render deploy easiest from GitHub.

```bash
git add .
git commit -m "Prepare TalkFlow deployment"
git push
```

If this is a new repository, create a GitHub repo first, then push your project to it.

### 2. Deploy Backend On Render

1. Go to Render.
2. Create a new Web Service.
3. Connect your GitHub repository.
4. Select the project repository.
5. Use these settings:

```txt
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Add these environment variables in Render:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_PRIVATE_KEY=your_firebase_admin_private_key
MONGODB_URI=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
SENDER_EMAIL=your_sender_email
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

Deploy the backend. After it finishes, Render will give you a backend URL like:

```txt
https://talkflow-backend.onrender.com
```

Test it in the browser:

```txt
https://talkflow-backend.onrender.com/
```

You should see:

```txt
Server is running
```

### 3. Deploy Frontend On Vercel

1. Go to Vercel.
2. Import the same GitHub repository.
3. Use these settings:

```txt
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Add these environment variables in Vercel:

```env
VITE_BASEURL=https://your-render-backend.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Deploy the frontend. Vercel will give you a URL like:

```txt
https://talkflow.vercel.app
```

### 4. Update Render After Vercel Deploys

After Vercel gives you the real frontend URL, go back to Render and update:

```env
FRONTEND_URL=https://your-real-vercel-url.vercel.app
```

Then redeploy the Render backend.

### 5. Update Firebase Authorized Domains

In Firebase Console:

1. Open Authentication.
2. Go to Settings.
3. Open Authorized domains.
4. Add your Vercel domain:

```txt
your-vercel-app.vercel.app
```

This is required for Google login to work in production.

### 6. MongoDB Atlas Network Access

For Render deployment, MongoDB Atlas must allow Render to connect.

The simple option:

```txt
0.0.0.0/0
```

This allows access from anywhere. For a real production app, use tighter network rules if your hosting provider gives fixed outbound IPs.

### 7. Production URL Checklist

Make sure these values point to the deployed URLs:

```txt
Vercel VITE_BASEURL -> Render backend URL
Render FRONTEND_URL -> Vercel frontend URL
Firebase Authorized domains -> Vercel frontend domain
MongoDB URI -> correct Atlas username and password
```

### 8. Common Deployment Errors

#### Frontend says request failed or 404

Check `VITE_BASEURL` in Vercel. It must be your Render backend URL, not `localhost`.

#### Google login fails on deployed site

Add the Vercel domain to Firebase Authorized domains.

#### Backend deploy fails on Render

Check that Render's root directory is `server` and the start command is:

```bash
npm start
```

#### MongoDB auth fails on Render

Check `MONGODB_URI`, database username, database password, and MongoDB Atlas Network Access.

#### Calls or real-time messages feel slow

Free Render services can sleep when inactive. Open the backend URL once, wait for it to wake up, then refresh the frontend.
