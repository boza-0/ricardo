# Ricardo

Simple Angular + Express + MySQL authentication demo with registration and login.

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

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuarios_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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

Frontend routes:

```text
http://localhost:4200/login
http://localhost:4200/register
```

Backend health check:

```text
http://localhost:3000/health
```

Backend auth endpoints:

```text
POST http://localhost:3000/register
POST http://localhost:3000/login
```
