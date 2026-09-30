import Card from "../../Components/Card";
function Dashboard({ books, users, transactions }) {
  return (
    <>
      <section>
        <h2>Dashboard</h2>

        <p>
          Welcome to the Library Management System. Use the navigation menu
          to manage books, transactions, and users.
        </p>
      </section>

      <section className="statistics">
  <Card title="Total Books" value={books.length} />

  <Card title="Total Users" value={users.length} />

  <Card
    title="Total Transactions"
    value={transactions.length}
  />
</section>

      <section>
        <h2>Available Books</h2>

        {books.length === 0 ? (
          <p>No books available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Quantity</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export default Dashboard;