FROM openjdk:21-jdk-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-venv \
    python3-pip \
    wget \
    unzip \
 && python3 -m venv /opt/yt \
 && /opt/yt/bin/pip install --upgrade pip \
 && /opt/yt/bin/pip install yt-dlp \
 && ln -s /opt/yt/bin/yt-dlp /usr/local/bin/yt-dlp \
 && rm -rf /var/lib/apt/lists/*


# Buat direktori kerja
WORKDIR /app

# Copy model Vosk
COPY vosk-model-small-en-us-0.15 /app/vosk-model-small-en-us-0.15

# Copy file JAR Spring Boot
COPY target/Lexicon-0.0.1-SNAPSHOT.jar app.jar

# Expose port untuk API
EXPOSE 8080

# Jalankan Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
