"use client";

import { useEffect, useState } from "react";
import { getBooks, getStats } from "./lib/api";
import BookCard from "./components/BookCard";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounced load whenever the search term changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const [list, s] = await Promise.all([getBooks(search), getStats()]);
        if (!active) return;
        setBooks(list);
        setStats(s);
        setError("");
      } catch (e) {
        if (active) setError(e.message || "Could not reach the API.");
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>The Fox Book Store Library</h1>
          <p>
            Browse and borrow e-books from our digital shelves. Every title is
            ready to read the moment it&apos;s available.
          </p>
          {stats && (
            <div className="stats">
              <div className="stat-card">
                <div className="value">{stats.titles}</div>
                <div className="label">Titles</div>
              </div>
              <div className="stat-card">
                <div className="value">{stats.totalCopies}</div>
                <div className="label">Total copies</div>
              </div>
              <div className="stat-card">
                <div className="value">{stats.availableCopies}</div>
                <div className="label">Available now</div>
              </div>
              <div className="stat-card">
                <div className="value">{stats.borrowedCopies}</div>
                <div className="label">On loan</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="container">
        <div className="toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="Search by title, author, or genre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <div className="notice error">⚠️ {error}</div>}

        {loading ? (
          <div className="empty">Loading books…</div>
        ) : books.length === 0 ? (
          <div className="empty">
            No books match “{search}”. Try another search.
          </div>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
