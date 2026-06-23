---
name: order
description: "Skill for the Order area of new. 24 symbols across 6 files."
---

# Order

24 symbols | 6 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how findOne, update, findOne work
- Modifying order-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/order/orders.controller.ts` | findOne, update, findAll, findByUser, findByStatus (+2) |
| `backend/src/order/orders.service.ts` | findOne, update, findAll, findByUser, findByStatus (+2) |
| `backend/dist_bak/order/order.service.js` | findOne, create, updateStatus |
| `backend/src/order/order.service.ts` | findOne, updateStatus, findAll |
| `backend/src/order/order.controller.ts` | findOne, findAll |
| `backend/dist_bak/order/orders.service.js` | findOne, update |

## Entry Points

Start here when exploring this area:

- **`findOne`** (Method) — `backend/src/order/orders.controller.ts:21`
- **`update`** (Method) — `backend/src/order/orders.controller.ts:41`
- **`findOne`** (Method) — `backend/src/order/orders.service.ts:52`
- **`update`** (Method) — `backend/src/order/orders.service.ts:63`
- **`findOne`** (Method) — `backend/src/order/order.controller.ts:16`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `findOne` | Method | `backend/src/order/orders.controller.ts` | 21 |
| `update` | Method | `backend/src/order/orders.controller.ts` | 41 |
| `findOne` | Method | `backend/src/order/orders.service.ts` | 52 |
| `update` | Method | `backend/src/order/orders.service.ts` | 63 |
| `findOne` | Method | `backend/src/order/order.controller.ts` | 16 |
| `findOne` | Method | `backend/src/order/order.service.ts` | 20 |
| `updateStatus` | Method | `backend/src/order/order.service.ts` | 51 |
| `findAll` | Method | `backend/src/order/order.controller.ts` | 10 |
| `findAll` | Method | `backend/src/order/order.service.ts` | 14 |
| `findAll` | Method | `backend/src/order/orders.controller.ts` | 10 |
| `findAll` | Method | `backend/src/order/orders.service.ts` | 20 |
| `findByUser` | Method | `backend/src/order/orders.controller.ts` | 26 |
| `findByUser` | Method | `backend/src/order/orders.service.ts` | 72 |
| `findByStatus` | Method | `backend/src/order/orders.controller.ts` | 31 |
| `findByStatus` | Method | `backend/src/order/orders.service.ts` | 80 |
| `create` | Method | `backend/src/order/orders.controller.ts` | 36 |
| `create` | Method | `backend/src/order/orders.service.ts` | 15 |
| `remove` | Method | `backend/src/order/orders.controller.ts` | 46 |
| `remove` | Method | `backend/src/order/orders.service.ts` | 68 |
| `findOne` | Method | `backend/dist_bak/order/order.service.js` | 29 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Update → FindOne` | intra_community | 3 |

## How to Explore

1. `context({name: "findOne"})` — see callers and callees
2. `query({query: "order"})` — find related execution flows
3. Read key files listed above for implementation details
