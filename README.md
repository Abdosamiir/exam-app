# Exam App

A Next.js exam platform with authentication, student dashboard flows, and admin tools for managing diplomas, exams, questions, users, submissions, and audit logs.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **UI:** React 19
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui, Radix UI
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Validation:** Zod
- **Data fetching/cache:** TanStack React Query
- **Authentication:** NextAuth.js
- **Charts:** Recharts
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **Linting:** ESLint with Next.js config

## Main Features

- Email/password authentication
- Email verification, forgot password, and reset password flows
- Student dashboard for diplomas, exams, answers, and submissions
- Admin dashboard for diplomas, exams, questions, account management, and audit logs
- Role/permission-aware UI behavior
- API-backed forms and tables with pagination, filters, and mutations

## Project Structure

```txt
src/
  app/        Next.js routes, layouts, and route-level UI
  features/   Feature modules such as auth, exams, diplomas, audit logs
  shared/     Shared UI components, hooks, utilities, and app infrastructure
```

## Environment Variables

Create a `.env` file and provide the required values:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_SESSION_COOKIE=your_session_cookie_name
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

## Scripts

- `npm run dev` - start the Next.js development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint
