---
name: contexts
description: "Skill for the Contexts area of new. 4 symbols across 2 files."
---

# Contexts

4 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `admin-react-app/`
- Understanding how AuthProvider work
- Modifying contexts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `admin-react-app/src/App.tsx` | ProtectedRoute, checkAuth, App |
| `admin-react-app/src/contexts/AuthContext.tsx` | AuthProvider |

## Entry Points

Start here when exploring this area:

- **`AuthProvider`** (Function) — `admin-react-app/src/contexts/AuthContext.tsx:18`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `AuthProvider` | Function | `admin-react-app/src/contexts/AuthContext.tsx` | 18 |
| `ProtectedRoute` | Function | `admin-react-app/src/App.tsx` | 12 |
| `checkAuth` | Function | `admin-react-app/src/App.tsx` | 17 |
| `App` | Function | `admin-react-app/src/App.tsx` | 37 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `App → CheckAuth` | intra_community | 3 |

## How to Explore

1. `context({name: "AuthProvider"})` — see callers and callees
2. `query({query: "contexts"})` — find related execution flows
3. Read key files listed above for implementation details
