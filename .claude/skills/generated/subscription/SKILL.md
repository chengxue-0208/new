---
name: subscription
description: "Skill for the Subscription area of new. 15 symbols across 2 files."
---

# Subscription

15 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `backend/`
- Understanding how getSubscribeText, getSubscribeText, formatNodeSubscribeLine work
- Modifying subscription-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/subscription/subscription.service.ts` | getSubscribeText, formatNodeSubscribeLine, getPlans, createPlan, updatePlan (+3) |
| `backend/src/subscription/subscription.controller.ts` | getSubscribeText, getPlans, createPlan, updatePlan, deletePlan (+2) |

## Entry Points

Start here when exploring this area:

- **`getSubscribeText`** (Method) — `backend/src/subscription/subscription.controller.ts:16`
- **`getSubscribeText`** (Method) — `backend/src/subscription/subscription.service.ts:26`
- **`formatNodeSubscribeLine`** (Method) — `backend/src/subscription/subscription.service.ts:38`
- **`getPlans`** (Method) — `backend/src/subscription/subscription.controller.ts:9`
- **`getPlans`** (Method) — `backend/src/subscription/subscription.service.ts:17`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getSubscribeText` | Method | `backend/src/subscription/subscription.controller.ts` | 16 |
| `getSubscribeText` | Method | `backend/src/subscription/subscription.service.ts` | 26 |
| `formatNodeSubscribeLine` | Method | `backend/src/subscription/subscription.service.ts` | 38 |
| `getPlans` | Method | `backend/src/subscription/subscription.controller.ts` | 9 |
| `getPlans` | Method | `backend/src/subscription/subscription.service.ts` | 17 |
| `createPlan` | Method | `backend/src/subscription/subscription.controller.ts` | 22 |
| `createPlan` | Method | `backend/src/subscription/subscription.service.ts` | 63 |
| `updatePlan` | Method | `backend/src/subscription/subscription.controller.ts` | 28 |
| `updatePlan` | Method | `backend/src/subscription/subscription.service.ts` | 68 |
| `deletePlan` | Method | `backend/src/subscription/subscription.controller.ts` | 34 |
| `deletePlan` | Method | `backend/src/subscription/subscription.service.ts` | 73 |
| `getMySubscription` | Method | `backend/src/subscription/subscription.controller.ts` | 40 |
| `getMySubscription` | Method | `backend/src/subscription/subscription.service.ts` | 77 |
| `purchase` | Method | `backend/src/subscription/subscription.controller.ts` | 46 |
| `purchase` | Method | `backend/src/subscription/subscription.service.ts` | 90 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `GetSubscribeText → FormatNodeSubscribeLine` | intra_community | 3 |

## How to Explore

1. `context({name: "getSubscribeText"})` — see callers and callees
2. `query({query: "subscription"})` — find related execution flows
3. Read key files listed above for implementation details
