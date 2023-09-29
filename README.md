# Air Quality App

This project delivers a REST API that provides air quality information for a specific location based on GPS coordinates, utilizing data from IQAir.

## Table of contents

- [Table of contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Running the tests](#running-the-tests)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Getting Started

These instructions will guide you to set up a copy of the project on your local machine for development and testing purposes

### Prerequisites

Before you begin, ensure you have installed the following software:

- Docker (v24.0.2 or higher)
- Docker Compose (v1.29.2 or higher)
- Git

### Installation

Follow these steps to set up a development environment:

1. Clone the repository using Git:
   ```sh
   https://github.com/AhmedMoneeb/air-quality.git
   ```

2. Create a copy of the [.env.example](./.env.example) file and rename it to `.env`. Update the `.env` file with the appropriate values for your environment.

3. Use Docker Compose to build your Docker images and start your containers. Run the following command:
   ```sh
   docker compose up --build -d node_app postgresql_db
   ```
   
4. Once the containers are up and running, you can view the API documentation. It's available at `localhost:<HTTP_PORT>/api`.

   In this URL, replace `<HTTP_PORT>` with the value you set in your `.env` file. For example, if you set `HTTP_PORT` to `3000`, the API documentation would be at `localhost:3000/api`.
   

### Usage
To ensure the system is working as expected, you can run the unit tests. Use the following command:
```sh
 docker compose up --build run_unit_test && docker compose down run_unit_test
```

### Built With
- [NestJS](https://nestjs.com/) - The web framework used
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Used for containerization and app deployment
- [Docker Compose](https://docs.docker.com/compose/) - Tool for defining and running multi-container Docker applications