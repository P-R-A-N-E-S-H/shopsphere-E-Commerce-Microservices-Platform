FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml ./common-library/
COPY common-library/src ./common-library/src
RUN mvn clean install -pl common-library -DskipTests

COPY services/shipping-service/pom.xml ./services/shipping-service/
COPY services/shipping-service/src ./services/shipping-service/src
RUN mvn clean package -pl services/shipping-service -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/services/shipping-service/target/*.jar app.jar
EXPOSE 8091
ENTRYPOINT ["java", "-jar", "app.jar"]
