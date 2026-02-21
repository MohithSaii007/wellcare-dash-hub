# AI Rules & Project Guidelines

## Tech Stack
- **Framework**: React 18 with TypeScript and Vite for fast development and type safety.
- **Styling**: Tailwind CSS for utility-first styling and responsive design.
- **UI Components**: shadcn/ui (built on Radix UI) for accessible, unstyled components that are easy to customize.
- **Icons**: Lucide React for a consistent and lightweight icon set.
- **Navigation**: React Router DOM for client-side routing and navigation.
- **State Management**: TanStack Query (React Query) for server state and caching.
- **Forms**: React Hook Form combined with Zod for schema-based validation.
- **Notifications**: Sonner for toast notifications and Radix UI for accessible overlays.
- **Testing**: Vitest and React Testing Library for unit and component testing.

## Library Usage Rules

### 1. UI Components (shadcn/ui)
- Always check `src/components/ui/` before creating a new UI component.
- Use shadcn/ui components as the foundation for all interface elements.
- Do not modify files in `src/components/ui/` directly; instead, wrap them or use composition in `src/components/`.

### 2. Icons (Lucide)
- Use `lucide-react` for all icons to maintain visual consistency.
- Standardize icon sizes (e.g., `h-4 w-4` for small, `h-5 w-5` for medium).

### 3. Styling (Tailwind)
- Use Tailwind utility classes for all styling needs.
- Avoid writing custom CSS in `.css` files unless absolutely necessary for complex animations or third-party overrides.
- Utilize the theme variables defined in `src/index.css` (e.g., `text-primary`, `bg-background`).

### 4. Data Fetching (TanStack Query)
- Use `useQuery` for fetching data and `useMutation` for creating/updating/deleting data.
- Keep query keys organized and centralized if the app grows.

### 5. Routing (React Router)
- Define all routes in `src/App.tsx`.
- Use the `Layout` component to wrap page content for consistent header/footer placement.

### 6. Form Handling
- Use `zod` to define form schemas.
- Use `react-hook-form` with the `@hookform/resolvers/zod` for form state management and validation.

### 7. File Structure
- **Pages**: Place in `src/pages/`.
- **Components**: Place in `src/components/`.
- **Hooks**: Place in `src/hooks/`.
- **Utilities**: Place in `src/lib/utils.ts` or `src/utils/`.
- **Data/Mocks**: Place in `src/data/`.