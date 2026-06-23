---
name: user-connection
description: "Skill for the User-connection area of new. 18 symbols across 3 files."
---

# User-connection

18 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how findAll, findAll, findByUser work
- Modifying user-connection-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/user-connection/user-connections.service.ts` | findAll, findByUser, findByNode, findActive, findDisconnected (+4) |
| `backend/src/user-connection/user-connections.controller.ts` | findAll, findByUser, findByNode, findActive, findDisconnected (+2) |
| `backend/dist_bak/user-connection/user-connections.service.js` | findOne, update |

## Entry Points

Start here when exploring this area:

- **`findAll`** (Method) — `backend/src/user-connection/user-connections.controller.ts:10`
- **`findAll`** (Method) — `backend/src/user-connection/user-connections.service.ts:18`
- **`findByUser`** (Method) — `backend/src/user-connection/user-connections.controller.ts:15`
- **`findByUser`** (Method) — `backend/src/user-connection/user-connections.service.ts:47`
- **`findByNode`** (Method) — `backend/src/user-connection/user-connections.controller.ts:20`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `findAll` | Method | `backend/src/user-connection/user-connections.controller.ts` | 10 |
| `findAll` | Method | `backend/src/user-connection/user-connections.service.ts` | 18 |
| `findByUser` | Method | `backend/src/user-connection/user-connections.controller.ts` | 15 |
| `findByUser` | Method | `backend/src/user-connection/user-connections.service.ts` | 47 |
| `findByNode` | Method | `backend/src/user-connection/user-connections.controller.ts` | 20 |
| `findByNode` | Method | `backend/src/user-connection/user-connections.service.ts` | 55 |
| `findActive` | Method | `backend/src/user-connection/user-connections.controller.ts` | 25 |
| `findActive` | Method | `backend/src/user-connection/user-connections.service.ts` | 63 |
| `findDisconnected` | Method | `backend/src/user-connection/user-connections.controller.ts` | 30 |
| `findDisconnected` | Method | `backend/src/user-connection/user-connections.service.ts` | 71 |
| `clearOldConnections` | Method | `backend/src/user-connection/user-connections.controller.ts` | 35 |
| `clearOldConnections` | Method | `backend/src/user-connection/user-connections.service.ts` | 79 |
| `remove` | Method | `backend/src/user-connection/user-connections.controller.ts` | 40 |
| `remove` | Method | `backend/src/user-connection/user-connections.service.ts` | 43 |
| `findOne` | Method | `backend/src/user-connection/user-connections.service.ts` | 27 |
| `update` | Method | `backend/src/user-connection/user-connections.service.ts` | 38 |
| `findOne` | Method | `backend/dist_bak/user-connection/user-connections.service.js` | 36 |
| `update` | Method | `backend/dist_bak/user-connection/user-connections.service.js` | 46 |

## How to Explore

1. `context({name: "findAll"})` — see callers and callees
2. `query({query: "user-connection"})` — find related execution flows
3. Read key files listed above for implementation details
