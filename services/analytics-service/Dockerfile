FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

COPY pom.xml ./
COPY common-library/pom.xml ./common-library/
COPY common-library/src ./common-library/src
RUN mvn clean install -pl common-library -DskipTests

COPY services/analytics-service/pom.xml ./services/analytics-service/
COPY services/analytics-service/src ./services/analytics-service/src
RUN mvn clean package -pl services/analytics-service -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/services/analytics-service/target/*.jar app.jar
EXPOSE 8094
ENTRYPOINT ["java", "-jar", "app.jar"]
