package com.foxbookstore.controller;

import com.foxbookstore.model.Book;
import com.foxbookstore.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * REST endpoints for managing the library's e-books.
 *
 * <p>Base path: {@code /api/books}.
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    /** GET /api/books?search=term — list (optionally filtered) books. */
    @GetMapping
    public List<Book> list(@RequestParam(required = false) String search) {
        return bookService.findAll(search);
    }

    /** GET /api/books/stats — aggregate counts for the dashboard. */
    @GetMapping("/stats")
    public Map<String, Integer> stats() {
        return bookService.stats();
    }

    /** GET /api/books/{id} — a single book. */
    @GetMapping("/{id}")
    public Book get(@PathVariable Long id) {
        return bookService.findById(id);
    }

    /** POST /api/books — add a new e-book to the library. */
    @PostMapping
    public ResponseEntity<Book> create(@Valid @RequestBody Book book) {
        Book created = bookService.create(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** PUT /api/books/{id} — update an existing e-book. */
    @PutMapping("/{id}")
    public Book update(@PathVariable Long id, @Valid @RequestBody Book book) {
        return bookService.update(id, book);
    }

    /** DELETE /api/books/{id} — remove an e-book. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/books/{id}/borrow — check out one copy. */
    @PostMapping("/{id}/borrow")
    public Book borrow(@PathVariable Long id) {
        return bookService.borrow(id);
    }

    /** POST /api/books/{id}/return — check in one copy. */
    @PostMapping("/{id}/return")
    public Book giveBack(@PathVariable Long id) {
        return bookService.giveBack(id);
    }
}
