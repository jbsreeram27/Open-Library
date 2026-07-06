import Link from "next/link";

function stars(rating) {
  const full = Math.round(rating || 0);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book.id}`} className="book-card">
      <div
        className="book-cover"
        style={{ background: book.coverColor || "#ea580c" }}
      >
        <span className="format-badge">{book.format}</span>
        <span className="cover-icon">📖</span>
      </div>
      <div className="book-body">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <div className="book-meta">
          <span className="chip">{book.genre}</span>
          <span className="stars" title={`${book.rating} / 5`}>
            {stars(book.rating)}
          </span>
          <span
            className={`badge ${book.available ? "available" : "out"}`}
          >
            {book.available
              ? `${book.availableCopies} available`
              : "All out"}
          </span>
        </div>
      </div>
    </Link>
  );
}
