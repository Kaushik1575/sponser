# Sponsor Panel

A dedicated portal for vehicle sponsors to manage their fleet and earnings.

## Project Structure

This project is organized as a monorepo:

*   **`frontend/`**: The React + Vite application for the Sponsor Dashboard.
*   **`backend/`**: The Express + Node.js API server for processing data.

## Getting Started

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Configure environment variables:
- Rename `.env.example` to `.env`
- Add your Supabase URL, Keys, and JWT Secret.

Start the server:
```bash
npm run dev
```
The server will run on `http://localhost:3005`.

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the application:
```bash
npm run dev
```
The application will open at `http://localhost:5173`.

## Authentication
This panel uses a separate authentication system for Sponsors. Sponsors register and log in independently from the main RentHub customer platform.
