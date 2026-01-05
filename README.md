# DevOps Platform

This repository contains the source code for a DevOps platform, consisting of a React-based frontend and a Java-based backend.

## Project Structure

The repository is organized into two main directories:

- `frontend/`: Contains the React application.
- `backend/`: Contains the Java application.

### Frontend

The frontend is a modern web application built with the following technologies:

- **Vite**: A fast build tool for modern web projects.
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

The frontend code is organized as follows:

- `src/components/`: Reusable UI components.
- `src/pages/`: Top-level page components.
- `src/routes.tsx`: Application routing configuration.
- `src/services/`: Modules for interacting with the backend API.
- `src/context/`: React context for global state management.
- `src/hooks/`: Custom React hooks.

### Backend

The backend is a Java application built with Maven. It follows a standard Maven project structure:

- `src/main/java/`: Contains the main application source code.
- `src/test/java/`: Contains the test source code.

## Getting Started

To get started with the development, you will need to have Node.js and a Java Development Kit (JDK) installed on your machine.

### Frontend

1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

### Backend

1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```

2. Build the project using Maven:
   ```sh
   ./mvnw clean install
   ```

3. Run the application:
   ```sh
   java -jar target/<your-app-name>.jar
   ```

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
