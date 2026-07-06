# 🦊 Fox Book Store — Library Management System

A Library Management System for managing **e-books**, built as two projects:

| Part | Tech | Folder | Runs on |
|------|------|--------|---------|
| **Frontend** | Next.js 14 (React) | `frontend/` | http://localhost:3000 |
| **Backend API** | Java 17 + Spring Boot 3 | `backend/` | http://localhost:8080 |

E-book data is stored in an embedded **H2 database** (a file under
`backend/data/`), seeded on first run. **Data persists across restarts** — no
external database server to install.

---

## Features

- Browse the e-book catalog with a book-cover grid
- Live search by title, author, or genre
- Book detail pages with **Borrow** / **Return** (digital lending)
- Admin "Manage" page to **add**, **edit**, and **delete** e-books
- Live library stats (titles, copies, available, on-loan)
- Persistent storage via an embedded **H2 database**

---

## 🐳 Quick start with Docker (recommended)

Docker bundles Maven, the JDK, and Node — so you **don't need to install
anything else**. From `D:\FoxBookStore`:

```bash
docker compose up --build
```

Then open **http://localhost:3000**. The backend API is on
http://localhost:8080. The H2 database persists in a Docker volume
(`backend-data`), so your data survives `docker compose down`/`up`.

To stop: `Ctrl+C`, then `docker compose down` (add `-v` to also wipe the
database volume and re-seed on next start).

> First build downloads Maven/Node base images and dependencies, so it takes a
> few minutes. Later builds are cached and fast.

---

## ⚠️ Running without Docker — prerequisites (please read)

This project was scaffolded on a machine that was **missing two tools needed to
run it**. Install these first:

1. **Maven** (to run the Java backend) — https://maven.apache.org/download.cgi
   Java 17 is already installed on this machine; Maven is not. Verify with `mvn -v`.
2. **Node.js 18 or newer** (to run the Next.js frontend) — https://nodejs.org
   This machine only had Node v6, which cannot run Next.js. Verify with `node -v`.

> Tip: If you use an IDE like IntelliJ IDEA, it can run the Spring Boot app
> without a separate Maven install.

---

## Running the backend (Java / Spring Boot)

```bash
cd D:\FoxBookStore\backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. Quick check:

```bash
curl http://localhost:8080/api/books
```

The H2 database file is created at `backend/data/foxbookstore.mv.db`. You can
browse it at **http://localhost:8080/h2-console** (JDBC URL
`jdbc:h2:file:./data/foxbookstore`, user `sa`, no password).

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/books` | List all books (`?search=term` to filter) |
| GET | `/api/books/{id}` | Get one book |
| GET | `/api/books/stats` | Aggregate counts |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Remove a book |
| POST | `/api/books/{id}/borrow` | Borrow one copy |
| POST | `/api/books/{id}/return` | Return one copy |

---

## Running the frontend (Next.js)

In a **second terminal** (keep the backend running):

```bash
cd D:\FoxBookStore\frontend
npm install
npm run dev
```

Open **http://localhost:3000**.

The API base URL is configured in `frontend/.env.local`
(`NEXT_PUBLIC_API_URL=http://localhost:8080/api`). Change it if your backend
runs elsewhere.

---

## Project structure

```
D:\FoxBookStore\
├── backend\                         # Java Spring Boot REST API
│   ├── pom.xml
│   └── src\main\
│       ├── java\com\foxbookstore\
│       │   ├── FoxBookStoreApplication.java
│       │   ├── config\WebConfig.java            # CORS for the frontend
│       │   ├── controller\BookController.java   # REST endpoints
│       │   ├── controller\GlobalExceptionHandler.java
│       │   ├── model\Book.java                  # JPA entity
│       │   ├── repository\BookRepository.java   # Spring Data JPA (H2)
│       │   └── service\BookService.java         # business logic + seed data
│       └── resources\application.properties     # H2 datasource config
└── frontend\                        # Next.js app (App Router)
    ├── package.json
    ├── .env.local
    └── app\
        ├── layout.js
        ├── page.js                  # home / catalog
        ├── globals.css
        ├── components\  (Navbar, BookCard)
        ├── lib\api.js               # API client
        ├── books\[id]\page.js       # detail + borrow/return
        ├── admin\page.js            # add / delete books
        └── admin\edit\[id]\page.js  # edit an existing book
```

---

## Notes

- Storage is a persistent H2 database file (`backend/data/`). Delete that folder
  to reset the catalog — it will re-seed on the next start.
- To switch to MySQL/PostgreSQL later, change the datasource properties in
  `application.properties` and swap the H2 dependency in `pom.xml`; the JPA code
  stays the same.
- Start the **backend first**, then the frontend — the UI calls the API on load.
```
