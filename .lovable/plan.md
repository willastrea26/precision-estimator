# A-Precision — App Shell (Phase 1) — Revised

Adds logo treatment, auth page polish, sidebar footer detail, and a minimal Settings preview to the previous plan. Everything else from the prior plan stands unchanged.

## Still pending confirmation from previous plan
1. **TanStack Router** stays in place (vs ripping in `react-router-dom`). Strongly recommended.
2. Company name stored in `auth.users.user_metadata.company_name` until the Phase 2 `organisations` table exists.
3. Email confirmation disabled in Supabase Auth for v1.

## New / changed in this revision

### 1. Logo component (`src/components/Logo.tsx`)
Pure-typographic, no asset.
- Line 1: `A-Precision` — `text-2xl font-bold text-white tracking-tight`
- Line 2: `Civil Estimating Intelligence` — `text-xs uppercase tracking-wide text-primary` (the bright-blue accent token, #3B82F6)
- Props: `size?: 'sm' | 'md'` (sm = `text-xl` / no change in subtitle, used in sidebar header; md = default, used on auth pages), `align?: 'left' | 'center'`.
- Used in: `AppSidebar` header, and all four auth pages (`login`, `signup`, `forgot-password`, `reset-password`).

### 2. Auth page polish
Shared layout component `src/components/AuthLayout.tsx`:
- Full-screen dark navy background (`bg-background`, which resolves to #0A0E1A from Phase 1 tokens).
- Blueprint grid overlay: inline SVG `<pattern>` — 1px lines every 40px in a muted blue (`#3B82F6` at 5% opacity), absolutely positioned, `pointer-events-none`, behind content.
- Centered Card (`max-w-[400px] w-full`), `bg-card`, `border-border`, `shadow-2xl`, generous padding.
- Logo at top of card (centered).
- Below logo: page title (e.g. "Sign in") + muted subtitle.
- Children = the form.
- Below form: alternate-auth link.

Form details (login / signup / forgot-password / reset-password):
- shadcn `Form` + `react-hook-form` + `zod` resolver for validation messages.
- Labels via shadcn `Label`, inputs via shadcn `Input`.
- Submit button: full-width, `bg-blue-600 hover:bg-blue-700 text-white` (explicit per spec rather than `bg-primary`, since you named the exact shades).
- Disabled + spinner state while submitting.
- `sonner` toasts: `toast.error(...)` on auth failure with the Supabase error message; `toast.success(...)` on success (e.g. "Welcome back", "Account created", "Reset link sent", "Password updated").

Signup fields: Company name, Email, Password (min 8). Login: Email, Password. Forgot: Email. Reset: New password + confirm.

### 3. Sidebar footer (`AppSidebar.tsx`)
- Avatar circle (shadcn `Avatar` with `AvatarFallback`): 32px, `bg-blue-600 text-white`, shows first letter of email uppercased.
- Email next to it: `text-sm text-foreground truncate` so long emails clip with ellipsis at the 240px sidebar width. `title={email}` for full hover.
- Below that row: full-width Sign out `Button variant="ghost"` with `LogOut` icon (lucide), `text-muted-foreground hover:text-foreground`. On click → `signOut()` → toast → navigate to `/login`.

### 4. Settings preview (`src/routes/_authenticated/settings.tsx`)
Replaces the bare `EmptyState` for this one route with a minimal profile Card (everything else still empty per Phase 1 spec):
- Card titled "Profile".
- Three rows, label in `text-muted-foreground text-sm`, value in `text-foreground`:
  - **Logged in as:** `{user.email}`
  - **Company:** `{user.user_metadata.company_name ?? '—'}`
  - **Member since:** `{user.created_at}` formatted via `new Intl.DateTimeFormat('en-AU', { dateStyle: 'long' })` → e.g. "27 May 2026".
- Below the Card, keep a small muted note: "Full settings coming soon."
- All data sourced from the already-loaded `context.auth.user` — no new server fn, no DB call.

## File map (delta vs previous plan)

```
src/
  components/
    Logo.tsx                       (new)
    AuthLayout.tsx                 (new — wraps blueprint bg + centered card + logo)
    AppSidebar.tsx                 (already in prev plan; footer detail per §3)
  routes/
    login.tsx, signup.tsx,
    forgot-password.tsx,
    reset-password.tsx             (already in prev plan; now use AuthLayout + Logo + sonner)
    _authenticated/settings.tsx    (already in prev plan; now renders profile Card instead of EmptyState)
```

No other pages or files are changed by this revision. All seven other placeholder routes still render `EmptyState` with the exact copy from the prior plan.

## Out of scope (unchanged)
- No DB tables, no `profiles` table, no RLS — Phase 2.
- No dashboard widgets, no project list — Phase 3+.
- No demo data anywhere.
- No social sign-in.

Ready to build on approval.
