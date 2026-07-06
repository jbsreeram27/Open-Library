// Thin client for the Fox Book Store Spring Boot API.
// All calls go through here so the base URL lives in one place.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function handle(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch (_) {
      // response had no JSON body; keep the default message
    }
    throw new Error(message);
  }
  // 204 No Content (e.g. delete) has no body to parse.
  if (res.status === 204) return null;
  return res.json();
}

export async function getBooks(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${BASE_URL}/books${query}`, { cache: "no-store" });
  return handle(res);
}

export async function getBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`, { cache: "no-store" });
  return handle(res);
}

export async function getStats() {
  const res = await fetch(`${BASE_URL}/books/stats`, { cache: "no-store" });
  return handle(res);
}

export async function createBook(book) {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return handle(res);
}

export async function updateBook(id, book) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return handle(res);
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`, { method: "DELETE" });
  return handle(res);
}

export async function borrowBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}/borrow`, { method: "POST" });
  return handle(res);
}

export async function returnBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}/return`, { method: "POST" });
  return handle(res);
}
