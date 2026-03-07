# AGENTS.md — Pico URL Frontend

Coding agent instructions for the `pico-url-frontend` repository.

## Project Overview

React 18 SPA built with TypeScript 4.9, bootstrapped with Create React App (CRA).
Key dependencies: React Router DOM v6, MUI v5 (icons), Axios, Emotion.

## Build / Lint / Test Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production bundle → /build
npm test           # Jest in interactive watch mode (React Testing Library)
```

**Run a single test file:**
```bash
npm test -- --testPathPattern="ComponentName"
# e.g.: npm test -- --testPathPattern="Login"
```

**Run tests without watch mode (CI):**
```bash
CI=true npm test
```

There is no separate `npm run lint` script. ESLint runs automatically via `react-scripts`
during `start` and `build`. The ESLint config is in `package.json` under `"eslintConfig"`:
```json
{ "extends": ["react-app", "react-app/jest"] }
```
No Prettier, no `.editorconfig`, no additional ESLint plugins configured.

## TypeScript

`tsconfig.json` uses `"strict": true` — all strict checks are active:
- `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.
- Target: `es2020`, JSX transform: `react-jsx` (no need to import React in components)
- `noEmit: true` — TypeScript is for type-checking only; Babel transpiles

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
2. React Router (`import { useNavigate, Link } from "react-router-dom"`)
3. Third-party libraries (MUI, Axios, etc.)
4. Internal context (`../context/AuthContext`)
5. Internal services (`../services/urlsAPI`)
6. Internal components (`./UrlEntry`)
7. Internal types (`../types/picotypes`)
8. CSS side-effects (`import "../styles/Login.css"`)
9. CSS Modules (`import styles from "../styles/general.module.css"`)

Do **not** import `React` as a default (the `react-jsx` transform makes it unnecessary).
Only `index.tsx` imports `ReactDOM`.

### Naming Conventions

| Category | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `UrlEntry.tsx` |
| Service files | camelCase `.ts` | `urlsAPI.ts` |
| Type declaration files | camelCase `.d.ts` | `picotypes.d.ts` |
| CSS files | PascalCase `.css` | `Dashboard.css` |
| CSS Module files | camelCase `.module.css` | `general.module.css` |
| Component functions | PascalCase | `function Dashboard()` |
| Helper functions | camelCase | `validateLoginForm` |
| Event handlers | `handle` + PascalCase | `handleCreateSubmit` |
| State variables | camelCase | `isLoggedIn`, `errorMessage` |
| Props interfaces | PascalCase + `Props` suffix | `UrlEntryProps` |
| Data-shape interfaces | PascalCase + `Interface` suffix | `UrlInterface` |
| CSS class names | BEM with `__` separator | `.dashboard__container` |
| API service exports | camelCase named const | `export const urlsAPI = { ... }` |

### Types and Interfaces

- Always use `interface` for object shapes — not `type` aliases
- Define shared interfaces in `src/types/picotypes.d.ts`
- Define local interfaces (Props, local data shapes) at the **top of the file**, before the
  component function
- Use explicit types for state setter props:
  ```ts
  setCount: React.Dispatch<React.SetStateAction<number>>
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

**Service layer** — always wrap Axios calls in try/catch and return an `{ error }` object
on failure:
```ts
async function postLogIn(email: string, password: string) {
    try {
        const response = await axios.post(requestUrl, requestBody);
        return response.data;
    } catch (error: unknown) {
        console.error(error);
        return { error: (error as AxiosError).response?.data || (error as AxiosError).message };
    }
}
```

**Component layer** — callers duck-type check `response.error` (not `instanceof`):
```ts
const response = await authAPI.postLogIn(email, password);
if (response.error) { showErrorMessage(response.error); return; }
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

CSS class naming: **BEM-like** using `__` (block__element) and `-` (word separator):
`.entry__icon-copy`, `.delete__button-confirm`

Color palette: Dracula-inspired — `#282a36` bg, `#ffb86c` orange, `#ff79c6` pink,
`#8be9fd` cyan, `#50fa7b` green, `#ff5555` red, `#bd93f9` purple.

### API Services

- Base URL from `process.env.REACT_APP_API_URL` (CRA convention)
- Bearer token auth: `headers: { Authorization: \`Bearer ${userToken}\` }`
- Exported as named `const` plain objects:
  ```ts
  export const urlsAPI = { getUrls, postUrl, patchUrl, deleteUrl };
  ```
- One file per domain (`authAPI.ts`, `urlsAPI.ts`, `usersAPI.ts`)

### State Management

- Global auth state via React Context (`src/context/AuthContext.tsx`)
- Consumed via the custom hook `useAuthContext()` — use optional chaining since it may
  be `null`: `authContext?.setIsLoggedIn(true)`
- All other state is local `useState` in components — no Redux, Zustand, etc.

## Testing

Tests use **Jest + React Testing Library** (installed but no tests exist yet). When writing
tests, place them alongside the component as `ComponentName.test.tsx`.

```bash
npm test -- --testPathPattern="Login" --watchAll=false  # run single file, no watch
```
