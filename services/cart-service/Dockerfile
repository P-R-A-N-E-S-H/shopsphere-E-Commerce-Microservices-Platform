FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml ./common-library/
COPY common-library/src ./common-library/src
RUN mvn clean install -pl common-library -DskipTests

COPY services/cart-service/pom.xml ./services/cart-service/
COPY services/cart-service/src ./services/cart-service/src
RUN mvn clean package -pl services/cart-service -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/services/cart-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
