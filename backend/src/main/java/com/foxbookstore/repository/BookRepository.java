package com.foxbookstore.repository;

import com.foxbookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/** Spring Data JPA repository backing the e-book catalog with H2. */
public interface BookRepository extends JpaRepository<Book, Long> {

    /** Case-insensitive search across title, author, and genre, ordered by id. */
    @Query("SELECT b FROM Book b WHERE "
            + "LOWER(b.title) LIKE LOWER(CONCAT('%', :term, '%')) OR "
            + "LOWER(b.author) LIKE LOWER(CONCAT('%', :term, '%')) OR "
            + "LOWER(b.genre) LIKE LOWER(CONCAT('%', :term, '%')) "
            + "ORDER BY b.id")
    List<Book> search(@Param("term") String term);
}
