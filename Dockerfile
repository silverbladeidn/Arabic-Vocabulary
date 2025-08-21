FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven wrapper files
COPY vocabulary/mvnw .
COPY vocabulary/mvnw.cmd .
COPY vocabulary/.mvn .mvn

# Copy pom.xml first for better Docker layer caching
COPY vocabulary/pom.xml .

# Download dependencies
RUN chmod +x ./mvnw
RUN ./mvnw dependency:resolve

# Copy source code
COPY vocabulary/src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "target/*.jar"]
