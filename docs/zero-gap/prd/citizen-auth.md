# PRD: Citizen auth

Status: `Approved` · Parent: [TASKPLAN](../TASKPLAN.md)

## Problem
Citizen auth used ad-hoc useState forms without zod validation or consistent error states.

## In scope
- `/auth/login`, `/auth/register`, `/auth/reset`, `/auth/verify`
- react-hook-form + zod + shadcn Form
- Logic in `features/auth/`, pages as thin shells

## Success
- All P0 auth routes pass Gate 5
- Login migrated v0.3.0; register/reset v0.3.1
