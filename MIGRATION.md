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

| Package                             | From   | To     | Actual                                                      |
| ----------------------------------- | ------ | ------ | ----------------------------------------------------------- |
| `typescript`                        | 4.9.5  | 5.7+   | 5.9.3 — done in Phase 1                                     |
| `@types/node`                       | 16.x   | latest | 25.4.0 — done in Phase 1                                    |
| `react` / `react-dom`               | 18.2   | 18.3+  | **19.2.4** (upgraded to latest major)                       |
| `@types/react` / `@types/react-dom` | 18.0.x | latest | **19.2.14 / 19.2.3**                                        |
| `react-router-dom`                  | 6.8.1  | 6.28+  | **removed** — replaced by `react-router@7.13.1` (see below) |
| `axios`                             | 1.3.4  | 1.7+   | **1.13.6**                                                  |
| `web-vitals`                        | 2.x    | remove | already absent (removed in Phase 1)                         |

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
this stale constraint. After Phase 4 removes MUI, `eslint-plugin-jsx-a11y@6.10.2` became
the new source of the constraint (its peer dep range excludes eslint v10). This flag
remains necessary for any `npm install` until `eslint-plugin-jsx-a11y` is updated.

---

## Phase 3 — ESLint Flat Config + Prettier

**Status:** complete

**Goal:** Replace the implicit CRA ESLint setup with an explicit, strict config and add
Prettier for consistent formatting.

**Packages added (all `devDependencies`):**

| Package                     | Version |
| --------------------------- | ------- |
| `eslint`                    | 10.0.3  |
| `@eslint/js`                | 10.0.1  |
| `typescript-eslint`         | 8.57.0  |
| `eslint-plugin-react`       | 7.37.5  |
| `eslint-plugin-react-hooks` | 7.0.1   |
| `eslint-plugin-jsx-a11y`    | 6.10.2  |
| `eslint-config-prettier`    | 10.1.8  |
| `prettier`                  | 3.8.1   |

**Files created:**

- `eslint.config.mjs` — ESLint flat config (note: `.mjs` extension, not `.js`):

    ```js
    import js from "@eslint/js";
    import tseslint from "typescript-eslint";
    import reactPlugin from "eslint-plugin-react";
    import reactHooksPlugin from "eslint-plugin-react-hooks";
    import jsxA11y from "eslint-plugin-jsx-a11y";
    import prettier from "eslint-config-prettier";

    export default tseslint.config(
        js.configs.recommended,
        tseslint.configs.recommended,
        reactPlugin.configs.flat.recommended,
        reactPlugin.configs.flat["jsx-runtime"], // disables react/react-in-jsx-scope
        reactHooksPlugin.configs.flat["recommended-latest"],
        jsxA11y.flatConfigs.recommended,
        { settings: { react: { version: "19.0" } } },
        prettier // must be last — disables conflicting formatting rules
    );
    ```

- `.prettierrc` — as planned:
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

**`package.json` changes:**

- Scripts `lint` and `format` added as planned
- `"eslintConfig"` key removed (was already absent — cleaned up during Phase 1/2)

**Adjustments vs plan:**

- Config file uses `.mjs` extension (`eslint.config.mjs`) to avoid CommonJS/ESM ambiguity
  in the project's module context.
- `reactPlugin.configs.flat["jsx-runtime"]` spread added alongside
  `reactPlugin.configs.flat.recommended` — this disables the `react/react-in-jsx-scope`
  rule, which is required when using React 19's new JSX transform (no `import React` needed
  in JSX files).
- `react.version` pinned to `"19.0"` in the settings object rather than `"detect"` to
  avoid a runtime `require("react")` call during linting.

---

## Phase 4 — MUI → lucide-react

**Status:** complete

**Goal:** Drop the heavy MUI/Emotion stack (used only for icons) in favour of the
lightweight tree-shakeable `lucide-react` icon library.

**Packages:**

- Remove: `@mui/icons-material`, `@mui/material`, `@emotion/react`, `@emotion/styled`
  (57 transitive deps removed)
- Add: `lucide-react@0.577.0`

`--legacy-peer-deps` was required for both the remove and install steps. The original
plan assumed this flag would only be needed for the remove step (due to MUI 5.x's stale
peer dep constraints against React 19 / `@types/react@19`). However, after MUI was
removed a second stale constraint was revealed: `eslint-plugin-jsx-a11y@6.10.2` declares
a peer dep range of `eslint@"^3 || ... || ^9"` which excludes eslint v10. Until
`eslint-plugin-jsx-a11y` is updated, `--legacy-peer-deps` remains necessary for any
`npm install` that touches the dependency tree.

**Files affected:** `src/components/UrlEntry.tsx`, `src/components/ResultModal.tsx`

`ResultModal.tsx` was not listed in the original plan but also imported `ContentCopyIcon`
from `@mui/icons-material` and required the same substitution.

Icon substitution map:

| MUI import          | lucide-react import | `size` prop |
| ------------------- | ------------------- | ----------- |
| `ContentCopyIcon`   | `Copy`              | `16`        |
| `ExpandLessIcon`    | `ChevronUp`         | `35`        |
| `ExpandMoreIcon`    | `ChevronDown`       | `35`        |
| `LaunchIcon`        | `ExternalLink`      | `16`        |
| `EditIcon`          | `Pencil`            | `16`        |
| `DeleteForeverIcon` | `Trash2`            | `35`        |

MUI icons are sized by CSS `font-size`; the `.entry__icon` rule sets `font-size: 1rem`
(~16px). Lucide icons are sized by their `size` prop (width/height) and ignore
`font-size`. Explicit `size` props were added to all icons to preserve the existing
visual appearance: `size={16}` for inline icons (matching `1rem`), `size={35}` for the
expand/delete icons (matching MUI's `fontSize="large"` = 35px).

`ResultModal`'s `Copy` icon carries no explicit `size` prop — both MUI and Lucide
default to 24px for that usage.

---

## Phase 5 — Axios Instance + Service Layer Cleanup

**Status:** complete

**Goal:** Eliminate the manual `userToken` threading through every API call by creating a
shared Axios instance with a request interceptor. Also update service functions to throw
on error (instead of returning `{ error }` objects) so TanStack Query can own error state.

**Files created:**

- `src/services/api.ts` — shared Axios instance (exactly as planned)

**Files modified:**

- `src/services/urlsAPI.ts` — imports `api`; `userToken` removed from `getCount`,
  `getUrls`, `postUrl`, `patchUrl`, `deleteUrl`; try/catch wrappers removed (errors throw)
- `src/services/authAPI.ts` — same treatment
- `src/services/usersAPI.ts` — same treatment
- `src/components/UrlEditForm.tsx` — `userToken` prop removed; `patchUrl` call updated
- `src/components/UrlEntry.tsx` — `userToken` prop removed; `deleteUrl` call updated;
  no longer passes `userToken` to `UrlEditForm`; delete wrapped in try/catch
- `src/components/UrlList.tsx` — `userToken` removed from `getUrls` call; try/catch added
- `src/components/CreateForm.tsx` — `userToken` removed from `postUrl` call; try/catch
  replaces `response.error` duck-typing; `useAuthContext` import removed (no longer needed)
- `src/components/Dashboard.tsx` — `userToken` removed from `getCount` call; try/catch added
- `src/components/Login.tsx` — `postLogIn` wrapped in try/catch; on success, writes
  `{ id, name, email, token }` to `localStorage["auth"]` so the interceptor has a token
  immediately (bridging the gap until Phase 7 formalises persistence in the context)
- `src/components/Register.tsx` — `postRegister` wrapped in try/catch
- `src/components/UserInfo.tsx` — logout handler calls `localStorage.removeItem("auth")`
  before clearing context state

**Adjustments vs plan:**

- Components were updated alongside the service files (the plan only listed service files
  explicitly, but removing `userToken` from service signatures forced cascading component
  updates as part of the same phase).
- `Login.tsx` writes to `localStorage["auth"]` as a bridge: the interceptor created here
  reads from that key, but Phase 7 is where the context gains its `useEffect`-based sync.
  Without this write the app would have been functionally broken between phases. Phase 7
  will move the write into the context effect; no rework of the stored shape is needed
  since both use the same `{ id, name, email, token }` object.
- `UrlEditForm.tsx` had a pre-existing bug: `patchUrl` was called with `originalUrl`
  instead of `newUrl`. Fixed as part of this phase. `closeForm()` is now also called on
  a successful patch.

**Note:** This phase is a prerequisite for Phase 6 (TanStack Query) because TQ relies on
functions throwing to populate its `error` state.

---

## Phase 6 — TanStack Query

**Status:** complete

**Goal:** Replace all manual `useEffect` + `useState` data-fetching boilerplate with
TanStack Query. This also **completely eliminates the `urlCount` / `setUrlCount`
prop-drilling chain** that ran through `Dashboard` → `CreateForm` / `UrlList` → `UrlEntry`
(it existed solely to trigger refetches, which TQ handles via `invalidateQueries`).

**Packages added:**

- `@tanstack/react-query@5.x`
- `@tanstack/react-query-devtools@5.x`

(`--legacy-peer-deps` required, same constraint as previous phases.)

**Files created — `src/hooks/`:**

- `useUrlsQuery.ts` — `useQuery({ queryKey: ["urls"], queryFn: urlsAPI.getUrls, enabled: !!token })`
- `useUrlCountQuery.ts` — `useQuery({ queryKey: ["urlCount"], queryFn: urlsAPI.getCount, enabled: !!token })`
- `useCreateUrlMutation.ts` — invalidates `["urls"]` **and** `["urlCount"]` on success
- `useDeleteUrlMutation.ts` — same, invalidates both `["urls"]` and `["urlCount"]`
- `useUpdateUrlMutation.ts` — invalidates `["urls"]` only (update does not change count)

**Files modified:**

- `src/App.tsx` — `QueryClientProvider` (with `queryClient` instance) wraps
  `AuthContextProvider`; `<ReactQueryDevtools initialIsOpen={false} />` placed inside
  `QueryClientProvider`, outside `AuthContextProvider`
- `src/components/Dashboard.tsx` — `useEffect` + `urlCount`/`setUrlCount` state removed;
  `useUrlCountQuery` used for count; `isError`/`error` from the hook wired into the
  existing `RetryModal`; `urlCount`/`setUrlCount` props removed from `<CreateForm>`,
  `<UrlList>`, and `<UserInfo>`
- `src/components/UserInfo.tsx` — `urlCount` prop and `UserInfoProps` interface removed;
  calls `useUrlCountQuery` directly; count derived as `data?.count ?? 0`
- `src/components/UrlList.tsx` — `useEffect` + `userUrls`/`showError`/`errorMessage` state
  removed; `useUrlsQuery` used; `isPending` and `isError` drive loading/error rendering;
  `UrlListProps` interface and `urlCount`/`setUrlCount` props removed
- `src/components/UrlEntry.tsx` — manual `urlsAPI.deleteUrl` + `setUrlCount` replaced with
  `useDeleteUrlMutation` + `mutateAsync`; `UrlEntryProps` reduced to `entry` only
- `src/components/CreateForm.tsx` — manual `urlsAPI.postUrl` replaced with
  `useCreateUrlMutation` + `mutateAsync`; `mutateAsync` returns the full Axios response so
  the existing `handleResponse` status-check (200 vs 201) is preserved unchanged;
  `CreateFormProps` interface and `urlCount`/`setUrlCount` props removed
- `src/components/UrlEditForm.tsx` — manual `urlsAPI.patchUrl` replaced with
  `useUpdateUrlMutation` + `mutateAsync`; `{ shortUrl, newUrl }` passed as a single params
  object matching the `UpdateUrlParams` interface defined in the hook

**Adjustments vs original plan:**

- **`enabled` option added to both query hooks.** The original plan omitted this. Both
  `useUrlsQuery` and `useUrlCountQuery` include `enabled: !!token` (token read from
  `authContext?.userDetails?.token`) to prevent unauthenticated requests during the brief
  render before `Dashboard`'s navigation guard fires.
- **Create and delete mutations invalidate `["urlCount"]` in addition to `["urls"]`.**
  The original plan only listed `["urls"]`. Without also invalidating `["urlCount"]`,
  `UserInfo`'s displayed count would be stale after create/delete mutations.
- **`UserInfo` was updated (not listed in original plan).** Removing the `urlCount` prop
  required `UserInfo` to call `useUrlCountQuery` directly. Since the query result is
  already cached, this adds no extra network request.
- **`QueryClientProvider` wraps `AuthContextProvider`** (outside, not inside). Auth state
  is read from `localStorage` via the Axios interceptor — query hooks do not need React
  auth context — so there is no functional difference, but this keeps `QueryClientProvider`
  at the outermost practical level.
- **`ReactQueryDevtools` is placed outside `AuthContextProvider`** (but inside
  `QueryClientProvider`) so it is always accessible regardless of auth state.

---

## Phase 7 — Auth Persistence + Context Simplification

**Status:** complete

**Goal:** Persist auth state to `localStorage` so users survive a page refresh. Also
simplify the context by deriving `isLoggedIn` from `userDetails` rather than storing it
as a separate, potentially-inconsistent boolean.

**Files modified:**

- `src/context/AuthContext.tsx`:
    - `UserDetailsInterface` exported (was private)
    - `readStoredAuth()` helper initializes `userDetails` state from `localStorage["auth"]`
      on mount; try/catch falls back to `null` on malformed JSON
    - `isLoggedIn` `useState` removed; replaced with derived `const isLoggedIn = userDetails !== null`
    - `useEffect([userDetails])` syncs state to `localStorage` (sets on login, removes on logout)
    - `logout()` helper added: calls `setUserDetails(null)`; the effect handles storage cleanup
    - `AuthContextInterface` updated: `setIsLoggedIn` removed, `logout: () => void` added
- `src/components/Login.tsx` — removed `localStorage.setItem("auth", ...)` (context effect
  now owns persistence) and `setIsLoggedIn(true)` call (derived)
- `src/components/UserInfo.tsx` — replaced the three-line manual logout sequence
  (`localStorage.removeItem`, `setUserDetails(null)`, `setIsLoggedIn(false)`) with a single
  `authContext?.logout()` call
- `src/components/Dashboard.tsx` — guard simplified from
  `!authContext?.isLoggedIn || !authContext.userDetails?.token` to
  `!authContext?.userDetails?.token`; dependency array updated to match

**localStorage key:** `"auth"` (matches the key referenced in the axios interceptor
created in Phase 5)

**Adjustments vs plan:**

- `Register.tsx` required no changes. The plan noted "same treatment as Login.tsx" but
  Register.tsx has never called `setIsLoggedIn` — it navigates to `/login` on success
  without touching auth context.
- `UserDetailsInterface` was exported as part of this phase (not mentioned in the original
  plan) to make the type available to consumers without redundant inline type definitions.
- `readStoredAuth()` wraps `JSON.parse` in try/catch with a `null` fallback (not mentioned
  in the original plan) to guard against malformed data left by previous app versions.

---

## Phase 8 — Update AGENTS.md

**Status:** complete

**Goal:** Keep the developer guide accurate after all the above changes.

**Updates made:**

- Project Overview: React 18 / TypeScript 4.9 / CRA → React 19 / TypeScript 5.x / Vite;
  dependency list updated (React Router DOM v6, MUI, Emotion → React Router v7,
  lucide-react, TanStack Query v5)
- Commands: full block replaced — `npm run dev` as primary dev command, `→ /dist` output
  dir, `npm run lint` and `npm run format` added, `npm test` documented as Vitest; CI test
  command updated from `CI=true npm test` to `npm test -- run`; ESLint config noted as
  `eslint.config.mjs` (flat config) not `package.json`; Prettier config documented
- TypeScript: `"moduleResolution": "bundler"` bullet added; `"Babel transpiles"` →
  `"Vite/esbuild transpiles"`
- Imports: React Router example updated from `"react-router-dom"` → `"react-router"`;
  third-party line updated to reference TanStack Query and lucide-react
- Error Handling: service-layer and component-layer patterns fully replaced — services now
  throw (no try/catch, no `{ error }` return); callers use try/catch
- API Services: `process.env.REACT_APP_API_URL` → `import.meta.env.VITE_API_URL`; manual
  bearer token header note removed; shared `api.ts` instance documented; direct `axios`
  import prohibition noted
- State Management: `setIsLoggedIn` example removed; login/logout patterns documented
  (`setUserDetails` / `logout()`); `isLoggedIn` noted as derived; localStorage persistence
  noted as automatic via context `useEffect`; TanStack Query subsection added (hooks in
  `src/hooks/`, query key conventions, `enabled: !!token`, mutation + invalidation pattern)
- Testing: Jest → Vitest; single-file run command updated from `--testPathPattern=` to
  Vitest's positional filter syntax

---

## Execution Order

```
Phase 1 (Vite migration)          ✓ complete
  └─ Phase 2 (dependency upgrades)          ✓ complete
       └─ Phase 3 (ESLint + Prettier)       ✓ complete
            ├─ Phase 4 (lucide-react)       ✓ complete
            └─ Phase 5 (Axios instance)     ✓ complete
                 └─ Phase 6 (TanStack Query)          ✓ complete
                       └─ Phase 7 (auth persistence)   ✓ complete
                             └─ Phase 8 (AGENTS.md update)   ✓ complete
```

Phases 4 and 5 have no dependency on each other and can be done in either order or in
parallel sessions.
