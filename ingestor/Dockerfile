# --- Build Stage ---
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Copy Go module files
COPY go.mod ./
COPY go.sum ./

# Copy the vendor directory
COPY vendor ./vendor

# Copy the rest of the source code
COPY . .

# Build the application using the vendored modules
RUN CGO_ENABLED=0 GOOS=linux go build -mod=vendor -o /ingestor .


# --- Final Stage ---
FROM alpine:latest
COPY --from=builder /ingestor /ingestor
EXPOSE 8000
CMD ["/ingestor"]