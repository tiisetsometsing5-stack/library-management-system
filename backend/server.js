const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Library Management System Backend is Running!");
});

// Get all books
app.get("/api/books", (req, res) => {
    const sql = "SELECT * FROM books";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// Add a new book
app.post("/api/books", (req, res) => {
    const { title, author, genre, isbn, quantity } = req.body;

    const sql = `
        INSERT INTO books (title, author, genre, isbn, quantity)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, author, genre, isbn, quantity], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: "Book added successfully!",
            bookId: result.insertId
        });
    });
});

// Update an existing book
app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const { title, author, genre, isbn, quantity } = req.body;

    const sql = `
        UPDATE books
        SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ?
        WHERE id = ?
    `;

    db.query(sql, [title, author, genre, isbn, quantity, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book updated successfully!" });
    });
});

// Delete a book
app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM books WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully!" });
    });
});

// Get all users
app.get("/api/users", (req, res) => {
    const sql = "SELECT id, name, membership_id, role FROM users";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// Add a new user
app.post("/api/users", async (req, res) => {
    const { name, membership_id, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, membership_id, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [name, membership_id, hashedPassword, role], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "User registered successfully!",
                userId: result.insertId
            });
        });

    } catch (error) {
        res.status(500).json({ error: "Password encryption failed" });
    }
});

// Update an existing user
app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, membership_id, role } = req.body;

    const sql = `
        UPDATE users
        SET name = ?, membership_id = ?, role = ?
        WHERE id = ?
    `;

    db.query(sql, [name, membership_id, role, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully!" });
    });
});

// Delete a user
app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM users WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully!" });
    });
});

// User Login
app.post("/api/login", (req, res) => {
    const { membership_id, password } = req.body;

    const sql = "SELECT * FROM users WHERE membership_id = ?";

    db.query(sql, [membership_id], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid membership ID or password"
            });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid membership ID or password"
            });
        }

        res.json({
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                membership_id: user.membership_id,
                role: user.role
            }
        });
    });
});

// Get all transactions
app.get("/api/transactions", (req, res) => {
    const sql = `
        SELECT
            transactions.id,
            books.title AS bookTitle,
            users.name AS userName,
            transactions.type,
            transactions.quantity,
            transactions.date
        FROM transactions
        JOIN books ON transactions.book_id = books.id
        JOIN users ON transactions.user_id = users.id
        ORDER BY transactions.date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// Add a transaction
app.post("/api/transactions", (req, res) => {
    const { book_id, user_id, type, quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
            message: "Quantity must be a positive number"
        });
    }

    let stockChange;

    if (type === "Borrowed") {
        stockChange = -quantity;
    } else if (type === "Returned" || type === "Stock Added") {
        stockChange = quantity;
    } else {
        return res.status(400).json({
            message: "Invalid transaction type"
        });
    }

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const updateSql = `
            UPDATE books
            SET quantity = quantity + ?
            WHERE id = ? AND quantity + ? >= 0
        `;

        db.query(
            updateSql,
            [stockChange, book_id, stockChange],
            (err, result) => {
                if (err || result.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(400).json({
                            message: "Book not found or insufficient stock"
                        });
                    });
                }

                const insertSql = `
                    INSERT INTO transactions
                    (book_id, user_id, type, quantity)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [book_id, user_id, type, quantity],
                    (err, result) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({
                                    error: err.message
                                });
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        error: err.message
                                    });
                                });
                            }

                            res.status(201).json({
                                message: "Transaction recorded successfully!",
                                transactionId: result.insertId
                            });
                        });
                    }
                );
            }
        );
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});