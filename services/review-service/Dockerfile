FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml ./common-library/
COPY common-library/src ./common-library/src
RUN mvn clean install -pl common-library -DskipTests

COPY services/review-service/pom.xml ./services/review-service/
COPY services/review-service/src ./services/review-service/src
RUN mvn clean package -pl services/review-service -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/services/review-service/target/*.jar app.jar
EXPOSE 8092
ENTRYPOINT ["java", "-jar", "app.jar"]
