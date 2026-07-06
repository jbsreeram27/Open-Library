# ---- Build stage: compile the Spring Boot jar with Maven + JDK 17 ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Run stage: slim JRE image that just runs the jar ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# H2 database file is written under /app/data (mount a volume to persist it).
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
