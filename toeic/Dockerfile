# Stage 1: Build JAR file
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY ./toeic /app
RUN mvn clean package -DskipTests

# Stage 2: Run application
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
