# Capstone Project - WiseR

## Prerequisite

Ensure the following are done first to avoid issues:

- Access to `.env` variables of the frontend and backend is required.
- Replace the `.env` files in each directory with the correct environment content.

## Installation

1. Ensure Docker is installed on your system and running.
2. Clone the repository to your local machine.

## Backend Setup

### Navigate to the project directory (the one containing docker-compose)

```bash
cd capstoneprj
```

```bash
docker-compose up --build
```

## Usage

### Once the build is complete, run the container using:

```bash
docker-compose up
```

If any errors occur during the image build related to the entry.sh file, follow these steps:

    Delete the existing entry.sh file.
    Create a new entry.sh file and paste the following code:

```bash

#!/bin/ash

echo "Apply database migrations"

python manage.py migrate

exec "$@"
```

## Frontend Setup

### Navigate to the "Frontend" directory (the one containing Dockerfile)

```bash
cd Frontend
```

```bash
docker build -t react .
```

run the image on port 5173

```bash
docker run -p 5173:5173 --name capstoneprj-front react
```

Open your web browser and visit http://localhost:5173 to access the website

You can preview different users if you have access to Admin, Retailer, Supplier accounts

To access the server admin panel and database visit http://127.0.0.1:8000 and login with given superuser credintials
