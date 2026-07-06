import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Fox Book Store — Library Management System",
  description: "Browse, borrow, and manage the Fox Book Store e-book library.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            🦊 Fox Book Store · Library Management System
          </div>
        </footer>
      </body>
    </html>
  );
}
