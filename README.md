# Community Library Management System

## 1. Project Description

The Community Library Management System is a web-based application developed to help libraries manage books, users, book availability, and borrowing transactions.

The system provides a simple interface for librarians and students. Librarians can manage books, users, and transactions, while students can view available books and their own transaction history.

The application uses React for the frontend, Node.js and Express.js for the backend, and MySQL for database management.

## 2. Features

- **Login System:** Allows students and librarians/admins to log in using their membership ID and password.
- **Dashboard:** Displays library statistics, available books, and low-stock information.
- **Book Management:** Allows librarians/admins to add, update, view, and delete books.
- **Availability Management:** Tracks book quantities and prevents borrowing when there is insufficient stock.
- **Book Transactions:** Records borrowed books, returned books, and additional stock.
- **User Management:** Allows librarians/admins to register, update, view, and delete users.
- **Transaction History:** Keeps records of borrowing, returning, and stock additions.
- **Role-Based Access:** Provides different access permissions for students and librarians/admins.
- **Database Integration:** Stores books, users, and transaction records in a MySQL database.

## 3. Technologies Used

### Frontend
- React
- JavaScript
- HTML
- CSS
- React Router
- Vite
- Fetch API

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv
- bcryptjs

### Database
- MySQL

## 4. Project Structure

```text
Community-Library-Management-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── assets/
│   │   │   └── Pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## 5. Installation and Setup

### Prerequisites

Before running the application, ensure that the following are installed:

- Node.js and npm
- MySQL Server
- Visual Studio Code

### Step 1: Download or Clone the Project

Clone the repository from GitHub or download the project files.

### Step 2: Set Up the Database

1. Open MySQL Workbench or your MySQL command-line interface.
2. Create a database named:

```sql
CREATE DATABASE library_management;
```

3. Create the required tables: `books`, `users`, and `transactions`, using the database structure provided with the project.

### Step 3: Configure the Backend

1. Open a terminal in the backend folder.
2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file inside the backend folder.
4. Add your own MySQL connection details:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=library_management
```

Replace `your_mysql_password` with your actual MySQL password.

### Step 4: Start the Backend Server

Inside the backend folder, run:

```bash
node server.js
```

The backend server runs on port 5000.

### Step 5: Install and Start the Frontend

1. Open another terminal.
2. Navigate to the frontend folder.
3. Install the frontend dependencies:

```bash
npm install
```

4. Start the React development server:

```bash
npm run dev
```

5. Open the local URL displayed in the terminal in your web browser.

## 6. Authentication and User Roles

The system supports two user roles:

**Librarian/Admin**
- Manage books.
- Manage registered users.
- View library statistics.
- Record book transactions.
- View transaction history.

**Student**
- View available books.
- Borrow and return books.
- View their own transaction history.

Passwords are hashed before being stored in the database using bcryptjs.

## 7. API Endpoints

The backend provides REST API endpoints for managing the application data.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Retrieve all books |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |
| GET | `/api/users` | Retrieve users |
| POST | `/api/users` | Register a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |
| POST | `/api/login` | Authenticate a user |
| GET | `/api/transactions` | Retrieve transactions |
| POST | `/api/transactions` | Record a transaction |

## 8. Project Purpose

This project was developed as an academic assignment to demonstrate the practical application of web development concepts, including React components, React hooks, controlled forms, routing, RESTful APIs, backend development, database integration, and user authentication.

It demonstrates how a frontend application communicates with a backend server to store, retrieve, and manage information in a relational database.

## 9. Author

**Tiisetso Metsing**