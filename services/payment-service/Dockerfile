FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml ./common-library/
COPY common-library/src ./common-library/src
RUN mvn clean install -pl common-library -DskipTests

COPY services/payment-service/pom.xml ./services/payment-service/
COPY services/payment-service/src ./services/payment-service/src
RUN mvn clean package -pl services/payment-service -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/services/payment-service/target/*.jar app.jar
EXPOSE 8089
ENTRYPOINT ["java", "-jar", "app.jar"]
