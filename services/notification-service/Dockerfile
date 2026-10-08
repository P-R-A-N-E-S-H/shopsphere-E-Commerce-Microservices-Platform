FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml ./common-library/
COPY common-library/src ./common-library/src
RUN mvn clean install -pl common-library -DskipTests

COPY services/notification-service/pom.xml ./services/notification-service/
COPY services/notification-service/src ./services/notification-service/src
RUN mvn clean package -pl services/notification-service -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/services/notification-service/target/*.jar app.jar
EXPOSE 8093
ENTRYPOINT ["java", "-jar", "app.jar"]
