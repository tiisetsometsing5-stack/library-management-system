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
  
  const [books, setBooks] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/books")
    .then((response) => response.json())
    .then((data) => {
      setBooks(data);
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
}, []);

  
const [users, setUsers] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/users")
    .then((response) => response.json())
    .then((data) => {
      const formattedUsers = data.map((user) => ({
        id: user.id,
        name: user.name,
        membershipId: user.membership_id,
        role: user.role,
      }));

      setUsers(formattedUsers);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}, []);


  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/transactions")
    .then((response) => response.json())
    .then((data) => {
      const formattedTransactions = data.map((transaction) => ({
        ...transaction,
        user: transaction.userName,
        date: new Date(transaction.date).toLocaleString(),
      }));

      setTransactions(formattedTransactions);
    })
    .catch((error) => {
      console.error("Error fetching transactions:", error);
    });
}, []);

  const [loggedInUser, setLoggedInUser] = useState(null);

  function handleLogin(user) {
  setLoggedInUser(user);
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
    loggedInUser.role === "Librarian/Admin" ? (
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