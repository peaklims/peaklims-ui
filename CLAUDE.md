# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` or `pnpm start` - Start the development server on https://localhost:4378
- `pnpm build` - Build the application (runs TypeScript check and Vite build)
- `pnpm serve` or `pnpm preview` - Preview the production build

### Code Quality
- `pnpm typecheck` - Run TypeScript type checking without emitting files
- `pnpm lint` - Run ESLint with TypeScript support

### Testing
- `pnpm test` - Run Playwright tests
- `pnpm test:ui` - Run Playwright tests with UI mode
- `pnpm test:report` - Show Playwright test report
- `pnpm test:cg` - Run Playwright test codegen

## Architecture Overview

This is a Laboratory Information Management System (LIMS) React SPA built with modern technologies:

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **State Management**: 
  - Server state: TanStack Query (React Query)
  - Local state: Zustand
- **UI Components**: 
  - Custom components with Radix UI primitives
  - NextUI components
  - Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (@/ -> ./src/)

### API Architecture
- **BFF (Backend for Frontend)**: Proxied through `/bff` (https://localhost:7164)
- **Main API**: Proxied through `/api` (https://localhost:7164)
- **Authentication**: OIDC-based authentication with BFF handling login/logout
- **API Clients**: Two Axios instances (`peakLimsBff` and `peakLimsApi`) with CSRF protection and automatic 401 handling

### Key Directories
- `src/domain/` - Domain-specific features organized by entity (accessions, patients, samples, etc.)
  - Each domain folder contains: `apis/`, `components/`, `features/`, `types/`
- `src/components/` - Shared UI components
- `src/components/ui/` - Base UI components (buttons, forms, inputs, etc.)
- `src/routes/` - TanStack Router file-based routes
- `src/services/` - Core services (auth, API client)
- `src/hooks/` - Custom React hooks

### Domain Structure Pattern
Each domain entity follows this structure:
- `apis/` - API calls and React Query hooks
- `components/` - Domain-specific components
- `features/` - Complex feature components
- `types/` - TypeScript type definitions
- `*.keys.ts` - React Query key factories

### Authentication Flow
- Authentication is handled through the BFF at `/bff/login`
- User claims are fetched from `/bff/user`
- Protected routes check authentication status via `useAuthUser` hook
- 401 responses trigger automatic redirect to login

### Important Implementation Details
- Route generation is automatic via TanStack Router plugin
- All API calls use CSRF protection headers
- The app runs in strict TypeScript mode with strict linting
- Development includes debug screens (Tailwind CSS debug)
- React Query and Router DevTools are available in development

## Rules Reference

Reference these rules as needed to get detailed guidance on various actions and operations.

- For guidance on writing rules, see [Writing Rules](./rules/writing-rules.md)
- For comprehensive code style standards and best practices, see [Code Style Standards](./rules/code-style-standards.md)
- For comprehensive project structure and file organization, see [Project Structure](./rules/project-structure.md)
- For async state, server state, and API management, see [Async Server State Management](./rules/async-server-state-management.md)
- For client-side state management with React hooks, see [Client State Management](./rules/client-state-management.md)
- For maintaining high accessibility standards, see [Accessibility Standards](./rules/accessibility-standards.md)