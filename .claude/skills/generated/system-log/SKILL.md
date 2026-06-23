---
name: system-log
description: "Skill for the System-log area of new. 18 symbols across 3 files."
---

# System-log

18 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how findAll, findAll, findAll work
- Modifying system-log-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/system-log/system-logs.service.ts` | findAll, normalizeQueryValue, normalizeDateValue, normalizePositiveInteger, findByUser (+5) |
| `backend/src/system-log/system-logs.controller.ts` | findAll, findByUser, findByLevel, findBySource, search (+2) |
| `backend/src/system-log/logs.controller.ts` | findAll |

## Entry Points

Start here when exploring this area:

- **`findAll`** (Method) — `backend/src/system-log/logs.controller.ts:10`
- **`findAll`** (Method) — `backend/src/system-log/system-logs.controller.ts:9`
- **`findAll`** (Method) — `backend/src/system-log/system-logs.service.ts:19`
- **`normalizeQueryValue`** (Method) — `backend/src/system-log/system-logs.service.ts:79`
- **`normalizeDateValue`** (Method) — `backend/src/system-log/system-logs.service.ts:93`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `findAll` | Method | `backend/src/system-log/logs.controller.ts` | 10 |
| `findAll` | Method | `backend/src/system-log/system-logs.controller.ts` | 9 |
| `findAll` | Method | `backend/src/system-log/system-logs.service.ts` | 19 |
| `normalizeQueryValue` | Method | `backend/src/system-log/system-logs.service.ts` | 79 |
| `normalizeDateValue` | Method | `backend/src/system-log/system-logs.service.ts` | 93 |
| `normalizePositiveInteger` | Method | `backend/src/system-log/system-logs.service.ts` | 103 |
| `findByUser` | Method | `backend/src/system-log/system-logs.controller.ts` | 14 |
| `findByUser` | Method | `backend/src/system-log/system-logs.service.ts` | 119 |
| `findByLevel` | Method | `backend/src/system-log/system-logs.controller.ts` | 19 |
| `findByLevel` | Method | `backend/src/system-log/system-logs.service.ts` | 126 |
| `findBySource` | Method | `backend/src/system-log/system-logs.controller.ts` | 24 |
| `findBySource` | Method | `backend/src/system-log/system-logs.service.ts` | 133 |
| `search` | Method | `backend/src/system-log/system-logs.controller.ts` | 29 |
| `search` | Method | `backend/src/system-log/system-logs.service.ts` | 140 |
| `getStats` | Method | `backend/src/system-log/system-logs.controller.ts` | 34 |
| `getStats` | Method | `backend/src/system-log/system-logs.service.ts` | 147 |
| `clearOldLogs` | Method | `backend/src/system-log/system-logs.controller.ts` | 39 |
| `clearOldLogs` | Method | `backend/src/system-log/system-logs.service.ts` | 162 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `FindAll → NormalizeQueryValue` | intra_community | 4 |
| `FindAll → NormalizeQueryValue` | intra_community | 4 |

## How to Explore

1. `context({name: "findAll"})` — see callers and callees
2. `query({query: "system-log"})` — find related execution flows
3. Read key files listed above for implementation details
