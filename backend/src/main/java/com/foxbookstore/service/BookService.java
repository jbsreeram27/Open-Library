package com.foxbookstore.service;

import com.foxbookstore.model.Book;
import com.foxbookstore.repository.BookRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Business logic for the Fox Book Store library, backed by an H2 database
 * through {@link BookRepository}. The catalog is seeded on first run and then
 * persists across restarts.
 */
@Service
public class BookService {

    private final BookRepository repository;

    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    /** Seed sample e-books only if the database is empty (first run). */
    @PostConstruct
    private void seed() {
        if (repository.count() > 0) {
            return;
        }
        add("The Silent Library", "Ava Mercer", "Mystery", "978-1-2001-0001-1",
                "A librarian uncovers a century of secrets hidden in the stacks of a forgotten archive.",
                "EPUB", 2021, 4.6, "#6d28d9", 5);
        add("Quantum Foxes", "Dr. Elias Fenn", "Science", "978-1-2001-0002-8",
                "An accessible tour of quantum mechanics told through playful thought experiments.",
                "PDF", 2019, 4.3, "#c2410c", 3);
        add("Roots of the Ember Tree", "Nia Okafor", "Fantasy", "978-1-2001-0003-5",
                "A young mapmaker follows a burning tree's roots into a world beneath her village.",
                "EPUB", 2022, 4.8, "#b91c1c", 4);
        add("The Founder's Ledger", "Marcus Vale", "Business", "978-1-2001-0004-2",
                "Hard-won lessons on building a company that outlives its first idea.",
                "PDF", 2020, 4.1, "#0f766e", 6);
        add("Midnight in Marrow Bay", "Sofia Reyes", "Thriller", "978-1-2001-0005-9",
                "A detective returns to her coastal hometown to solve a case that was never closed.",
                "EPUB", 2023, 4.5, "#1d4ed8", 2);
        add("Bread, Salt & Fire", "Tomas Lindqvist", "Cooking", "978-1-2001-0006-6",
                "Rustic recipes and the stories of the kitchens they came from.",
                "PDF", 2018, 4.2, "#a16207", 5);
        add("The Cartographer's Dog", "Priya Nair", "Adventure", "978-1-2001-0007-3",
                "A stray dog leads an aging explorer to one last uncharted island.",
                "EPUB", 2021, 4.7, "#15803d", 3);
        add("Signals in the Static", "Owen Brooks", "Sci-Fi", "978-1-2001-0008-0",
                "Radio astronomers pick up a pattern that shouldn't exist — and answers back.",
                "PDF", 2024, 4.4, "#7c3aed", 4);
    }

    private void add(String title, String author, String genre, String isbn, String description,
                     String format, int year, double rating, String coverColor, int copies) {
        repository.save(new Book(null, title, author, genre, isbn, description, format,
                year, rating, coverColor, copies, copies));
    }

    /** Returns all books, optionally filtered by a case-insensitive search term. */
    public List<Book> findAll(String search) {
        if (search == null || search.isBlank()) {
            return repository.findAll(Sort.by("id"));
        }
        return repository.search(search.trim());
    }

    public Book findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    /** Creates a new book, letting the database assign the id. */
    public Book create(Book book) {
        book.setId(null);
        int total = book.getTotalCopies() == null ? 1 : Math.max(1, book.getTotalCopies());
        book.setTotalCopies(total);
        // A newly added title starts fully available.
        book.setAvailableCopies(total);
        return repository.save(book);
    }

    public Book update(Long id, Book changes) {
        Book existing = findById(id);
        existing.setTitle(changes.getTitle());
        existing.setAuthor(changes.getAuthor());
        existing.setGenre(changes.getGenre());
        existing.setIsbn(changes.getIsbn());
        existing.setDescription(changes.getDescription());
        existing.setFormat(changes.getFormat());
        existing.setPublishedYear(changes.getPublishedYear());
        existing.setRating(changes.getRating());
        if (changes.getCoverColor() != null) {
            existing.setCoverColor(changes.getCoverColor());
        }
        if (changes.getTotalCopies() != null) {
            int newTotal = Math.max(1, changes.getTotalCopies());
            int borrowed = existing.getTotalCopies() - existing.getAvailableCopies();
            existing.setTotalCopies(newTotal);
            // Keep availability consistent with however many are currently on loan.
            existing.setAvailableCopies(Math.max(0, newTotal - borrowed));
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new BookNotFoundException(id);
        }
        repository.deleteById(id);
    }

    /** Borrows one copy; throws if none are available. */
    public Book borrow(Long id) {
        Book book = findById(id);
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No copies of \"" + book.getTitle() + "\" are available.");
        }
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        return repository.save(book);
    }

    /** Returns one borrowed copy; throws if all copies are already in. */
    public Book giveBack(Long id) {
        Book book = findById(id);
        if (book.getAvailableCopies() >= book.getTotalCopies()) {
            throw new IllegalStateException("All copies of \"" + book.getTitle() + "\" are already returned.");
        }
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        return repository.save(book);
    }

    /** Aggregate counts used by the dashboard. */
    public Map<String, Integer> stats() {
        List<Book> all = repository.findAll();
        int titles = all.size();
        int copies = all.stream().mapToInt(Book::getTotalCopies).sum();
        int available = all.stream().mapToInt(Book::getAvailableCopies).sum();
        Map<String, Integer> result = new LinkedHashMap<>();
        result.put("titles", titles);
        result.put("totalCopies", copies);
        result.put("availableCopies", available);
        result.put("borrowedCopies", copies - available);
        return result;
    }
}
