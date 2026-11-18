import { Link, Outlet } from "react-router-dom";

function Layout({ loggedInUser }) {
  return (
    <>
      <header>
        <h1>Library Management System</h1>
        <p>Logged-in role: {loggedInUser.role}</p>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/books">Books</Link>
          <Link to="/transactions">Transactions</Link>

          {loggedInUser.role === "Librarian/Admin" && (
  <Link to="/users">Users</Link>
)}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>Library Management System</p>
      </footer>
    </>
  );
}

export default Layout;