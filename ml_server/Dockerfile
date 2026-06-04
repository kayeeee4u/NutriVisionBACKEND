FROM python:3.12-slim

WORKDIR /app

# Install system dependencies including unzip
RUN apt-get update && apt-get install -y \
    libgomp1 \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY food_labels.json .
COPY README.md .

# Copy and extract the model zip file
COPY saved_model1.zip .
RUN unzip saved_model1.zip -d saved_model1 && \
    mv saved_model1/variabel saved_model1/variables && \
    rm saved_model1.zip

# Hugging Face Spaces uses port 7860
EXPOSE 7860

# Set environment variable
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["python", "app.py"]
