import { useState } from "react";

function Books({ books, setBooks, loggedInUser })  {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (
      title === "" ||
      author === "" ||
      genre === "" ||
      isbn === "" ||
      quantity === ""
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (Number(quantity) < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    if (editingId !== null) {
      setBooks(
        books.map((book) =>
          book.id === editingId
            ? {
                ...book,
                title: title,
                author: author,
                genre: genre,
                isbn: isbn,
                quantity: Number(quantity),
              }
            : book
        )
      );

      setEditingId(null);
    } else {
      const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        genre: genre,
        isbn: isbn,
        quantity: Number(quantity),
      };

      setBooks([...books, newBook]);
    }

    clearForm();
  }

  function clearForm() {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setError("");
  }

  function handleEdit(book) {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity);
    setEditingId(book.id);
    setError("");
  }

  function handleDelete(id) {
    setBooks(books.filter((book) => book.id !== id));
  }

  return (
    <>
      <h2>Book Management</h2>
    {loggedInUser.role === "librarian" && (
      <section>
        <h3>
          {editingId !== null ? "Update Book" : "Add New Book"}
        </h3>

        <form onSubmit={handleSubmit}>
          <label>Book Title:</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter book title"
          />

          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Enter author name"
          />

          <label>Genre:</label>
          <input
            type="text"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            placeholder="Enter book genre"
          />

          <label>ISBN:</label>
          <input
            type="text"
            value={isbn}
            onChange={(event) => setIsbn(event.target.value)}
            placeholder="Enter ISBN"
          />

          <label>Quantity:</label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="Enter quantity"
          />

          {error && <p>{error}</p>}

          <button type="submit">
            {editingId !== null ? "Update Book" : "Add Book"}
          </button>

          {editingId !== null && (
            <button type="button" onClick={clearForm}>
              Cancel
            </button>
          )}
        </form>
      </section>
    )}
      <section>
        <h3>Available Books</h3>

        {books.length === 0 ? (
          <p>No books added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Quantity</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className={book.quantity < 2 ? "low-stock" : ""}
                >
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>

                  <td>
                    {book.quantity === 0
                      ? "Out of Stock"
                      : book.quantity < 2
                      ? "Low Stock"
                      : "Available"}
                  </td>

                  <td>
                    <button onClick={() => handleEdit(book)}>
                      Update
                    </button>

                    <button onClick={() => handleDelete(book.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export default Books;