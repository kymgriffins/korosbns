# Page Spec: Learn Account (`/learn/account`)

Parent PRD: [learn-hub](../prd/learn-hub.md) · Status: `QA'd`

## Purpose
Manage user account settings — password, notifications, and language preferences.

## Users & Entry Points
- Who arrives here: Logged-in users only (protected route)
- Entry points: Learn Studio header avatar → Account, `/learn/account` direct URL

## Primary Action
Update account settings (password, notifications, language) or sign out.

## States

| State | What's shown | What's interactive | What's disabled/hidden |
|-------|-------------|-------------------|----------------------|
| Loading — auth gate | Protected gate checking session | Nothing | All |
| Error — session expired | Redirect to login with return URL | Sign in | All |
| Populated | Profile avatar, edit fields, notification switches, password form, language selector, sign-out + reset buttons | All form inputs, switches, buttons | N/A |
| Permission-denied | Redirect to login via `Protected` gate | Sign in | All |

## Data Contract

| Field shown | Source | Type | Behavior if null/missing |
|------------|--------|------|-------------------------|
| Display name | `user.display_name` | string | Show fallback "Citizen" |
| First/last name | `user.first_name` / `user.last_name` | string | Show empty |
| County | `user.county` | string | "Kenya" default |
| Ward | `user.ward` | string | Show "—" |
| Email | `user.email` | string | Show "—" |
| Notification pref | `user.notifications_enabled` | boolean | Default true |
| WhatsApp pref | `user.whatsapp_fallback` | boolean | Default false |
| Language | `profile.language` | "EN" \| "SW" \| "SH" | Default "EN" |
| Avatar URL | `user.avatar_url` | URL string | Bitmoji fallback |

## Component Map

| UI element | Component used | Decision tree step | Notes |
|-----------|---------------|-------------------|-------|
| Auth gate | `Protected` component | 2 (composition) | Wraps layout |
| Avatar | `ProfileAvatarEditor` | 2 (composition) | Reused from profile |
| Profile form | shadcn Input | 1 (primitive) | react-hook-form |
| Notification switches | shadcn Switch | 1 (primitive) | With labels |
| Password form | `PasswordInput` | 1 (primitive) | Two-password validation |
| Language selector | Button group | 2 (composition) | Three-language toggle |
| Sign out | Button | 1 (primitive) | With LogOut icon |

## Motion Spec

N/A — account page is static form-driven, no animations needed beyond micro hover states.

## Responsive Behavior

| Breakpoint | Layout change |
|-----------|---------------|
| sm (mobile) | Single-column stacked sections |
| md (tablet) | Two-column profile form fields |
| lg (desktop) | Same as md, wider container |

## Accessibility

- Focus order through all form fields, submit buttons, sign-out
- Keyboard-only path through multi-field password form

## Edge Cases

| Edge case | Expected behavior |
|-----------|------------------|
| Password too short (< 8 chars) | Client-side validation toast before submit |
| Passwords don't match | Toast error, form not submitted |
| Network failure on password change | Toast error, form data preserved |
| User not logged in | Protected gate → redirect to /login |

## Exit Points

| From | To | Trigger |
|------|-----|---------|
| Account page | `/learn` | Sidebar nav |
| Sign out | `/` | Sign out button click |
| Sign out | `/auth/login` | Redirect after logout |

## Sign-off

- [x] Matches parent PRD scope
- [x] All states filled (no blanks)
- [x] Component Decision Tree followed for every element
- [ ] Motion tokens used, no invented values
- [ ] Ready for Gate 4 (Build)
