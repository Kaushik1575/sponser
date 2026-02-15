# Deployment Guide for Sponsor App

This guide will help you deploy the **Frontend to Vercel** and **Backend to Render**.

## Prerequisites
1. Ensure all your code is pushed to your GitHub repository.
2. You need accounts on [Vercel](https://vercel.com) and [Render](https://render.com).
3. Access to your Supabase credentials (URL, Key) and Database connection string.

---

## Part 1: Deploy Backend to Render

1. **Log in to Render Dashboard**.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. **Configuration**:
   - **Name**: `sponsor-panel-backend` (or your choice)
   - **Region**: Closest to your users (e.g., Singapore, Oregon).
   - **Branch**: `main` (or your working branch).
   - **Root Directory**: `backend` (IMPORTANT!).
   - **Runtime**: `Node`.
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. **Environment Variables**:
   Add the following variables (copy values from your `.env` file):
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `JWT_SECRET`
   - `PORT`: `10000` (Optional, Render sets this automatically).
6. Click **Create Web Service**.
7. **Wait for deployment** to finish.
8. **Copy the Backend URL** (e.g., `https://sponsor-panel-backend.onrender.com`). You will need this for the Frontend deployment.

*Alternative (Advanced): Use the `render.yaml` file included in the root by selecting "Blueprints" in Render.*

---

## Part 2: Deploy Frontend to Vercel

1. **Log in to Vercel Dashboard**.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. **Project Configuration**:
   - **Framework Preset**: `Vite` (should be detected automatically).
   - **Root Directory**: Click **Edit** and select the `frontend` folder.
5. **Build & Output Settings**:
   - The defaults (`npm run build`, `dist`) should be correct.
6. **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com/api`
   *(Replace with the actual URL from Part 1. Make sure to include `/api` if your backend routes require it, which based on your code, they do.)*
7. Click **Deploy**.

---

## Troubleshooting

- **CORS Issues**: If the frontend cannot talk to the backend, ensure the Backend URL in Vercel's environment variables is exactly correct (https vs http, trailing slash, etc.).
- **Build Fails**: Check the build logs on Vercel/Render. Ensure dependencies are correct in `package.json`.
- **White Screen on Frontend**: Check the browser console. If you see 404s for assets, ensure `base` in `vite.config.js` is correct (default `/` is usually fine).
