# AI Development Rules - MedCare

## Tech Stack
- **Core**: Vite + React 18 + TypeScript for a fast, type-safe development environment.
- **Styling**: Tailwind CSS for utility-first styling and responsive design.
- **UI Components**: shadcn/ui (built on Radix UI) for accessible, high-quality pre-built components.
- **Icons**: Lucide React for a consistent and lightweight iconography system.
- **Routing**: React Router 6 for client-side navigation and page management.
- **State Management**: TanStack Query (React Query) for efficient data fetching and caching.
- **Forms**: React Hook Form combined with Zod for robust schema-based validation.
- **Notifications**: Sonner and shadcn/ui Toaster for user feedback and alerts.

## Development Rules

### 1. Component Architecture
- **Pages**: Place route-level components in `src/pages/`. Each page should correspond to a route in `App.tsx`.
- **Reusable Components**: Place shared UI elements in `src/components/`.
- **UI Library**: Use components from `src/components/ui/` (shadcn/ui). **Do not edit files in `src/components/ui/` directly**; if customization is needed, wrap them in a new component or use Tailwind classes.
- **Small & Focused**: Keep components under 100 lines of code. Refactor into smaller sub-components if they grow too large.

### 2. Styling & Design
- **Tailwind Only**: Use Tailwind CSS classes for all styling. Avoid writing custom CSS in `.css` files unless defining global variables or complex animations in `src/index.css`.
- **Responsive Design**: Always use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.) to ensure the app works on all screen sizes.
- **Theming**: Utilize the CSS variables defined in `src/index.css` (e.g., `primary`, `secondary`, `accent`) to maintain brand consistency.

### 3. Data & State
- **Mock Data**: Store static data and mock arrays in `src/data/mockData.ts`.
- **Fetching**: Use TanStack Query for any asynchronous operations or data fetching simulations.
- **Utilities**: Use the `cn()` utility from `src/lib/utils.ts` for conditional class merging.

### 4. Icons & Media
- **Icons**: Exclusively use `lucide-react` for icons.
- **Images**: Store local assets in `src/assets/`. Use descriptive `alt` tags for all images.

### 5. Best Practices
- **TypeScript**: Always define interfaces or types for component props and data structures. Avoid using `any`.
- **Navigation**: Use the `Link` or `NavLink` components from `react-router-dom` for internal navigation.
- **Feedback**: Use `toast` from `sonner` or `use-toast` for success/error messages after user actions (e.g., booking an appointment, ordering medicine).