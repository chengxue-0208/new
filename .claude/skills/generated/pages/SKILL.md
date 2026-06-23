---
name: pages
description: "Skill for the Pages area of new. 26 symbols across 5 files."
---

# Pages

26 symbols | 5 files | Cohesion: 100%

## When to Use

- Working with code in `admin-react-app/`
- Understanding how handleEdit, handleDelete, render work
- Modifying pages-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `admin-react-app/src/pages/Nodes.tsx` | toNumber, handleEdit, handleDelete, render, getNodes (+5) |
| `admin-react-app/src/pages/Orders.tsx` | toNumber, formatCurrency, render, handleDelete |
| `admin-react-app/src/pages/SubscriptionPlans.tsx` | toNumber, handleEdit, handleDelete, render |
| `admin-react-app/src/pages/Users.tsx` | toNumber, handleEdit, handleDelete, render |
| `admin-react-app/src/pages/VPNConfig.tsx` | handleEdit, handleDelete, handlePreview, render |

## Entry Points

Start here when exploring this area:

- **`handleEdit`** (Function) — `admin-react-app/src/pages/Nodes.tsx:130`
- **`handleDelete`** (Function) — `admin-react-app/src/pages/Nodes.tsx:152`
- **`render`** (Function) — `admin-react-app/src/pages/Nodes.tsx:177`
- **`render`** (Function) — `admin-react-app/src/pages/Orders.tsx:93`
- **`handleDelete`** (Function) — `admin-react-app/src/pages/Orders.tsx:217`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `handleEdit` | Function | `admin-react-app/src/pages/Nodes.tsx` | 130 |
| `handleDelete` | Function | `admin-react-app/src/pages/Nodes.tsx` | 152 |
| `render` | Function | `admin-react-app/src/pages/Nodes.tsx` | 177 |
| `render` | Function | `admin-react-app/src/pages/Orders.tsx` | 93 |
| `handleDelete` | Function | `admin-react-app/src/pages/Orders.tsx` | 217 |
| `handleEdit` | Function | `admin-react-app/src/pages/SubscriptionPlans.tsx` | 78 |
| `handleDelete` | Function | `admin-react-app/src/pages/SubscriptionPlans.tsx` | 94 |
| `render` | Function | `admin-react-app/src/pages/SubscriptionPlans.tsx` | 115 |
| `handleEdit` | Function | `admin-react-app/src/pages/Users.tsx` | 66 |
| `handleDelete` | Function | `admin-react-app/src/pages/Users.tsx` | 75 |
| `render` | Function | `admin-react-app/src/pages/Users.tsx` | 103 |
| `handleEdit` | Function | `admin-react-app/src/pages/VPNConfig.tsx` | 81 |
| `handleDelete` | Function | `admin-react-app/src/pages/VPNConfig.tsx` | 98 |
| `handlePreview` | Function | `admin-react-app/src/pages/VPNConfig.tsx` | 102 |
| `render` | Function | `admin-react-app/src/pages/VPNConfig.tsx` | 130 |
| `Nodes` | Function | `admin-react-app/src/pages/Nodes.tsx` | 80 |
| `onSuccess` | Function | `admin-react-app/src/pages/Nodes.tsx` | 97 |
| `handleAdd` | Function | `admin-react-app/src/pages/Nodes.tsx` | 123 |
| `toNumber` | Function | `admin-react-app/src/pages/Nodes.tsx` | 53 |
| `toNumber` | Function | `admin-react-app/src/pages/Orders.tsx` | 35 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `Render → ToNumber` | intra_community | 3 |

## How to Explore

1. `context({name: "handleEdit"})` — see callers and callees
2. `query({query: "pages"})` — find related execution flows
3. Read key files listed above for implementation details
