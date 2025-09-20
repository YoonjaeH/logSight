# Use the same Python base image for consistency
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the worker script into the container
COPY . .

# Run the worker script when the container launches
CMD ["python", "worker.py"]