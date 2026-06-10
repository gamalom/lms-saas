# SaaS LMS — Server Notes

Development log of everything built so far (before pushing to git).

---

## 1. Project setup

- Initialized a **Node.js + Express + TypeScript** backend inside `server/`.
- Installed core packages:
  - `express` — HTTP server
  - `dotenv` — load env variables from `.env`
  - `nodemon` + `ts-node` — run TypeScript in dev (`npm start`)
  - `sequelize-typescript` + `mysql2` — ORM + MySQL driver
  - `bcrypt` — password hashing
  - `jsonwebtoken` — JWT auth tokens
- Added `tsconfig.json` with `strict: true`, decorators enabled for Sequelize models.
- Entry point: `server.ts` — starts Express app and connects to the database.

---

## 2. Environment variables (`.env`)

Created `.env` with:

| Variable     | Purpose              |
| ------------ | -------------------- |
| `PORT`       | Server port (3000)   |
| `DB_NAME`    | MySQL database name  |
| `DB_USER`    | MySQL username       |
| `DB_PASSWORD`| MySQL password       |
| `DB_HOST`    | MySQL host           |
| `DB_PORT`    | MySQL port (3306)    |
| `JWT_SECRET` | Secret key for JWT   |

> Do not commit `.env` to git. Keep secrets local only.

---

## 3. Database connection

**File:** `src/Database/connection.ts`

- Set up **Sequelize** with MySQL using values from `.env`.
- Auto-loads models from `src/Database/models/`.
- In `server.ts`:
  - `sequelize.authenticate()` — test DB connection
  - `sequelize.sync({ alter: false })` — sync models to DB tables

---

## 4. User model

**File:** `src/Database/models/model.user.ts`

Created the `users` table via Sequelize model:

| Field      | Type                                              |
| ---------- | ------------------------------------------------- |
| `id`       | UUID (primary key, auto-generated)                |
| `username` | string (required)                                 |
| `password` | string (required, stored hashed)                  |
| `email`    | string (unique)                                   |
| `role`     | enum: `super-admin`, `teacher`, `student`, `institute` (default: `student`) |
| timestamps | `createdAt`, `updatedAt`                          |

---

## 5. Express app & routes

**File:** `src/app.ts`

- `express.json()` and `express.urlencoded()` middleware for parsing request bodies.
- Mounted routes under `/api`:
  - Auth routes → `src/routes/globals/auth/auth.route.ts`
  - Institute routes → `src/routes/institute/institute.route.ts`

---

## 6. Auth — Register & Login

**Files:**
- `src/controller/globals/auth/auth.controller.ts`
- `src/routes/globals/auth/auth.route.ts`

### `POST /api/register`

- Body: `username`, `password`, `email` (all required).
- Hashes password with **bcrypt** (`hashSync`, salt rounds: 10).
- Creates user in `users` table.
- Returns `201` with created user.

### `POST /api/login`

- Body: `email`, `password` (both required).
- Finds user by email.
- Compares password with **bcrypt** `compareSync`.
- On success, signs a **JWT** with `{ id: user.id }`, expires in **30 days**.
- Returns `200` with `token`.

### Not yet implemented (planned)

- Logout
- Forgot password
- Reset password / OTP

---

## 7. Institute — Create (protected route)

**Files:**
- `src/controller/institute/institute.controller.ts`
- `src/routes/institute/institute.route.ts`

### `POST /api/institute` (requires login)

- Protected by `isLoggedIn` middleware.
- Body (required): `instituteName`, `instituteAddress`, `institutePhoneNumber`, `instituteEmail`
- Body (optional): `instituteVatNumber`, `institutePanNumber`
- Generates a random 6-digit `instituteNumber`.
- Creates a **new MySQL table** per institute: `institute_<number>` with columns for name, address, phone, email, VAT, PAN, and timestamps.
- Inserts the institute record into that table.
- Returns `200` with `instituteNumber`.

> Each institute gets its own table — multi-tenant style, one table per institute.

---

## 8. Auth middleware — `isLoggedIn`

**File:** `src/middlewate/middleware.ts`

Steps the middleware performs:

1. Reads `Authorization` header — returns `401` if missing.
2. Verifies JWT with `jwt.verify` using `JWT_SECRET`.
3. On invalid/expired token → `401`.
4. Looks up user in DB via `User.findByPk(decoded.id)`.
5. If user not found → `401`.
6. Attaches user to `req.user` and calls `next()`.

Used on: `POST /api/institute`

---

## 9. TypeScript — extend Express `Request`

**File:** `src/types/express.d.ts`

- Express `Request` does not have `user` by default.
- Added module augmentation so `req.user` is typed as `User | undefined` across the project.
- Also added local `IExtendedRequest` interface in middleware as an extra type hint.

---

## 10. Project structure (current)

```
server/
├── server.ts                          # Entry point
├── src/
│   ├── app.ts                         # Express app + route mounting
│   ├── Database/
│   │   ├── connection.ts              # Sequelize MySQL connection
│   │   └── models/
│   │       └── model.user.ts          # User model
│   ├── controller/
│   │   ├── globals/auth/
│   │   │   └── auth.controller.ts     # register, login
│   │   └── institute/
│   │       └── institute.controller.ts # create institute
│   ├── middlewate/
│   │   └── middleware.ts              # isLoggedIn JWT middleware
│   ├── routes/
│   │   ├── globals/auth/
│   │   │   └── auth.route.ts
│   │   └── institute/
│   │       └── institute.route.ts
│   └── types/
│       └── express.d.ts               # req.user type extension
├── package.json
├── tsconfig.json
└── .env
```

---

## 11. How to run

```bash
cd server
npm install
# make sure MySQL is running and .env is configured
npm start
```

Server runs on `http://localhost:3000` (or whatever `PORT` is set to).

---

## 12. Git commits so far

| Commit   | What was added                              |
| -------- | ------------------------------------------- |
| `first commit` | Project scaffold, DB, User model, auth routes |
| `upto bcrypt` | bcrypt hashing in register/login            |
| `upto create institute` | Institute controller + route          |
| `islogged in middleware` | JWT middleware, protect institute route, Express types |

---

## 13. Quick API test flow

1. **Register** → `POST /api/register`
2. **Login** → `POST /api/login` → copy the `token`
3. **Create institute** → `POST /api/institute` with header:
   ```
   Authorization: <token>
   ```
