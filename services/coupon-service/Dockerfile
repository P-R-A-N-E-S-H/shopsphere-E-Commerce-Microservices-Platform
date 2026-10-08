FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml ./common-library/
COPY common-library/src ./common-library/src
RUN mvn clean install -pl common-library -DskipTests

COPY services/coupon-service/pom.xml ./services/coupon-service/
COPY services/coupon-service/src ./services/coupon-service/src
RUN mvn clean package -pl services/coupon-service -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/services/coupon-service/target/*.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "app.jar"]
