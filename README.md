# Gator Gems

## Installation Instructions

This web app uses **npm** and **uv** as package managers, so setup is straightforward.

### 1. Clone the Repository

```bash
git clone https://github.com/UF-CEN3031-GROUP-1/Gator-Gems.git
cd Gator-Gems/
```

---

### 2. Install Dependencies

#### Backend

```bash
cd backend/
uv sync
cd ..
```

#### Frontend

```bash
cd frontend/
npm install
cd ..
```

---

## Running the Application

Once all dependencies are installed, you can start the app. The project uses `just` as a command runner from the base directory.

### Start Backend Server

```bash
just backend dev
```

### Start Frontend Server

```bash
just frontend dev
```

---

## Accessing the App

* Frontend: [http://localhost:3000/](http://localhost:3000/)
* Backend API Docs (Swagger UI): [http://localhost:8000/](http://localhost:8000/)

---

## Stopping the Servers

To stop the servers, press:

```bash
Ctrl + C
```

in the terminal where they are running.
