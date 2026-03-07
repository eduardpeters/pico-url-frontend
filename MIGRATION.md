# Migration Plan — Pico URL Frontend Modernization

Each phase is independently shippable. Complete and verify (build + type-check) before
starting the next. Phases 4 and 5 can run in parallel once Phase 3 is done.

---

## Phase 1 — CRA → Vite

**Status:** pending

**Goal:** Replace the unmaintained Create React App toolchain with Vite.

**Packages:**
- Remove: `react-scripts`
- Add: `vite`, `@vitejs/plugin-react`
- Add (testing): `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/jest-dom` (latest),
  `@testing-library/react` (latest), `@testing-library/user-event` (latest)

**Files to create:**
- `vite.config.ts` — React plugin, dev server port 3000
- `src/vite-env.d.ts` — `/// <reference types="vite/client" />`

**Files to modify:**
- `public/index.html` → move to project root; replace the static bundle script tag with
  `<script type="module" src="/src/index.tsx">`
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
  (only in `src/services/urlsAPI.ts` and `src/services/authAPI.ts`)
- `.env` files (if any): rename `REACT_APP_API_URL` → `VITE_API_URL`

**Files to delete:**
- `src/react-app-env.d.ts`

**Notes:**
- No existing tests to migrate (Vitest API is Jest-compatible, zero effort).
- `web-vitals` can be removed — it is a CRA-era dependency not used in the app logic.

---

## Phase 2 — Dependency Upgrades

**Status:** pending

**Goal:** Bring all packages to current stable versions.

| Package | From | To |
|---|---|---|
| `typescript` | 4.9.5 | 5.7+ |
| `react` / `react-dom` | 18.2 | 18.3+ |
| `@types/react` / `@types/react-dom` | 18.0.x | latest |
| `@types/node` | 16.x | latest |
| `react-router-dom` | 6.8.1 | 6.28+ |
| `axios` | 1.3.4 | 1.7+ |
| `web-vitals` | 2.x | **remove** |

No API-level breaking changes are expected for any of these version bumps.

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
