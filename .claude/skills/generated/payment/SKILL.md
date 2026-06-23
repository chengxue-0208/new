---
name: payment
description: "Skill for the Payment area of new. 32 symbols across 4 files."
---

# Payment

32 symbols | 4 files | Cohesion: 93%

## When to Use

- Working with code in `backend/`
- Understanding how createPayment, handleWeChatCallback, getAlipayConfig work
- Modifying payment-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `backend/src/payment/payment.service.ts` | getAlipayConfig, getWeChatPayConfig, createAlipayPay, createWeChatPay, createPaymentRequest (+8) |
| `backend/dist_bak/payment/payment.service.js` | getWeChatPayConfig, createAlipayPay, createWeChatPay, createPaymentRequest, handleWeChatCallback (+8) |
| `backend/src/payment/payment.controller.ts` | createPayment, handleWeChatCallback, handleAlipayCallback, verifyPayment |
| `backend/dist_bak/payment/payment.controller.js` | handleAlipayCallback, verifyPayment |

## Entry Points

Start here when exploring this area:

- **`createPayment`** (Method) — `backend/src/payment/payment.controller.ts:9`
- **`handleWeChatCallback`** (Method) — `backend/src/payment/payment.controller.ts:40`
- **`getAlipayConfig`** (Method) — `backend/src/payment/payment.service.ts:46`
- **`getWeChatPayConfig`** (Method) — `backend/src/payment/payment.service.ts:55`
- **`createAlipayPay`** (Method) — `backend/src/payment/payment.service.ts:64`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createPayment` | Method | `backend/src/payment/payment.controller.ts` | 9 |
| `handleWeChatCallback` | Method | `backend/src/payment/payment.controller.ts` | 40 |
| `getAlipayConfig` | Method | `backend/src/payment/payment.service.ts` | 46 |
| `getWeChatPayConfig` | Method | `backend/src/payment/payment.service.ts` | 55 |
| `createAlipayPay` | Method | `backend/src/payment/payment.service.ts` | 64 |
| `createWeChatPay` | Method | `backend/src/payment/payment.service.ts` | 100 |
| `createPaymentRequest` | Method | `backend/src/payment/payment.service.ts` | 144 |
| `handleWeChatCallback` | Method | `backend/src/payment/payment.service.ts` | 250 |
| `generateNonceStr` | Method | `backend/src/payment/payment.service.ts` | 308 |
| `generateWeChatPaySign` | Method | `backend/src/payment/payment.service.ts` | 317 |
| `md5` | Method | `backend/src/payment/payment.service.ts` | 324 |
| `buildQueryString` | Method | `backend/src/payment/payment.service.ts` | 328 |
| `handleAlipayCallback` | Method | `backend/src/payment/payment.controller.ts` | 33 |
| `verifyPayment` | Method | `backend/src/payment/payment.controller.ts` | 47 |
| `handleAlipayCallback` | Method | `backend/src/payment/payment.service.ts` | 191 |
| `verifyAlipaySign` | Method | `backend/src/payment/payment.service.ts` | 336 |
| `verifySign` | Method | `backend/src/payment/payment.service.ts` | 347 |
| `getWeChatPayConfig` | Method | `backend/dist_bak/payment/payment.service.js` | 37 |
| `createAlipayPay` | Method | `backend/dist_bak/payment/payment.service.js` | 45 |
| `createWeChatPay` | Method | `backend/dist_bak/payment/payment.service.js` | 74 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `CreatePayment → Md5` | intra_community | 5 |
| `HandleAlipayCallback → VerifySign` | intra_community | 4 |
| `CreatePayment → GetAlipayConfig` | intra_community | 4 |
| `CreatePayment → BuildQueryString` | intra_community | 4 |
| `CreatePayment → GetWeChatPayConfig` | intra_community | 4 |
| `CreatePayment → GenerateNonceStr` | intra_community | 4 |
| `VerifyPayment → VerifySign` | intra_community | 4 |
| `CreatePaymentRequest → Md5` | intra_community | 4 |
| `HandleAlipayCallback → GetAlipayConfig` | cross_community | 3 |
| `HandleWeChatCallback → GetWeChatPayConfig` | intra_community | 3 |

## How to Explore

1. `context({name: "createPayment"})` — see callers and callees
2. `query({query: "payment"})` — find related execution flows
3. Read key files listed above for implementation details
