# Citizen Service Request & Municipal Grievance Resolution System

Production-ready Spring Boot backend for managing citizen complaints, municipal grievance workflows, and basic user registration and login.

## Tech Stack

- Java 17
- Spring Boot 3.x
- Maven
- MySQL

## Project Structure

```text
grievance
├── pom.xml
├── README.md
├── sample-api-requests.json
└── src
    ├── main
    │   ├── java
    │   │   └── com/civic/grievance
    │   │       ├── GrievanceApplication.java
    │   │       ├── config
    │   │       ├── controller
    │   │       ├── dto
    │   │       ├── entity
    │   │       │   └── enums
    │   │       ├── exception
    │   │       ├── repository
    │   │       ├── security
    │   │       └── service
    │   └── resources
    │       └── application.properties
    └── test
        └── java/com/civic/grievance
```

## Layer Explanation

- Controller: Accepts HTTP requests, validates payloads, and returns REST responses.
- Service: Implements business rules like complaint creation, default status assignment, SLA calculation, and login/register flow.
- Repository: Reads and writes `User` and `Complaint` entities using Spring Data JPA.

## How To Run

1. Start MySQL locally.
2. Ensure the database user is `root` with password `Mpsedsn*2809`.
3. Build the project:

```powershell
cd C:\Users\M. Devika Rani\Desktop\infra-ledger\grievance
mvn clean package -DskipTests
```

4. Run the application:

```powershell
mvn spring-boot:run
```

5. Access the API at `http://localhost:8083`.

## Available APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/complaints`
- `GET /api/complaints`

## Behavior

- The app auto-creates `grievance_db` if it does not already exist.
- JPA updates tables automatically via `spring.jpa.hibernate.ddl-auto=update`.
- New complaints are stored with `PENDING` status and a 24-hour SLA deadline.
- CSRF is disabled and all endpoints are currently open.
