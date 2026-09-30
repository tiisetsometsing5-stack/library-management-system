import { useState } from "react";
function Transactions({
  books,
  setBooks,
  transactions,
  setTransactions,
  loggedInUser,
})  {
  const [selectedBook, setSelectedBook] = useState("");
  const [transactionType, setTransactionType] = useState("borrow");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  function handleTransaction(event) {
    event.preventDefault();

    if (selectedBook === "") {
      setError("Please select a book.");
      return;
    }

    if (quantity === "") {
      setError("Please enter a quantity.");
      return;
    }

    const amount = Number(quantity);

    if (amount <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    const book = books.find(
      (book) => book.id === Number(selectedBook)
    );

    if (!book) {
      setError("Book not found.");
      return;
    }

    // Borrow Book
    if (transactionType === "borrow") {
      if (book.quantity < amount) {
        setError("There are not enough copies available.");
        return;
      }

      const updatedBooks = books.map((book) => {
        if (book.id === Number(selectedBook)) {
          return {
            ...book,
            quantity: book.quantity - amount,
          };
        }

        return book;
      });

      setBooks(updatedBooks);

      const newTransaction = {
        id: Date.now(),
        bookTitle: book.title,
        type: "Borrowed",
        quantity: amount,
        date: new Date().toLocaleString(),
        user: loggedInUser.username,
      };

      setTransactions([
        ...transactions,
        newTransaction,
      ]);
    }

    // Return Book
    if (transactionType === "return") {
      const updatedBooks = books.map((book) => {
        if (book.id === Number(selectedBook)) {
          return {
            ...book,
            quantity: book.quantity + amount,
          };
        }

        return book;
      });

      setBooks(updatedBooks);

      const newTransaction = {
        id: Date.now(),
        bookTitle: book.title,
        type: "Returned",
        quantity: amount,
        date: new Date().toLocaleString(),
        user: loggedInUser.username,
      };

      setTransactions([
        ...transactions,
        newTransaction,
      ]);
    }

    //add stock
    // Add Stock
if (transactionType === "addStock") {
  const updatedBooks = books.map((book) => {
    if (book.id === Number(selectedBook)) {
      return {
        ...book,
        quantity: book.quantity + amount,
      };
    }

    return book;
  });

  setBooks(updatedBooks);

  const newTransaction = {
    id: Date.now(),
    bookTitle: book.title,
    type: "Stock Added",
    quantity: amount,
    date: new Date().toLocaleString(),
  };

  setTransactions([
    ...transactions,
    newTransaction,
  ]);
}

    setSelectedBook("");
    setTransactionType("borrow");
    setQuantity("");
    setError("");
  }

  return (
    <>
      <h2>Book Transactions</h2>

      <section>
        <h3>Create Transaction</h3>

        <form onSubmit={handleTransaction}>
          <label>Select Book:</label>

          <select
            value={selectedBook}
            onChange={(event) =>
              setSelectedBook(event.target.value)
            }
            required
          >
            <option value="">Select a book</option>

            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.quantity} available)
              </option>
            ))}
          </select>

          <label>Transaction Type:</label>

          <select
            value={transactionType}
            onChange={(event) =>
              setTransactionType(event.target.value)
            }
          >
            <option value="borrow">Borrow Book</option>
            <option value="return">Return Book</option>
            <option value="addStock">Add Stock</option>
          </select>

          <label>Quantity:</label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            placeholder="Enter quantity"
            required
          />

             

          {error && <p>{error}</p>}

          <button type="submit">
            Save Transaction
          </button>
        </form>
      </section>

      <section>
        <h3>Transaction History</h3>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Transaction Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>User</th>
              </tr>
            </thead>

            <tbody>
              {transactions
  .filter((transaction) =>
    loggedInUser.role === "librarian"
      ? true
      : transaction.user === loggedInUser.username
  )
  .map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.bookTitle}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export default Transactions;