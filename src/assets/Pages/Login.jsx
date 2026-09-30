import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    if (username === "" || password === "" || role === "") {
      setError("Please fill in all fields.");
      return;
    }

    if (
      role === "student" &&
      username === "Student" &&
      password === "Stu@2026"
    ) {
      onLogin(username, role);
      return;
    }

    if (
      role === "librarian" &&
      username === "libraryAdmin" &&
      password === "Lib@2026"
    ) {
      onLogin(username, role);
      return;
    }

    setError("Invalid username, password, or role.");
  }

  return (
    <div>
      <h1>Library Management System</h1>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
          />
        </div>

        <br />

        <div>
          <label>Role</label>
          <br />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="librarian">Librarian/Admin</option>
          </select>
        </div>

        <br />

        <button type="submit">Login</button>

 <p>
    <strong>Hints:</strong> libraryAdmin / Lib@2026
    <br />
    Student: Student / Stu@2026
</p>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
