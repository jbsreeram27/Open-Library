"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBook, updateBook } from "../../../lib/api";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const book = await getBook(id);
        setForm({
          title: book.title || "",
          author: book.author || "",
          genre: book.genre || "",
          isbn: book.isbn || "",
          description: book.description || "",
          format: book.format || "EPUB",
          publishedYear: book.publishedYear ?? "",
          rating: book.rating ?? "",
          totalCopies: book.totalCopies ?? "",
          coverColor: book.coverColor || "#ea580c",
        });
      } catch (e) {
        setError(e.message || "Could not load this book.");
      }
    })();
  }, [id]);

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
      const saved = await updateBook(id, payload);
      setMessage(`Saved changes to “${saved.title}”.`);
      // Give the success message a beat, then return to the manage page.
      setTimeout(() => router.push("/admin"), 700);
    } catch (e) {
      setError(e.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (error && !form) {
    return (
      <div className="container">
        <div className="notice error">⚠️ {error}</div>
        <Link href="/admin" className="back-link">
          ← Back to manage
        </Link>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container">
        <div className="empty">Loading…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginTop: 28 }}>
        <h1 className="section-title">Edit e-book</h1>
        <p className="muted">Update the details for this title.</p>
      </div>

      {error && <div className="notice error">⚠️ {error}</div>}
      {message && <div className="notice success">✅ {message}</div>}

      <form className="panel" onSubmit={handleSubmit}>
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
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <Link href="/admin" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
