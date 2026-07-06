"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks, createBook, deleteBook } from "../lib/api";

const EMPTY_FORM = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  description: "",
  format: "EPUB",
  publishedYear: "",
  rating: "",
  totalCopies: "",
  coverColor: "#ea580c",
};

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setBooks(await getBooks());
      setError("");
    } catch (e) {
      setError(e.message || "Could not reach the API.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
        rating: form.rating ? Number(form.rating) : 0,
        totalCopies: form.totalCopies ? Number(form.totalCopies) : 1,
      };
      const created = await createBook(payload);
      setMessage(`Added “${created.title}” to the library.`);
      setForm(EMPTY_FORM);
      await load();
    } catch (e) {
      setError(e.message || "Could not add the book.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Remove “${title}” from the library?`)) return;
    setError("");
    setMessage("");
    try {
      await deleteBook(id);
      setMessage(`Removed “${title}”.`);
      await load();
    } catch (e) {
      setError(e.message || "Could not remove the book.");
    }
  }

  return (
    <div className="container">
      <div style={{ marginTop: 28 }}>
        <h1 className="section-title">Manage the Library</h1>
        <p className="muted">Add new e-books and manage the current collection.</p>
      </div>

      {error && <div className="notice error">⚠️ {error}</div>}
      {message && <div className="notice success">✅ {message}</div>}

      <form className="panel" onSubmit={handleSubmit}>
        <h2 style={{ marginTop: 0 }}>Add a new e-book</h2>
        <div className="form-grid">
          <div className="field">
            <label>Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Author *</label>
            <input
              required
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Genre</label>
            <input
              value={form.genre}
              onChange={(e) => update("genre", e.target.value)}
            />
          </div>
          <div className="field">
            <label>ISBN</label>
            <input
              value={form.isbn}
              onChange={(e) => update("isbn", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Format</label>
            <select
              value={form.format}
              onChange={(e) => update("format", e.target.value)}
            >
              <option>EPUB</option>
              <option>PDF</option>
              <option>MOBI</option>
              <option>AudioBook</option>
            </select>
          </div>
          <div className="field">
            <label>Published year</label>
            <input
              type="number"
              value={form.publishedYear}
              onChange={(e) => update("publishedYear", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Rating (0–5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => update("rating", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Total copies</label>
            <input
              type="number"
              min="1"
              value={form.totalCopies}
              onChange={(e) => update("totalCopies", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Cover color</label>
            <input
              type="color"
              value={form.coverColor}
              onChange={(e) => update("coverColor", e.target.value)}
            />
          </div>
          <div className="field full">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "＋ Add book"}
          </button>
        </div>
      </form>

      <h2 className="section-title">Current collection ({books.length})</h2>
      <div style={{ overflowX: "auto", margin: "16px 0 48px" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Format</th>
              <th>Availability</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <Link
                    href={`/books/${book.id}`}
                    style={{ color: "var(--fox-orange)", fontWeight: 700 }}
                  >
                    {book.title}
                  </Link>
                </td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.format}</td>
                <td>
                  {book.availableCopies} / {book.totalCopies}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link
                      href={`/admin/edit/${book.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.id, book.title)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={6} className="muted" style={{ textAlign: "center" }}>
                  No books yet — add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
