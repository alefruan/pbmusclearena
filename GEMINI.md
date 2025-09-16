# GEMINI Project Analysis

## Project Overview

This project is a web application for "PB MUSCLE ARENA," a bodybuilding event. The application provides an online registration system where users can fill out a form and generate a PDF of their registration for printing.

The project is built using the following technologies:

*   **Framework:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn-ui
*   **Routing:** React Router
*   **Form Management:** React Hook Form
*   **PDF Generation:** jspdf, html2canvas

The application features a hero section with a background image, a registration form, and a footer. The main page is `src/pages/Index.tsx`, which uses the `RegistrationForm` component from `src/components/RegistrationForm.tsx`.

## Building and Running

To work with this project, you need to have Node.js and npm installed.

**1. Install Dependencies:**

```sh
npm install
```

**2. Run the Development Server:**

```sh
npm run dev
```

This will start the Vite development server, and you can view the application at `http://localhost:8080`.

**3. Build for Production:**

```sh
npm run build
```

This command bundles the application for production into the `dist` directory.

**4. Linting:**

```sh
npm run lint
```

This command runs the ESLint to check for any linting errors in the code.

## Development Conventions

*   **Component-Based Architecture:** The project follows a component-based architecture with reusable UI components located in `src/components/ui`.
*   **Styling:** Styling is done using Tailwind CSS, with custom theme configurations in `tailwind.config.ts`.
*   **Routing:** The application uses `react-router-dom` for routing, with routes defined in `src/App.tsx`.
*   **State Management:** For asynchronous operations, the project uses `@tanstack/react-query`.
*   **Code Quality:** ESLint is used for code linting, and TypeScript is used for static type checking.
*   **File Structure:**
    *   `src/pages`: Contains the main pages of the application.
    *   `src/components`: Contains reusable React components.
    *   `src/assets`: Contains static assets like images.
    *   `src/lib`: Contains utility functions.
    *   `src/hooks`: Contains custom React hooks.
