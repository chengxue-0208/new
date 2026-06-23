---
name: user-subscription
description: "Skill for the User-subscription area of new. 21 symbols across 3 files."
---

# User-subscription

21 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how update, findOne, update work
- Modifying user-subscription-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/user-subscription/user-subscriptions.service.ts` | findOne, update, findAll, findByUser, findActive (+5) |
| `backend/src/user-subscription/user-subscriptions.controller.ts` | update, findAll, findByUser, findActive, findExpired (+4) |
| `backend/dist_bak/user-subscription/user-subscriptions.service.js` | findOne, update |

## Entry Points

Start here when exploring this area:

- **`update`** (Method) — `backend/src/user-subscription/user-subscriptions.controller.ts:45`
- **`findOne`** (Method) — `backend/src/user-subscription/user-subscriptions.service.ts:28`
- **`update`** (Method) — `backend/src/user-subscription/user-subscriptions.service.ts:39`
- **`findAll`** (Method) — `backend/src/user-subscription/user-subscriptions.controller.ts:10`
- **`findAll`** (Method) — `backend/src/user-subscription/user-subscriptions.service.ts:19`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `update` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 45 |
| `findOne` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 28 |
| `update` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 39 |
| `findAll` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 10 |
| `findAll` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 19 |
| `findByUser` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 15 |
| `findByUser` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 48 |
| `findActive` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 20 |
| `findActive` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 56 |
| `findExpired` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 25 |
| `findExpired` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 64 |
| `findByStatus` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 30 |
| `findByStatus` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 76 |
| `getStats` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 35 |
| `getStats` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 84 |
| `create` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 40 |
| `create` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 14 |
| `remove` | Method | `backend/src/user-subscription/user-subscriptions.controller.ts` | 50 |
| `remove` | Method | `backend/src/user-subscription/user-subscriptions.service.ts` | 44 |
| `findOne` | Method | `backend/dist_bak/user-subscription/user-subscriptions.service.js` | 37 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Update → FindOne` | intra_community | 3 |

## How to Explore

1. `context({name: "update"})` — see callers and callees
2. `query({query: "user-subscription"})` — find related execution flows
3. Read key files listed above for implementation details
