import { useState } from "react";

function Users({ users, setUsers }) {
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  
async function handleSubmit(event) {
  event.preventDefault();

  if (
    name === "" ||
    membershipId === "" ||
    role === "" ||
    (editingId === null && password === "")
  ) {
    setError("Please fill in all required fields.");
    return;
  }

  const userData = {
    name: name,
    membership_id: membershipId,
    role: role,
  };

  try {
    if (editingId !== null) {
      const response = await fetch(
        `http://localhost:5000/api/users/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setUsers(
        users.map((user) =>
          user.id === editingId
            ? { ...user, name, membershipId, role }
            : user
        )
      );

      setEditingId(null);

    } else {
      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to add user");
      }

      const result = await response.json();

      setUsers([
        ...users,
        {
          id: result.userId,
          name: name,
          membershipId: membershipId,
          role: role,
        },
      ]);
    }

    clearForm();

  } catch (error) {
    setError(error.message);
  }
}


  function clearForm() {
    setName("");
    setMembershipId("");
    setRole("");
    setPassword("");
    setError("");
  }

  function handleEdit(user) {
    setName(user.name);
    setMembershipId(user.membershipId);
    setRole(user.role);
    setEditingId(user.id);
    setError("");
  }

  async function handleDelete(id) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/users/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    setUsers(users.filter((user) => user.id !== id));

  } catch (error) {
    setError(error.message);
  }
}

  return (
    <div>
      <h2>User Management</h2>

      <h3>
        {editingId !== null ? "Update User" : "Add New User"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <br />

        <div>
          <label>Membership ID:</label>
          

          <input
            type="text"
            value={membershipId}
            onChange={(event) =>
              setMembershipId(event.target.value)
            }
            placeholder="Enter membership ID"
          />
        </div>

        <br />

            <div>
      <label>Password:</label>

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter password"
      />
    </div>

    <br />

        <div>
          <label>User Role:</label>
          

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Librarian/Admin">
              Librarian/Admin
            </option>
          </select>
        </div>

       

        {error && <p>{error}</p>}

        <button type="submit">
          {editingId !== null ? "Update User" : "Add User"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>


      <h3>Register Users</h3>

      {users.length === 0 ? (
        <p>No users added yet.</p>
      ) : (
        <table >
          <thead>
            <tr>
              <th>Name</th>
              <th>Membership ID</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.membershipId}</td>
                <td>{user.role}</td>

                <td>
                  <button onClick={() => handleEdit(user)}>
                    Update
                  </button>

                  <button onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;