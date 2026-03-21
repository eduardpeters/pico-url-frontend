# AGENTS.md — Pico URL Frontend

Coding agent instructions for the `pico-url-frontend` repository.

## Project Overview

React 19 SPA built with TypeScript 5.x, bundled with Vite.
Key dependencies: React Router v7, lucide-react (icons), Axios, TanStack Query v5.

## Build / Lint / Test Commands

```bash
npm run dev        # Dev server at http://localhost:3000
npm start          # Alias for dev (same as above)
npm run build      # Production bundle → /dist
npm run preview    # Preview production bundle locally
npm run lint       # ESLint (0 warnings tolerance)
npm run format     # Prettier (rewrites src/)
npm test           # Vitest in interactive watch mode
```

**Run a single test file:**

```bash
npm test -- run Login      # run once, filter by name pattern
```

**Run tests without watch mode (CI):**

```bash
npm test -- run            # run all tests once, no watch
```

ESLint config is `eslint.config.mjs` (flat config, ESLint v10) — not in `package.json`.
Prettier config is `.prettierrc` — semi, double quotes, 4-space indent, 100-col print width.

## TypeScript

`tsconfig.json` uses `"strict": true` — all strict checks are active:

- `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.
- Target: `es2020`, JSX transform: `react-jsx` (no need to import React in components)
- `moduleResolution: "bundler"` — required for Vite's module resolution; needs TypeScript ≥ 5.0
- `noEmit: true` — TypeScript is for type-checking only; Vite/esbuild transpiles

Always fix TypeScript errors rather than using `any` or `@ts-ignore`.

## Code Style Guidelines

### Formatting

- **Indentation:** 4 spaces (no tabs)
- **Semicolons:** always
- **Quotes:** double quotes (`"`) — the dominant style; App.tsx uses single quotes but
  new code should use double quotes
- **Line length:** no enforced limit, keep lines readable

### Imports

No enforced ordering, but follow the established loose convention (top to bottom):

1. React hooks (`import { useState, useEffect } from "react"`)
2. React Router (`import { useNavigate, Link } from "react-router"`)
3. Third-party libraries (TanStack Query, lucide-react, Axios, etc.)
4. Internal context (`../context/AuthContext`)
5. Internal services (`../services/urlsAPI`)
6. Internal components (`./UrlEntry`)
7. Internal types (`../types/picotypes`)
8. CSS side-effects (`import "../styles/Login.css"`)
9. CSS Modules (`import styles from "../styles/general.module.css"`)

Do **not** import `React` as a default (the `react-jsx` transform makes it unnecessary).
Only `index.tsx` imports `ReactDOM`.

### Naming Conventions

| Category               | Convention                      | Example                          |
| ---------------------- | ------------------------------- | -------------------------------- |
| Component files        | PascalCase `.tsx`               | `UrlEntry.tsx`                   |
| Service files          | camelCase `.ts`                 | `urlsAPI.ts`                     |
| Type declaration files | camelCase `.d.ts`               | `picotypes.d.ts`                 |
| CSS files              | PascalCase `.css`               | `Dashboard.css`                  |
| CSS Module files       | camelCase `.module.css`         | `general.module.css`             |
| Component functions    | PascalCase                      | `function Dashboard()`           |
| Helper functions       | camelCase                       | `validateLoginForm`              |
| Event handlers         | `handle` + PascalCase           | `handleCreateSubmit`             |
| State variables        | camelCase                       | `isLoggedIn`, `errorMessage`     |
| Props interfaces       | PascalCase + `Props` suffix     | `UrlEntryProps`                  |
| Data-shape interfaces  | PascalCase + `Interface` suffix | `UrlInterface`                   |
| CSS class names        | BEM with `__` separator         | `.dashboard__container`          |
| API service exports    | camelCase named const           | `export const urlsAPI = { ... }` |

### Types and Interfaces

- Always use `interface` for object shapes — not `type` aliases
- Define shared interfaces in `src/types/picotypes.d.ts`
- Define local interfaces (Props, local data shapes) at the **top of the file**, before the
  component function
- Use explicit types for state setter props:
    ```ts
    setCount: React.Dispatch<React.SetStateAction<number>>;
    ```
- Use `as` for type assertions: `(error as AxiosError).response?.data`
- Use `unknown` in catch clauses: `catch (error: unknown)`

### Component Structure

All components follow this exact pattern — **no exceptions**:

```tsx
// 1. Imports

// 2. Local interface definitions
interface MyComponentProps {
    prop1: string;
    prop2: React.Dispatch<React.SetStateAction<boolean>>;
}

// 3. Function declaration (not arrow function)
function MyComponent({ prop1, prop2 }: MyComponentProps) {
    // 4. Hooks (useContext, useNavigate, useState, useRef, useEffect)
    // 5. Handler/helper functions defined inside the component
    // 6. return ( JSX );
}

export default MyComponent;
```

- Use `function` declarations, **not** arrow function components
- `export default` at the bottom of the file
- Use `<>...</>` fragments when multiple siblings are needed without a wrapper
- Use ternary `? :` and short-circuit `&&` freely for conditional rendering

### Error Handling

**Service layer** — functions call `api` and return data directly; errors throw automatically.
No try/catch, no `{ error }` return objects:

```ts
async function postLogIn(email: string, password: string) {
    const response = await api.post("auth/", { email, password });
    return response.data;
}
```

**Component layer** — callers wrap in try/catch:

```ts
try {
    const data = await authAPI.postLogIn(email, password);
    // handle success
} catch (error: unknown) {
    showErrorMessage(error instanceof Error ? error.message : "Request failed");
}
```

**UI error display** — use a timed reset pattern (sentinel `"OK"` hides the message):

```ts
function showErrorMessage(text: string) {
    setErrorMessage(text);
    setTimeout(() => setErrorMessage("OK"), 3000);
}
```

The error message renders only when `errorMessage.length > 2`.

### Styling

Two CSS strategies coexist — use whichever matches the component's existing style:

1. **CSS Modules** (`general.module.css`) — import as `styles` and use `className={styles.foo}`
2. **Per-component plain CSS** (e.g., `Login.css`) — import as side effect, use string
   class names `className="login__content"`

CSS class naming: **BEM-like** using `__` (block**element) and `-` (word separator):
`.entry**icon-copy`, `.delete\_\_button-confirm`

Color palette: Dracula-inspired — `#282a36` bg, `#ffb86c` orange, `#ff79c6` pink,
`#8be9fd` cyan, `#50fa7b` green, `#ff5555` red, `#bd93f9` purple.

### API Services

- Base URL from `import.meta.env.VITE_API_URL` (Vite convention)
- All service files import the shared Axios instance from `src/services/api.ts` — never
  import `axios` directly
- Bearer token auth is injected automatically by the request interceptor in `api.ts`;
  service functions and components never handle tokens directly
- Exported as named `const` plain objects:
    ```ts
    export const urlsAPI = { getUrls, postUrl, patchUrl, deleteUrl };
    ```
- One file per domain (`authAPI.ts`, `urlsAPI.ts`, `usersAPI.ts`)

### State Management

- Global auth state via React Context (`src/context/AuthContext.tsx`)
- Consumed via the custom hook `useAuthContext()` — use optional chaining since it may
  be `null`: `authContext?.setUserDetails(...)` / `authContext?.logout()`
- `isLoggedIn` is a derived boolean (`userDetails !== null`) — never set it directly
- Auth state is persisted to `localStorage["auth"]` automatically by a `useEffect` in the
  context; components never read or write `localStorage` for auth directly
- Login: call `authContext?.setUserDetails({ id, name, email, token })`
- Logout: call `authContext?.logout()`
- All other state is local `useState` in components — no Redux, Zustand, etc.

### TanStack Query

- All data fetching uses custom hooks in `src/hooks/` — no raw `useEffect` + `useState`
  for server state
- Query key conventions: `["urls"]` for the URL list, `["urlCount"]` for the count
- Auth-gated queries include `enabled: !!token` to prevent unauthenticated requests
- Mutation pattern: call `mutateAsync(...)` inside a try/catch; invalidate related query
  keys on success via `queryClient.invalidateQueries`
- Create and delete mutations invalidate both `["urls"]` and `["urlCount"]`; update
  mutations invalidate `["urls"]` only

## Testing

Tests use **Vitest + React Testing Library** (installed but no tests exist yet). When writing
tests, place them alongside the component as `ComponentName.test.tsx`.

```bash
npm test -- run Login      # run once, filter by name pattern
```
