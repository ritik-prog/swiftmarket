# Use the official MongoDB image as a parent image
FROM mongo

# Set environment variables for MongoDB
ENV MONGO_INITDB_ROOT_USERNAME=myuser \
    MONGO_INITDB_ROOT_PASSWORD=mypassword \
    MONGO_INITDB_DATABASE=mydatabase \
    MONGO_DATA_DIR=/data/db \
    MONGO_LOG_DIR=/var/log/mongodb

# Create a directory for the log files
RUN mkdir -p "$MONGO_LOG_DIR" && \
    chown -R mongodb:mongodb "$MONGO_LOG_DIR"

# Create a directory for the database files
RUN mkdir -p "$MONGO_DATA_DIR" && \
    chown -R mongodb:mongodb "$MONGO_DATA_DIR"

# Set the working directory to /data/db
WORKDIR /data/db

EXPOSE 27017
CMD ["mongod"]