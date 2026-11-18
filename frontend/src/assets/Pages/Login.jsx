import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  
async function handleLogin(event) {
  event.preventDefault();

  if (username === "" || password === "") {
    setError("Please enter your membership ID and password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        membership_id: username,
        password: password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    onLogin(result.user);

  } catch (error) {
    setError(error.message);
  }
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



        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
