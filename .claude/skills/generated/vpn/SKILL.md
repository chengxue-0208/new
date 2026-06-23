---
name: vpn
description: "Skill for the Vpn area of new. 10 symbols across 3 files."
---

# Vpn

10 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how getStatus, getConfig, getStatus work
- Modifying vpn-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/vpn/vpn.controller.ts` | getStatus, getConfig, connect, disconnect |
| `backend/src/vpn/vpn.service.ts` | getStatus, getConfig, connect, disconnect |
| `backend/dist_bak/vpn/vpn.service.js` | getStatus, getConfig |

## Entry Points

Start here when exploring this area:

- **`getStatus`** (Method) — `backend/src/vpn/vpn.controller.ts:22`
- **`getConfig`** (Method) — `backend/src/vpn/vpn.controller.ts:28`
- **`getStatus`** (Method) — `backend/src/vpn/vpn.service.ts:82`
- **`getConfig`** (Method) — `backend/src/vpn/vpn.service.ts:105`
- **`connect`** (Method) — `backend/src/vpn/vpn.controller.ts:10`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getStatus` | Method | `backend/src/vpn/vpn.controller.ts` | 22 |
| `getConfig` | Method | `backend/src/vpn/vpn.controller.ts` | 28 |
| `getStatus` | Method | `backend/src/vpn/vpn.service.ts` | 82 |
| `getConfig` | Method | `backend/src/vpn/vpn.service.ts` | 105 |
| `connect` | Method | `backend/src/vpn/vpn.controller.ts` | 10 |
| `connect` | Method | `backend/src/vpn/vpn.service.ts` | 19 |
| `disconnect` | Method | `backend/src/vpn/vpn.controller.ts` | 16 |
| `disconnect` | Method | `backend/src/vpn/vpn.service.ts` | 58 |
| `getStatus` | Method | `backend/dist_bak/vpn/vpn.service.js` | 76 |
| `getConfig` | Method | `backend/dist_bak/vpn/vpn.service.js` | 94 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `GetConfig → GetStatus` | intra_community | 3 |

## How to Explore

1. `context({name: "getStatus"})` — see callers and callees
2. `query({query: "vpn"})` — find related execution flows
3. Read key files listed above for implementation details
