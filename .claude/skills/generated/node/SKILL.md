---
name: node
description: "Skill for the Node area of new. 29 symbols across 6 files."
---

# Node

29 symbols | 6 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how checkAll, checkOne, updateAll work
- Modifying node-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/node/node.controller.ts` | findAll, checkHealth, findOne, update, findByRegion (+2) |
| `backend/src/node/node.service.ts` | findAll, checkHealth, findOne, update, findByRegion (+2) |
| `backend/src/node/delay.controller.ts` | checkAll, checkOne, updateAll, getStats |
| `backend/src/node/delay.service.ts` | checkNodeDelay, checkAllNodesDelay, updateNodeDelay, getDelayStats |
| `backend/dist_bak/node/node.service.js` | findAll, checkHealth, findOne, update |
| `backend/dist_bak/node/delay.service.js` | checkNodeDelay, checkAllNodesDelay, updateNodeDelay |

## Entry Points

Start here when exploring this area:

- **`checkAll`** (Method) — `backend/src/node/delay.controller.ts:12`
- **`checkOne`** (Method) — `backend/src/node/delay.controller.ts:32`
- **`updateAll`** (Method) — `backend/src/node/delay.controller.ts:50`
- **`getStats`** (Method) — `backend/src/node/delay.controller.ts:69`
- **`checkNodeDelay`** (Method) — `backend/src/node/delay.service.ts:14`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `checkAll` | Method | `backend/src/node/delay.controller.ts` | 12 |
| `checkOne` | Method | `backend/src/node/delay.controller.ts` | 32 |
| `updateAll` | Method | `backend/src/node/delay.controller.ts` | 50 |
| `getStats` | Method | `backend/src/node/delay.controller.ts` | 69 |
| `checkNodeDelay` | Method | `backend/src/node/delay.service.ts` | 14 |
| `checkAllNodesDelay` | Method | `backend/src/node/delay.service.ts` | 49 |
| `updateNodeDelay` | Method | `backend/src/node/delay.service.ts` | 62 |
| `getDelayStats` | Method | `backend/src/node/delay.service.ts` | 66 |
| `findAll` | Method | `backend/src/node/node.controller.ts` | 12 |
| `checkHealth` | Method | `backend/src/node/node.controller.ts` | 23 |
| `findAll` | Method | `backend/src/node/node.service.ts` | 19 |
| `checkHealth` | Method | `backend/src/node/node.service.ts` | 57 |
| `findOne` | Method | `backend/src/node/node.controller.ts` | 28 |
| `update` | Method | `backend/src/node/node.controller.ts` | 38 |
| `findOne` | Method | `backend/src/node/node.service.ts` | 29 |
| `update` | Method | `backend/src/node/node.service.ts` | 40 |
| `findByRegion` | Method | `backend/src/node/node.controller.ts` | 18 |
| `findByRegion` | Method | `backend/src/node/node.service.ts` | 49 |
| `create` | Method | `backend/src/node/node.controller.ts` | 33 |
| `create` | Method | `backend/src/node/node.service.ts` | 14 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `CheckAll → CheckNodeDelay` | intra_community | 3 |
| `UpdateAll → CheckNodeDelay` | intra_community | 3 |
| `CheckHealth → FindAll` | intra_community | 3 |
| `Update → FindOne` | intra_community | 3 |

## How to Explore

1. `context({name: "checkAll"})` — see callers and callees
2. `query({query: "node"})` — find related execution flows
3. Read key files listed above for implementation details
