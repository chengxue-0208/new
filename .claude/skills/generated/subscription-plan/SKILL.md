---
name: subscription-plan
description: "Skill for the Subscription-plan area of new. 12 symbols across 3 files."
---

# Subscription-plan

12 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how findOne, update, findOne work
- Modifying subscription-plan-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/subscription-plan/subscription-plans.controller.ts` | findOne, update, findAll, create, remove |
| `backend/src/subscription-plan/subscription-plans.service.ts` | findOne, update, findAll, create, remove |
| `backend/dist_bak/subscription-plan/subscription-plans.service.js` | findOne, update |

## Entry Points

Start here when exploring this area:

- **`findOne`** (Method) — `backend/src/subscription-plan/subscription-plans.controller.ts:15`
- **`update`** (Method) — `backend/src/subscription-plan/subscription-plans.controller.ts:25`
- **`findOne`** (Method) — `backend/src/subscription-plan/subscription-plans.service.ts:26`
- **`update`** (Method) — `backend/src/subscription-plan/subscription-plans.service.ts:36`
- **`findAll`** (Method) — `backend/src/subscription-plan/subscription-plans.controller.ts:10`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `findOne` | Method | `backend/src/subscription-plan/subscription-plans.controller.ts` | 15 |
| `update` | Method | `backend/src/subscription-plan/subscription-plans.controller.ts` | 25 |
| `findOne` | Method | `backend/src/subscription-plan/subscription-plans.service.ts` | 26 |
| `update` | Method | `backend/src/subscription-plan/subscription-plans.service.ts` | 36 |
| `findAll` | Method | `backend/src/subscription-plan/subscription-plans.controller.ts` | 10 |
| `findAll` | Method | `backend/src/subscription-plan/subscription-plans.service.ts` | 17 |
| `create` | Method | `backend/src/subscription-plan/subscription-plans.controller.ts` | 20 |
| `create` | Method | `backend/src/subscription-plan/subscription-plans.service.ts` | 12 |
| `remove` | Method | `backend/src/subscription-plan/subscription-plans.controller.ts` | 30 |
| `remove` | Method | `backend/src/subscription-plan/subscription-plans.service.ts` | 41 |
| `findOne` | Method | `backend/dist_bak/subscription-plan/subscription-plans.service.js` | 35 |
| `update` | Method | `backend/dist_bak/subscription-plan/subscription-plans.service.js` | 44 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Update → FindOne` | intra_community | 3 |

## How to Explore

1. `context({name: "findOne"})` — see callers and callees
2. `query({query: "subscription-plan"})` — find related execution flows
3. Read key files listed above for implementation details
