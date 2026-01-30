# Build stage for Next.js UI
FROM oven/bun:1 AS ui-builder
WORKDIR /app/ui
COPY ui/package.json ui/bun.lock* ./
RUN bun install
COPY ui/ ./
RUN bun run build

# Build stage for Rust backend
FROM rust:1.87 AS rust-builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src/ ./src/
COPY migrations/ ./migrations/
COPY diesel.toml ./
COPY --from=ui-builder /app/ui/out ./ui/out
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim
WORKDIR /app

# Install necessary runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the built binary
COPY --from=rust-builder /app/target/release/todo-rs ./todo-rs

# Copy migrations for runtime setup
COPY --from=rust-builder /app/migrations ./migrations

# Set environment variables
ENV DATABASE_URL=sqlite://todo.db

# Heroku will set the PORT environment variable dynamically
# The application reads PORT env var at runtime

# Run the application
CMD ["./todo-rs"]
