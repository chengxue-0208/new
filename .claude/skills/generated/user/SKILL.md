---
name: user
description: "Skill for the User area of new. 18 symbols across 3 files."
---

# User

18 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how getUserSubscription, findOne, update work
- Modifying user-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/user/user.controller.ts` | getUserSubscription, findOne, update, findAll, search (+2) |
| `backend/src/user/user.service.ts` | findOne, update, getSubscriptionStatus, findAll, findByEmail (+2) |
| `backend/dist_bak/user/user.service.js` | findOne, findByEmail, update, getSubscriptionStatus |

## Entry Points

Start here when exploring this area:

- **`getUserSubscription`** (Method) — `backend/src/user/user.controller.ts:20`
- **`findOne`** (Method) — `backend/src/user/user.controller.ts:25`
- **`update`** (Method) — `backend/src/user/user.controller.ts:35`
- **`findOne`** (Method) — `backend/src/user/user.service.ts:54`
- **`update`** (Method) — `backend/src/user/user.service.ts:69`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getUserSubscription` | Method | `backend/src/user/user.controller.ts` | 20 |
| `findOne` | Method | `backend/src/user/user.controller.ts` | 25 |
| `update` | Method | `backend/src/user/user.controller.ts` | 35 |
| `findOne` | Method | `backend/src/user/user.service.ts` | 54 |
| `update` | Method | `backend/src/user/user.service.ts` | 69 |
| `getSubscriptionStatus` | Method | `backend/src/user/user.service.ts` | 78 |
| `findAll` | Method | `backend/src/user/user.controller.ts` | 10 |
| `findAll` | Method | `backend/src/user/user.service.ts` | 23 |
| `search` | Method | `backend/src/user/user.controller.ts` | 15 |
| `findByEmail` | Method | `backend/src/user/user.service.ts` | 65 |
| `create` | Method | `backend/src/user/user.controller.ts` | 30 |
| `create` | Method | `backend/src/user/user.service.ts` | 18 |
| `remove` | Method | `backend/src/user/user.controller.ts` | 40 |
| `remove` | Method | `backend/src/user/user.service.ts` | 74 |
| `findOne` | Method | `backend/dist_bak/user/user.service.js` | 37 |
| `findByEmail` | Method | `backend/dist_bak/user/user.service.js` | 47 |
| `update` | Method | `backend/dist_bak/user/user.service.js` | 50 |
| `getSubscriptionStatus` | Method | `backend/dist_bak/user/user.service.js` | 57 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Update → FindOne` | intra_community | 3 |
| `GetUserSubscription → FindOne` | intra_community | 3 |

## How to Explore

1. `context({name: "getUserSubscription"})` — see callers and callees
2. `query({query: "user"})` — find related execution flows
3. Read key files listed above for implementation details
