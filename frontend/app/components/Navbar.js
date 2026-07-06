import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="brand">
          <span className="logo">🦊</span>
          <span>
            Fox <span className="accent">Book Store</span>
          </span>
        </Link>
        <div className="nav-links">
          <Link href="/">Browse</Link>
          <Link href="/admin" className="primary">
            Manage
          </Link>
        </div>
      </div>
    </nav>
  );
}
