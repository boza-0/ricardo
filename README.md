# Ricardo

Simple Angular + Express + MySQL registration demo.

## Start Locally

Install dependencies:

```powershell
cd backend
npm install

cd ../frontend
npm install
```

Create the MySQL database and table:

```sql
CREATE DATABASE ricardo_db;
USE ricardo_db;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);
```

Start the backend:

```powershell
cd backend
node server.js
```

Start the frontend in another terminal:

```powershell
cd frontend
npm start
```

Open:

```text
http://localhost:4200
```

Backend health check:

```text
http://localhost:3000/health
```
