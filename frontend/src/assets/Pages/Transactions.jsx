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

  async function handleTransaction(event) {
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

  const transactionTypes = {
    borrow: "Borrowed",
    return: "Returned",
    addStock: "Stock Added",
  };

  try {
    const response = await fetch(
      "http://localhost:5000/api/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: Number(selectedBook),
          user_id: loggedInUser.id,
          type: transactionTypes[transactionType],
          quantity: amount,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Transaction failed.");
    }

    // Refresh books from the database
    const booksResponse = await fetch(
      "http://localhost:5000/api/books"
    );

    const updatedBooks = await booksResponse.json();
    setBooks(updatedBooks);

    // Refresh transaction history from the database
    const transactionsResponse = await fetch(
      "http://localhost:5000/api/transactions"
    );

    const updatedTransactions = await transactionsResponse.json();

    setTransactions(
      updatedTransactions.map((transaction) => ({
        ...transaction,
        user: transaction.userName,
        date: new Date(transaction.date).toLocaleString(),
      }))
    );

    setSelectedBook("");
    setTransactionType("borrow");
    setQuantity("");
    setError("");

  } catch (error) {
    setError(error.message);
  }
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
  loggedInUser.role === "Librarian/Admin"
    ? true
    : transaction.user === loggedInUser.name
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