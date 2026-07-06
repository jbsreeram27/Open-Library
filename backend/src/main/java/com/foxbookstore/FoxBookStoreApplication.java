package com.foxbookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Fox Book Store Library Management System API.
 *
 * <p>Run with: {@code mvn spring-boot:run} (starts on http://localhost:8080).
 */
@SpringBootApplication
public class FoxBookStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(FoxBookStoreApplication.class, args);
    }
}
