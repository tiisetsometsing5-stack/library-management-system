import { useState, useEffect } from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./assets/Pages/Login";
import Dashboard from "./assets/Pages/Dashboard";
import Books from "./assets/Pages/Books";
import Transactions from "./assets/Pages/Transactions";
import UserManagement from "./assets/Pages/UserManagement";
import Layout from "./Components/Layout";

function App() {
  const [books, setBooks] = useState(() => {
  const savedBooks = localStorage.getItem("books");

  return savedBooks ? JSON.parse(savedBooks) : [];
});

  useEffect(() => {
  localStorage.setItem("books", JSON.stringify(books));
}, [books]);

  const [users, setUsers] = useState(() => {
  const savedUsers = localStorage.getItem("users");

  return savedUsers ? JSON.parse(savedUsers) : [];
});

  useEffect(() => {
  localStorage.setItem("users", JSON.stringify(users));
}, [users]);

  const [transactions, setTransactions] = useState(() => {
  const savedTransactions = localStorage.getItem("transactions");

  return savedTransactions
    ? JSON.parse(savedTransactions)
    : [];
});

  useEffect(() => {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}, [transactions]);

  const [loggedInUser, setLoggedInUser] = useState(null);

  function handleLogin(username, role) {
    setLoggedInUser({
      username: username,
      role: role,
    });
  }

  function handleLogout() {
    setLoggedInUser(null);
  }

  if (loggedInUser === null) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout loggedInUser={loggedInUser} />}>

          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                books={books}
                users={users}
                transactions={transactions}
              />
            }
          />

          <Route
  path="/books"
  element={
    <Books
      books={books}
      setBooks={setBooks}
      loggedInUser={loggedInUser}
    />
  }
/>

          <Route
  path="/transactions"
  element={
    <Transactions
      books={books}
      setBooks={setBooks}
      transactions={transactions}
      setTransactions={setTransactions}
      loggedInUser={loggedInUser}
    />
  }
/>

          <Route
  path="/users"
  element={
    loggedInUser.role === "librarian" ? (
      <UserManagement
        users={users}
        setUsers={setUsers}
      />
    ) : (
      <Navigate to="/dashboard" />
    )
  }
/>

        </Route>

      </Routes>

      <button onClick={handleLogout}>
        Logout
      </button>

    </BrowserRouter>
  );
}

export default App;