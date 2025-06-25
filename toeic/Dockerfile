FROM openjdk:17-jdk-alpine
WORKDIR /toeic
EXPOSE 8080
COPY ./target/*.jar toeic.jar
ENTRYPOINT ["java", "-jar", "./toeic.jar"]