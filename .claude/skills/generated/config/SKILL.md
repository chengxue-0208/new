---
name: config
description: "Skill for the Config area of new. 10 symbols across 7 files."
---

# Config

10 symbols | 7 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how useFactory, getAppPort, isDevelopment work
- Modifying config-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/config/app.config.ts` | getAppPort, isDevelopment, getBooleanConfig |
| `backend/src/seed.ts` | runSeed, checkIfDataExists |
| `backend/src/app.module.ts` | useFactory |
| `backend/src/config/database.config.ts` | createDatabaseOptions |
| `backend/src/database/startup-seed.ts` | runStartupSeed |
| `backend/src/main.ts` | bootstrap |
| `backend/src/seed-runner.ts` | runSeedScript |

## Entry Points

Start here when exploring this area:

- **`useFactory`** (Function) — `backend/src/app.module.ts:27`
- **`getAppPort`** (Function) — `backend/src/config/app.config.ts:4`
- **`isDevelopment`** (Function) — `backend/src/config/app.config.ts:11`
- **`getBooleanConfig`** (Function) — `backend/src/config/app.config.ts:15`
- **`createDatabaseOptions`** (Function) — `backend/src/config/database.config.ts:4`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useFactory` | Function | `backend/src/app.module.ts` | 27 |
| `getAppPort` | Function | `backend/src/config/app.config.ts` | 4 |
| `isDevelopment` | Function | `backend/src/config/app.config.ts` | 11 |
| `getBooleanConfig` | Function | `backend/src/config/app.config.ts` | 15 |
| `createDatabaseOptions` | Function | `backend/src/config/database.config.ts` | 4 |
| `runStartupSeed` | Function | `backend/src/database/startup-seed.ts` | 6 |
| `runSeed` | Function | `backend/src/seed.ts` | 11 |
| `bootstrap` | Function | `backend/src/main.ts` | 7 |
| `runSeedScript` | Function | `backend/src/seed-runner.ts` | 6 |
| `checkIfDataExists` | Function | `backend/src/seed.ts` | 462 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Bootstrap → CheckIfDataExists` | intra_community | 4 |
| `UseFactory → GetBooleanConfig` | intra_community | 3 |
| `UseFactory → IsDevelopment` | intra_community | 3 |
| `Bootstrap → IsDevelopment` | intra_community | 3 |
| `RunSeedScript → GetBooleanConfig` | intra_community | 3 |
| `RunSeedScript → IsDevelopment` | intra_community | 3 |
| `RunSeedScript → CheckIfDataExists` | intra_community | 3 |

## How to Explore

1. `context({name: "useFactory"})` — see callers and callees
2. `query({query: "config"})` — find related execution flows
3. Read key files listed above for implementation details
