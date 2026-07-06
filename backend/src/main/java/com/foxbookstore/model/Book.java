package com.foxbookstore.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

/**
 * Represents a single e-book in the Fox Book Store library.
 *
 * <p>Persisted to the H2 database via JPA. {@code totalCopies}/{@code availableCopies}
 * model digital lending: each borrow decrements availability, each return increments it.
 *
 * <p>Field access is used (annotations on fields), so the derived {@link #isAvailable()}
 * getter is ignored by JPA while still being serialized to JSON as {@code available}.
 */
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String genre;
    private String isbn;

    @Column(length = 2000)
    private String description;

    private String format;      // e.g. "PDF", "EPUB"
    private Integer publishedYear;
    private Double rating;      // 0.0 - 5.0
    private String coverColor;  // hex color used to render a placeholder cover
    private Integer totalCopies;
    private Integer availableCopies;

    public Book() {
    }

    public Book(Long id, String title, String author, String genre, String isbn,
                String description, String format, Integer publishedYear, Double rating,
                String coverColor, Integer totalCopies, Integer availableCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isbn = isbn;
        this.description = description;
        this.format = format;
        this.publishedYear = publishedYear;
        this.rating = rating;
        this.coverColor = coverColor;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
    }

    /** Convenience flag derived from availability; handy for the frontend. */
    @Transient
    public boolean isAvailable() {
        return availableCopies != null && availableCopies > 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public Integer getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(Integer publishedYear) {
        this.publishedYear = publishedYear;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getCoverColor() {
        return coverColor;
    }

    public void setCoverColor(String coverColor) {
        this.coverColor = coverColor;
    }

    public Integer getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(Integer totalCopies) {
        this.totalCopies = totalCopies;
    }

    public Integer getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(Integer availableCopies) {
        this.availableCopies = availableCopies;
    }
}
