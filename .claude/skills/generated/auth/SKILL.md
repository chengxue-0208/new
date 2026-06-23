---
name: auth
description: "Skill for the Auth area of new. 4 symbols across 2 files."
---

# Auth

4 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how register, register, login work
- Modifying auth-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/auth/auth.controller.ts` | register, login |
| `backend/src/auth/auth.service.ts` | register, login |

## Entry Points

Start here when exploring this area:

- **`register`** (Method) — `backend/src/auth/auth.controller.ts:12`
- **`register`** (Method) — `backend/src/auth/auth.service.ts:14`
- **`login`** (Method) — `backend/src/auth/auth.controller.ts:18`
- **`login`** (Method) — `backend/src/auth/auth.service.ts:46`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `register` | Method | `backend/src/auth/auth.controller.ts` | 12 |
| `register` | Method | `backend/src/auth/auth.service.ts` | 14 |
| `login` | Method | `backend/src/auth/auth.controller.ts` | 18 |
| `login` | Method | `backend/src/auth/auth.service.ts` | 46 |

## How to Explore

1. `context({name: "register"})` — see callers and callees
2. `query({query: "auth"})` — find related execution flows
3. Read key files listed above for implementation details
