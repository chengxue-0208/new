<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **new** (3317 symbols, 4880 relationships, 39 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/new/context` | Codebase overview, check index freshness |
| `gitnexus://repo/new/clusters` | All functional areas |
| `gitnexus://repo/new/processes` | All execution flows |
| `gitnexus://repo/new/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
| Work in the Payment area (32 symbols) | `.claude/skills/generated/payment/SKILL.md` |
| Work in the Node area (29 symbols) | `.claude/skills/generated/node/SKILL.md` |
| Work in the Pages area (26 symbols) | `.claude/skills/generated/pages/SKILL.md` |
| Work in the Order area (24 symbols) | `.claude/skills/generated/order/SKILL.md` |
| Work in the User-subscription area (21 symbols) | `.claude/skills/generated/user-subscription/SKILL.md` |
| Work in the System-log area (18 symbols) | `.claude/skills/generated/system-log/SKILL.md` |
| Work in the User area (18 symbols) | `.claude/skills/generated/user/SKILL.md` |
| Work in the User-connection area (18 symbols) | `.claude/skills/generated/user-connection/SKILL.md` |
| Work in the Vpn-config area (16 symbols) | `.claude/skills/generated/vpn-config/SKILL.md` |
| Work in the Subscription area (15 symbols) | `.claude/skills/generated/subscription/SKILL.md` |
| Work in the Subscription-plan area (12 symbols) | `.claude/skills/generated/subscription-plan/SKILL.md` |
| Work in the Config area (10 symbols) | `.claude/skills/generated/config/SKILL.md` |
| Work in the Vpn area (10 symbols) | `.claude/skills/generated/vpn/SKILL.md` |
| Work in the Contexts area (4 symbols) | `.claude/skills/generated/contexts/SKILL.md` |
| Work in the Auth area (4 symbols) | `.claude/skills/generated/auth/SKILL.md` |
| Work in the Cluster_104 area (3 symbols) | `.claude/skills/generated/cluster-104/SKILL.md` |

<!-- gitnexus:end -->
