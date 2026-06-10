# SaaS LMS — Server

Node.js + Express + TypeScript backend for the SaaS LMS. Uses Sequelize with MySQL, JWT auth, and a per-institute multi-tenant table strategy.

---

## 1. Project setup

- **Stack:** Node.js, Express 5, TypeScript, Sequelize-TypeScript, MySQL
- **Entry point:** `server.ts` — starts Express and connects to the database
- **Dev:** `nodemon` + `ts-node` via `npm start`
- **Key packages:**
  - `express` — HTTP server
  - `dotenv` — load env variables from `.env`
  - `sequelize-typescript` + `mysql2` — ORM + MySQL driver
  - `bcrypt` — password hashing
  - `jsonwebtoken` — JWT auth tokens

`tsconfig.json` uses `strict: true` with decorators enabled for Sequelize models.

---

## 2. Environment variables (`.env`)

| Variable      | Purpose              |
| ------------- | -------------------- |
| `PORT`        | Server port (e.g. 3000) |
| `DB_NAME`     | MySQL database name  |
| `DB_USER`     | MySQL username       |
| `DB_PASSWORD` | MySQL password       |
| `DB_HOST`     | MySQL host           |
| `DB_PORT`     | MySQL port (3306)    |
| `JWT_SECRET`  | Secret key for JWT   |

> Do not commit `.env` to git. Keep secrets local only.

---

## 3. Database connection

**File:** `src/Database/connection.ts`

- Sequelize instance configured from `.env`
- Auto-loads models from `src/Database/models/`
- In `server.ts`:
  - `sequelize.authenticate()` — test DB connection
  - `sequelize.sync({ alter: true })` — sync models to DB tables

---

## 4. User model

**File:** `src/Database/models/model.user.ts`

| Field         | Type                                              |
| ------------- | ------------------------------------------------- |
| `id`          | UUID (primary key, auto-generated)                |
| `username`    | string (required)                                 |
| `password`    | string (required, stored hashed)                  |
| `email`       | string (unique)                                   |
| `role`        | enum: `super-admin`, `teacher`, `student`, `institute` (default: `student`) |
| `instituteId` | string (nullable) — set when user creates an institute |
| timestamps    | `createdAt`, `updatedAt`                          |

---

## 5. Express app & routes

**File:** `src/app.ts`

- `express.json()` and `express.urlencoded()` for request body parsing
- Routes mounted under `/api`:
  - Auth → `src/routes/globals/auth/auth.route.ts`
  - Institute → `src/routes/institute/institute.route.ts`

All async route handlers are wrapped with `asyncErrorHandler` (see section 9).

---

## 6. Auth — Register & Login

**Files:**
- `src/controller/globals/auth/auth.controller.ts`
- `src/routes/globals/auth/auth.route.ts`

### `POST /api/register`

- **Body:** `username`, `password`, `email` (all required)
- Returns `400` if any field is missing
- Hashes password with **bcrypt** (`hashSync`, salt rounds: 10)
- Creates user in `users` table
- Returns `201` with created user

### `POST /api/login`

- **Body:** `email`, `password` (both required)
- Returns `400` if fields are missing
- Returns `404` if user not found
- Returns `401` if password is invalid
- On success, signs a **JWT** with `{ id: user.id }`, expires in **30 days**
- Returns `200` with `token`

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

Protected by `isLoggedIn`. Runs a **middleware chain** that provisions all institute tables in one request:

| Step | Handler              | What it does |
| ---- | -------------------- | ------------ |
| 1    | `createInstitute`    | Creates institute table, links user, updates role |
| 2    | `createTeacherTable` | Creates `teacher_<number>` table |
| 3    | `createStudentTable` | Creates `student_<number>` table |
| 4    | `createCourseTable`  | Creates `course_<number>` table, sends response |

**Request body (required):** `instituteName`, `instituteAddress`, `institutePhoneNumber`, `instituteEmail`

**Request body (optional):** `instituteVatNumber`, `institutePanNumber`

**Step 1 — `createInstitute`:**

- Returns `400` if required fields are missing
- Generates a random 6-digit `instituteNumber`
- Creates table `institute_<number>` with institute details (phone and email are unique)
- Inserts the institute record
- Creates shared `user_institute` table (if not exists) linking `userId` → `instituteId`
- Inserts the current user's ID and institute number into `user_institute`
- Updates the user's `role` to `institute` and sets `instituteId` to the new institute number
- Passes `instituteNumber` to the next middleware via `req.instituteNumber`

**Step 2 — `createTeacherTable`:**

- Creates `teacher_<number>` with: `teacherName`, `teacherEmail`, `teacherPhoneNumber`

**Step 3 — `createStudentTable`:**

- Creates `student_<number>` with: `studentName`, `studentEmail`, `studentPhoneNumber`

**Step 4 — `createCourseTable`:**

- Creates `course_<number>` with: `courseName`, `courseDescription`, `courseDuration`, `courseFee`
- Returns `200` with `instituteNumber`

> Multi-tenant design: each institute gets its own set of tables (`institute_*`, `teacher_*`, `student_*`, `course_*`), plus a shared `user_institute` mapping table.

---

## 8. Auth middleware — `isLoggedIn`

**File:** `src/middlewate/middleware.ts`

1. Reads `Authorization` header — returns `401` if missing
2. Verifies JWT with `jwt.verify` using `JWT_SECRET`
3. On invalid/expired token → `401`
4. Looks up user in DB via `User.findByPk(decoded.id)`
5. If user not found → `401`
6. Attaches user to `req.user` and calls `next()`

Used on: `POST /api/institute`

---

## 9. Async error handling

**File:** `src/services/async.error.handling.ts`

Higher-order function that wraps async route/middleware handlers and catches rejected promises. On error, returns `500` with `message` and `fullError`.

Used on all auth and institute route handlers.

---

## 10. TypeScript — extend Express `Request`

**File:** `src/types/express.d.ts`

- Module augmentation adds `user?: User` to Express `Request`
- Institute controllers also use a local `IExtendedRequest` with `instituteNumber?: number` for the middleware chain

---

## 11. Project structure

```
server/
├── server.ts                              # Entry point
├── src/
│   ├── app.ts                             # Express app + route mounting
│   ├── Database/
│   │   ├── connection.ts                  # Sequelize MySQL connection
│   │   └── models/
│   │       └── model.user.ts              # User model
│   ├── controller/
│   │   ├── globals/auth/
│   │   │   └── auth.controller.ts         # register, login
│   │   └── institute/
│   │       └── institute.controller.ts    # institute + tenant tables
│   ├── middlewate/
│   │   └── middleware.ts                  # isLoggedIn JWT middleware
│   ├── routes/
│   │   ├── globals/auth/
│   │   │   └── auth.route.ts
│   │   └── institute/
│   │       └── institute.route.ts
│   ├── services/
│   │   └── async.error.handling.ts        # async try/catch wrapper
│   └── types/
│       └── express.d.ts                   # req.user type extension
├── package.json
├── tsconfig.json
└── .env
```

---

## 12. How to run

```bash
cd server
npm install
# make sure MySQL is running and .env is configured
npm start
```

Server runs on `http://localhost:3000` (or whatever `PORT` is set to).

---

## 13. Quick API test flow

1. **Register** → `POST /api/register`
   ```json
   { "username": "admin", "password": "secret", "email": "admin@example.com" }
   ```

2. **Login** → `POST /api/login` → copy the `token`
   ```json
   { "email": "admin@example.com", "password": "secret" }
   ```

3. **Create institute** → `POST /api/institute` with header:
   ```
   Authorization: <token>
   ```
   ```json
   {
     "instituteName": "Acme Academy",
     "instituteAddress": "123 Main St",
     "institutePhoneNumber": "+1234567890",
     "instituteEmail": "info@acme.edu"
   }
   ```

   Response includes `instituteNumber`. The user's role is updated to `institute` and all tenant tables are created automatically.

---

## 14. Git history

| Commit                    | What was added |
| ------------------------- | -------------- |
| `first commit`            | Project scaffold, DB, User model, auth routes |
| `upto bcrypt`             | bcrypt hashing in register/login |
| `upto create institute`   | Institute controller + route |
| `islogged in middleware`  | JWT middleware, protect institute route, Express types |
| `readme`                  | Server documentation |
