# Migration Plan — Pico URL Frontend Modernization

Each phase is independently shippable. Complete and verify (build + type-check) before
starting the next. Phases 4 and 5 can run in parallel once Phase 3 is done.

---

## Phase 1 — CRA → Vite

**Status:** complete

**Goal:** Replace the unmaintained Create React App toolchain with Vite. Includes the
TypeScript 5.x upgrade (pulled forward from Phase 2) because `"moduleResolution": "bundler"`
requires TypeScript ≥ 5.0.

**Packages:**
- Remove: `react-scripts`, `web-vitals`, `@types/jest`
- Add: `vite`, `@vitejs/plugin-react`, `typescript@^5.7`
- Add (testing): `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/jest-dom` (latest),
  `@testing-library/react` (latest), `@testing-library/user-event` (latest)

**Files to create:**
- `vite.config.ts` — React plugin, dev server port 3000, vitest config:
  ```ts
  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";

  export default defineConfig({
      plugins: [react()],
      server: { port: 3000 },
      test: {
          environment: "jsdom",
          globals: true,
      },
  });
  ```
- `src/vite-env.d.ts` — `/// <reference types="vite/client" />`

**Files to modify:**
- `public/index.html` → move to project root; add
  `<script type="module" src="/src/index.tsx"></script>` before `</body>`
- `tsconfig.json` — set `"moduleResolution": "bundler"`, add `"types": ["vite/client"]`
- `package.json` — replace scripts:
  ```json
  "dev":     "vite",
  "start":   "vite",
  "build":   "vite build",
  "preview": "vite preview",
  "test":    "vitest"
  ```
- All usages of `process.env.REACT_APP_API_URL` → `import.meta.env.VITE_API_URL`
  (in `src/services/urlsAPI.ts`, `src/services/authAPI.ts`, and `src/services/usersAPI.ts`)
- `.env` files (if any): rename `REACT_APP_API_URL` → `VITE_API_URL`

**Files to delete:**
- `src/react-app-env.d.ts`

**Notes:**
- No existing tests to migrate (Vitest API is Jest-compatible, zero effort).
- `@types/jest` must be removed — its globals (`describe`, `expect`, etc.) conflict with
  Vitest's own type declarations.
- `test.globals: true` in vite.config.ts makes Vitest's globals available without explicit
  imports, maintaining Jest-compatible test authoring style.
- `test.environment: "jsdom"` is required for React component tests.

---

## Phase 2 — Dependency Upgrades

**Status:** complete

**Goal:** Bring all packages to current stable versions.

| Package | From | To | Actual |
|---|---|---|---|
| `typescript` | 4.9.5 | 5.7+ | 5.9.3 — done in Phase 1 |
| `@types/node` | 16.x | latest | 25.4.0 — done in Phase 1 |
| `react` / `react-dom` | 18.2 | 18.3+ | **19.2.4** (upgraded to latest major) |
| `@types/react` / `@types/react-dom` | 18.0.x | latest | **19.2.14 / 19.2.3** |
| `react-router-dom` | 6.8.1 | 6.28+ | **removed** — replaced by `react-router@7.13.1` (see below) |
| `axios` | 1.3.4 | 1.7+ | **1.13.6** |
| `web-vitals` | 2.x | remove | already absent (removed in Phase 1) |

**React 19:** The original plan targeted 18.3+, but React 19 was chosen instead. No hard
breaking changes exist in the codebase (none of the removed APIs — `render()`, `forwardRef`,
`defaultProps`, `findDOMNode`, `propTypes`, string refs — are used). The stale default import
`import React from 'react'` in `src/index.tsx` was replaced with `import { StrictMode } from "react"`.

**React Router v7:** Rather than stopping at 6.28+, the `react-router-dom` package was
uninstalled and replaced with `react-router@7.13.1`. In v7 the two packages are consolidated;
`react-router` is the only package needed. All imports across 11 files were updated from
`from "react-router-dom"` → `from "react-router"`. No functional API changes were required
(`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`, `useLocation`, `Link` are
all identical in v7 declarative mode).

**`--legacy-peer-deps` note:** MUI 5.x (still present; removed in Phase 4) declares peer
deps of `react@"^17||^18"` and `@types/react@"^17||^18"`. While MUI remains in the project,
any `npm install` that touches the dependency tree must use `--legacy-peer-deps` to bypass
this stale constraint. This flag is no longer needed after Phase 4 removes MUI.

---

## Phase 3 — ESLint Flat Config + Prettier

**Status:** pending

**Goal:** Replace the implicit CRA ESLint setup with an explicit, strict config and add
Prettier for consistent formatting.

**Packages to add:**
- `eslint`, `@eslint/js`, `typescript-eslint`
- `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`
- `eslint-config-prettier`
- `prettier`

**Files to create:**
- `eslint.config.js` — ESLint 9 flat config; TypeScript + React + hooks + a11y rules,
  `eslint-config-prettier` last to disable formatting rules
- `.prettierrc` — match existing code style:
  ```json
  {
    "semi": true,
    "singleQuote": false,
    "tabWidth": 4,
    "trailingComma": "es5",
    "printWidth": 100
  }
  ```
- `.prettierignore` — `build/`, `dist/`, `node_modules/`

**`package.json` scripts to add:**
```json
"lint":   "eslint src --max-warnings 0",
"format": "prettier --write src"
```

**After setup:** run `npm run format` once to normalize all existing files (fixes the
single-quote inconsistency in `App.tsx` and minor whitespace issues).

Remove the `"eslintConfig"` key from `package.json` — it is superseded by `eslint.config.js`.

---

## Phase 4 — MUI → lucide-react

**Status:** pending

**Goal:** Drop the heavy MUI/Emotion stack (used only for icons) in favour of the
lightweight tree-shakeable `lucide-react` icon library.

**Packages:**
- Remove: `@mui/icons-material`, `@mui/material`, `@emotion/react`, `@emotion/styled`
- Add: `lucide-react`

Use `--legacy-peer-deps` for the remove step since MUI 5.x has stale peer dep constraints
against React 19 / `@types/react@19`. After MUI is removed this flag is no longer needed
for any subsequent installs.

**Only file affected:** `src/components/UrlEntry.tsx`

Icon substitution map:

| MUI import | lucide-react import |
|---|---|
| `ContentCopyIcon` | `Copy` |
| `ExpandLessIcon` | `ChevronUp` |
| `ExpandMoreIcon` | `ChevronDown` |
| `LaunchIcon` | `ExternalLink` |
| `EditIcon` | `Pencil` |
| `DeleteForeverIcon` | `Trash2` |

Lucide icons accept `size`, `strokeWidth`, and `className` props directly — existing CSS
classes on the icons require no changes.

---

## Phase 5 — Axios Instance + Service Layer Cleanup

**Status:** pending

**Goal:** Eliminate the manual `userToken` threading through every API call by creating a
shared Axios instance with a request interceptor. Also update service functions to throw
on error (instead of returning `{ error }` objects) so TanStack Query can own error state.

**Files to create:**
- `src/services/api.ts` — shared Axios instance:
  ```ts
  import axios from "axios";

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

  api.interceptors.request.use((config) => {
      const stored = localStorage.getItem("auth");
      const token = stored ? JSON.parse(stored).token : null;
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
  });

  export default api;
  ```

**Files to modify:**
- `src/services/urlsAPI.ts` — import `api` instead of `axios`; remove `userToken`
  parameter from all functions; replace try/catch error-object returns with `throw`
- `src/services/authAPI.ts` — same treatment
- `src/services/usersAPI.ts` — same treatment

**Result:** Service functions become clean one-liners. All `userToken` props passed into
components solely to hand off to services can be removed.

**Note:** This phase is a prerequisite for Phase 6 (TanStack Query) because TQ relies on
functions throwing to populate its `error` state.

---

## Phase 6 — TanStack Query

**Status:** pending

**Goal:** Replace all manual `useEffect` + `useState` data-fetching boilerplate with
TanStack Query. This also **completely eliminates the `urlCount` / `setUrlCount`
prop-drilling chain** that runs through `Dashboard` → `CreateForm` / `UrlList` → `UrlEntry`
(it exists solely to trigger refetches, which TQ handles via `invalidateQueries`).

**Packages:**
- Add: `@tanstack/react-query` (v5), `@tanstack/react-query-devtools`

**Files to create — `src/hooks/`:**

- `useUrlsQuery.ts`
  ```ts
  useQuery({ queryKey: ["urls"], queryFn: urlsAPI.getUrls })
  ```
- `useUrlCountQuery.ts`
  ```ts
  useQuery({ queryKey: ["urlCount"], queryFn: urlsAPI.getCount })
  ```
- `useCreateUrlMutation.ts`
  ```ts
  useMutation({
      mutationFn: (originalUrl: string) => urlsAPI.postUrl(originalUrl),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["urls"] }),
  })
  ```
- `useDeleteUrlMutation.ts` — same pattern, invalidates `["urls"]`
- `useUpdateUrlMutation.ts` — same pattern, invalidates `["urls"]`

**Files to modify:**
- `src/App.tsx` — wrap `<Routes>` in `<QueryClientProvider client={queryClient}>`;
  add `<ReactQueryDevtools />` inside (rendered only in dev)
- `src/components/Dashboard.tsx` — replace `useEffect` + `urlCount` state with
  `useUrlCountQuery`; remove `urlCount`/`setUrlCount` props passed to children
- `src/components/UrlList.tsx` — replace `useEffect` with `useUrlsQuery`; remove
  `urlCount`/`setUrlCount` props
- `src/components/UrlEntry.tsx` — replace manual `deleteUrl` call with
  `useDeleteUrlMutation`; remove `urlCount`/`setUrlCount` props
- `src/components/CreateForm.tsx` — replace manual `postUrl` call with
  `useCreateUrlMutation`; remove `urlCount`/`setUrlCount` props
- `src/components/UrlEditForm.tsx` — replace manual `patchUrl` call with
  `useUpdateUrlMutation`

**Loading and error states** come from `isPending`, `isError`, and `error` returned by
the hooks — no more hand-rolled `showError` / `errorMessage` state for fetch failures.

---

## Phase 7 — Auth Persistence + Context Simplification

**Status:** pending

**Goal:** Persist auth state to `localStorage` so users survive a page refresh. Also
simplify the context by deriving `isLoggedIn` from `userDetails` rather than storing it
as a separate, potentially-inconsistent boolean.

**Files to modify:**
- `src/context/AuthContext.tsx`:
  - On mount: read `localStorage.getItem("auth")`, JSON-parse and hydrate `userDetails`
  - Replace `isLoggedIn` `useState` with a derived boolean: `const isLoggedIn = userDetails !== null`
  - Whenever `userDetails` is set/cleared, sync to localStorage via `useEffect`
  - Add a `logout()` helper that calls `setUserDetails(null)` (localStorage is cleared
    by the effect above)
- `src/components/Login.tsx` — remove `setIsLoggedIn(true)` call (derived now)
- `src/components/Register.tsx` — same
- `src/components/Dashboard.tsx` — replace `navigate("/")` guard with a check on
  `userDetails` rather than `isLoggedIn`; use `logout()` helper if needed
- Any other component calling `setIsLoggedIn` directly — update to use `logout()`

**localStorage key:** `"auth"` (matches the key referenced in the axios interceptor
created in Phase 5)

---

## Phase 8 — Update AGENTS.md

**Status:** pending

**Goal:** Keep the developer guide accurate after all the above changes.

**Updates needed:**
- Commands: `npm run dev` (dev server), `npm run preview`, `npm run lint`, `npm run format`
- Test commands: `vitest` instead of `jest` / `react-scripts test`
- Env vars: `VITE_API_URL` instead of `REACT_APP_API_URL`
- Router import: `from "react-router"` (not `"react-router-dom"`) — package was consolidated in v7
- Icon imports: `lucide-react` (not `@mui/icons-material`) — see Phase 4 substitution map
- Service layer: functions now throw; no more `{ error }` return objects
- TanStack Query patterns: query keys, mutation + invalidation pattern
- Auth context: `logout()` helper, `isLoggedIn` is derived, localStorage persistence

---

## Execution Order

```
Phase 1 (Vite migration)
  └─ Phase 2 (dependency upgrades)
       └─ Phase 3 (ESLint + Prettier)  ← run `npm run format` immediately after
            ├─ Phase 4 (lucide-react)
            └─ Phase 5 (Axios instance)
                 └─ Phase 6 (TanStack Query)
                      └─ Phase 7 (auth persistence)
                           └─ Phase 8 (AGENTS.md update)
```

Phases 4 and 5 have no dependency on each other and can be done in either order or in
parallel sessions.
