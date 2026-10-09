
# RideLux — Full-Stack Ride Booking Platform

RideLux is a full-stack ride-booking application developed using Java, Spring Boot, React.js, and MySQL. The project aims to provide a convenient platform for users to explore rides and manage bookings through a modern web interface.

## Features

- User registration and login
- Role-based user types: Passenger, Driver, and Admin
- Ride management
- Booking management
- Driver approval status support
- React-based user interface
- REST API backend using Spring Boot
- MySQL database integration

> Note: RideLux is a work in progress. Some features and administrative workflows may still require implementation.

## Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- Axios
- React Router

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Maven
- REST APIs

### Database
- MySQL

### Tools
- Git and GitHub
- Visual Studio Code
- Docker (for running the frontend in the current development setup)

## Project Structure

```text
Ridelux/
├── .gitignore
└── ridelux-backend/
    ├── ridelux/
    │   ├── src/
    │   │   ├── main/
    │   │   │   ├── java/com/ridelux/
    │   │   │   └── resources/
    │   │   └── test/
    │   ├── mvnw
    │   ├── mvnw.cmd
    │   └── pom.xml
    └── ridelux-frontend/
        ├── public/
        ├── src/
        ├── package.json
        └── vite.config.js
```

## Getting Started

### Prerequisites

- Java JDK 21
- MySQL Server
- Docker Desktop with Node.js 22 image support, or Node.js 22 installed locally
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Naveen7636/RideLux.git
cd RideLux
```

### 2. Configure the Database

Create a MySQL database named `ridelux`.

Configure the backend environment variables before starting the application:

**PowerShell example:**

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/ridelux"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your_mysql_password"
```

Replace `your_mysql_password` with your local MySQL password. Do not commit real passwords to GitHub.

### 3. Run the Backend

Open a terminal and run:

```powershell
cd ridelux-backend\ridelux
.\mvnw.cmd spring-boot:run
```

The backend is configured to run on port `8080`.

### 4. Run the Frontend

Open a separate terminal:

```powershell
cd ridelux-backend\ridelux-frontend
```

If Node.js 22 is installed locally:

```bash
npm install
npm run dev
```

Alternatively, with Docker Desktop running, use PowerShell:

```powershell
docker run --rm -it -v "${PWD}:/app" -w /app -p 5173:5173 node:22-alpine npm run dev -- --host 0.0.0.0
```

Open the frontend URL shown in the terminal, usually:

http://localhost:5173

## API Overview

The backend includes API endpoints for user authentication, ride management, and booking management.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/users/register` | Register a user |
| POST | `/api/users/login` | Authenticate a user |
| GET | `/api/users` | Retrieve users |
| GET | `/api/rides` | Retrieve rides |

## Learning Outcomes

- Building a React frontend
- Developing REST APIs with Java and Spring Boot
- Connecting a backend to MySQL
- Using Git and GitHub for version control
- Organizing a full-stack application

## Future Improvements

- Secure authentication and authorization
- Protected administrator APIs
- Complete driver approval workflow
- Improved validation and error handling
- Responsive UI refinements
- Automated testing and deployment

## Author

**Naveen E**

GitHub: [Naveen7636](https://github.com/Naveen7636)

---

If you are interested in the project or would like to discuss the implementation, feel free to connect with me through my GitHub profile.
