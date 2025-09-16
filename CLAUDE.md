# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on http://localhost:8080)
- **Build for production**: `npm run build`
- **Build for development**: `npm run build:dev`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React TypeScript application for bodybuilding competition registration, built with Vite and modern tooling. The application generates PDF registration forms for the "PB MUSCLE ARENA" bodybuilding event.

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: jsPDF for client-side PDF creation
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state, local React state for forms

### Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (buttons, inputs, cards, etc.)
│   └── RegistrationForm.tsx  # Main registration form component
├── pages/
│   ├── Index.tsx        # Landing page with hero section and form
│   └── NotFound.tsx     # 404 page
├── utils/
│   └── pdfGenerator.ts  # PDF generation logic using jsPDF
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── assets/              # Static assets (images, etc.)
```

### Key Components

- **RegistrationForm**: Main form component handling bodybuilding competition registration data
- **PDF Generator**: Utility that creates formatted registration PDFs with official competition layout
- **shadcn/ui**: Complete UI component library with consistent theming

### Form Data Structure

The registration form captures:
- **Identification**: Name, CPF, RG, age, address, contact info
- **Measurements**: Height, weight, optional services (dobra, pintura, foto)
- **Categories**: Gender-specific competition categories and subcategories
  - Female: BIKINI, FIGURE, WOMEN'S PHYSIQUE, WELLNESS
  - Male: BODYSHAPE, ESPECIAL, BODYBUILDING, CLASSIC PHYSIQUE, MEN'S PHYSIQUE
  - Subcategories: TEEN, ESTREANTE, NOVICE, OPEN, MASTER, CLASSE ESPECIAL

### Styling System

- Uses Tailwind CSS with custom CSS variables for theming
- Primary colors: Orange (#dc5e28) theme for competition branding
- Component variants managed through `class-variance-authority`
- Responsive design with mobile-first approach

### Build Configuration

- **Vite**: Modern build tool with HMR, configured for React SWC
- **Path aliases**: `@/` maps to `src/` directory
- **Development server**: Runs on port 8080 with host `::`
- **Lovable integration**: Uses lovable-tagger for component tracking in development

### Linting and Code Quality

- ESLint with TypeScript support
- React Hooks and React Refresh plugins
- Unused variables warnings disabled (@typescript-eslint/no-unused-vars: off)

### PDF Generation Details

The PDF generator creates a formatted registration document with:
- Official header and branding
- Authorization text for image usage rights
- Structured sections for identification, measurements, and categories
- Interactive checkboxes and form fields
- Signature areas for officials and guardians
- Professional layout matching competition standards