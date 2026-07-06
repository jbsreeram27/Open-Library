"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBook, borrowBook, returnBook } from "../../lib/api";

function stars(rating) {
  const full = Math.round(rating || 0);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const data = await getBook(id);
      setBook(data);
      setError("");
    } catch (e) {
      setError(e.message || "Could not load this book.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleBorrow() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const updated = await borrowBook(id);
      setBook(updated);
      setMessage(`You borrowed “${updated.title}”. Enjoy the read!`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleReturn() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const updated = await returnBook(id);
      setBook(updated);
      setMessage(`“${updated.title}” returned. Thanks!`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="empty">Loading…</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container">
        <div className="notice error">⚠️ {error || "Book not found."}</div>
        <Link href="/" className="back-link">
          ← Back to library
        </Link>
      </div>
    );
  }

  const borrowed = book.totalCopies - book.availableCopies;

  return (
    <div className="container">
      <div className="detail">
        <div
          className="detail-cover"
          style={{ background: book.coverColor || "#ea580c" }}
        >
          📖
        </div>
        <div>
          <h1>{book.title}</h1>
          <p className="by">by {book.author}</p>

          <div className="book-meta">
            <span className="chip">{book.genre}</span>
            <span className="chip">{book.format}</span>
            <span className="stars">{stars(book.rating)}</span>
            <span className={`badge ${book.available ? "available" : "out"}`}>
              {book.available ? "Available" : "All out"}
            </span>
          </div>

          <p className="desc">{book.description}</p>

          <div className="detail-facts">
            <div className="fact">
              <div className="k">Published</div>
              <div className="v">{book.publishedYear}</div>
            </div>
            <div className="fact">
              <div className="k">ISBN</div>
              <div className="v">{book.isbn}</div>
            </div>
            <div className="fact">
              <div className="k">Rating</div>
              <div className="v">{book.rating} / 5</div>
            </div>
            <div className="fact">
              <div className="k">Copies</div>
              <div className="v">
                {book.availableCopies} of {book.totalCopies} available
                {borrowed > 0 ? ` · ${borrowed} on loan` : ""}
              </div>
            </div>
          </div>

          {error && <div className="notice error">⚠️ {error}</div>}
          {message && <div className="notice success">✅ {message}</div>}

          <div className="book-meta">
            <button
              className="btn btn-primary"
              onClick={handleBorrow}
              disabled={busy || !book.available}
            >
              📥 Borrow
            </button>
            <button
              className="btn btn-outline"
              onClick={handleReturn}
              disabled={busy || book.availableCopies >= book.totalCopies}
            >
              📤 Return
            </button>
          </div>

          <Link href="/" className="back-link">
            ← Back to library
          </Link>
        </div>
      </div>
    </div>
  );
}
