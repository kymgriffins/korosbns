# Page Spec: Citizen login (`/auth/login`)

Parent PRD: [citizen-auth](../prd/citizen-auth.md) · Status: `QA'd`

## Purpose
Sign in to access learn and citizen features.

## Primary action
Submit credentials.

## States
| State | Behavior |
|-------|----------|
| Validation error | FormMessage per field |
| Network/auth error | FormStatus banner |
| Success | Redirect to `next` |

## Component map
CitizenLoginForm (rhf + zod + shadcn Form) — step 2 composition

## Sign-off
- [x] rhf + zod
- [x] Thin page shell
