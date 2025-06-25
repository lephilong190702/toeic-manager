# Sử dụng JDK 17 làm base image
FROM eclipse-temurin:17-jdk

# Tạo thư mục app
WORKDIR /app

# Copy source code vào container
COPY . .

# Chạy ứng dụng Spring Boot
CMD ["java", "-jar", "target/toeic-0.0.1-SNAPSHOT.jar"]
