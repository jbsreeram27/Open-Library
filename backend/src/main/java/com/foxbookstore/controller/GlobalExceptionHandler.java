package com.foxbookstore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Translates business-rule violations into clean JSON error responses so the
 * frontend can display a helpful message instead of a stack trace.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** e.g. borrowing a book with no available copies -> 409 Conflict. */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }
}
