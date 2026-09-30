import { useState } from "react";

function Users({ users, setUsers }) {
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [role, setRole] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (name === "" || membershipId === "" || role === "") {
      setError("Please fill in all fields.");
      return;
    }

    if (editingId !== null) {
      setUsers(
        users.map((user) =>
          user.id === editingId
            ? {
                ...user,
                name: name,
                membershipId: membershipId,
                role: role,
              }
            : user
        )
      );

      setEditingId(null);
    } else {
      const newUser = {
        id: Date.now(),
        name: name,
        membershipId: membershipId,
        role: role,
      };

      setUsers([...users, newUser]);
    }

    clearForm();
  }

  function clearForm() {
    setName("");
    setMembershipId("");
    setRole("");
    setError("");
  }

  function handleEdit(user) {
    setName(user.name);
    setMembershipId(user.membershipId);
    setRole(user.role);
    setEditingId(user.id);
    setError("");
  }

  function handleDelete(id) {
    setUsers(users.filter((user) => user.id !== id));
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