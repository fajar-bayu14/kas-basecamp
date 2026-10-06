# Graph Report - kas-basecamp  (2026-10-06)

## Corpus Check
- Corpus is ~13,756 words - fits in a single context window. You may not need a graph.

## Summary
- 269 nodes · 520 edges · 29 communities (21 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.89)
- Token cost: 118 input · 245 output

## Community Hubs (Navigation)
- Build & Package Config
- Member Logic & Testing
- Auth & App Layout
- TypeScript Configuration
- Dashboard & Login UI
- Member Table UI
- KPI Charts & Cards
- Runtime Dependencies
- Dev Dependencies
- Transaction Table UI
- Quick Input Forms
- Reporting & CSV Export
- Shared UI Primitives
- Docker Infrastructure
- Window Icon Asset
- File Icon Asset
- Vercel Brand Asset
- Agent Rules & Docs
- User Personas & Scope
- Globe Icon Asset
- Product Vision
- Next.js Brand Asset
- ESLint Config
- PostCSS Config
- Sitemap & User Flow
- Financial Recap Filters
- Member Viewer Persona
- Member Data Page

## God Nodes (most connected - your core abstractions)
1. `cn()` - 29 edges
2. `getIsAdmin()` - 18 edges
3. `react` - 16 edges
4. `compilerOptions` - 16 edges
5. `lucide-react` - 11 edges
6. `runTests()` - 11 edges
7. `Button` - 9 edges
8. `formatCurrency()` - 9 edges
9. `sonner` - 7 edges
10. `createMember()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `runTests()` --calls--> `verifyCredentials()`  [EXTRACTED]
  scripts/test-runner.ts → src/lib/auth.ts
- `KasMinggu Product` --conceptually_related_to--> `KasMinggu Overview`  [INFERRED]
  PRD.md → README.md
- `Form Input Kas FR-KAS-01` --conceptually_related_to--> `Quick Input Kas with FAB and Modal`  [INFERRED]
  PRD.md → README.md
- `Rekapan & Filter Periode FR-KAS-02` --conceptually_related_to--> `Rekapan Data & Filter Fleksibel`  [INFERRED]
  PRD.md → README.md
- `Grafik Pemasukan Mingguan FR-RPT-01` --conceptually_related_to--> `Grafik Batang Recharts Visualization`  [INFERRED]
  PRD.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **KasMinggu Core Cash Flow** — prd_form_input_kas, prd_rekapan_filter, prd_grafik_pemasukan, prd_csv_export_rfc4180, prd_user_flow_pencatatan [INFERRED 0.85]
- **Containerized Infrastructure Stack** — readme_tech_stack, docker_compose_app_service, docker_compose_db_service, docker_compose_mysql_volume, docker_compose_healthcheck [EXTRACTED 1.00]
- **Persona Goals Alignment** — prd_bendahara_persona, prd_anggota_persona, prd_goals_kpi, prd_problem_statement, prd_kasminggu_product [INFERRED 0.75]
- **File Icon Visual Composition** — public_file_svg_icon, public_file_document_sheet_geometry, public_file_folded_corner_detail, public_file_placeholder_text_lines [INFERRED 0.95]
- **Minimal Grey Globe System Icon Composition** — public_globe_svg_file, public_globe_icon_visual, public_globe_icon_style [INFERRED 0.85]
- **Next.js Branding Asset** — public_next_svg_asset, public_next_wordmark_logo, public_next_vector_graphic [INFERRED 0.85]
- **Vercel Triangle Logo Composition** — public_vercel_svg_file, public_vercel_triangle_logo_visual, public_vercel_triangle_geometry, public_vercel_white_fill_style [INFERRED 0.95]
- **Minimal Grey Browser Window System Icon Composition** — public_window_svg_file, public_window_icon_visual, public_window_icon_style [INFERRED 0.85]

## Communities (29 total, 7 thin omitted)

### Community 0 - "Build & Package Config"
Cohesion: 0.05
Nodes (36): nextConfig, name, optionalDependencies, lightningcss-linux-x64-gnu, lightningcss-linux-x64-musl, @tailwindcss/oxide-linux-x64-gnu, @tailwindcss/oxide-linux-x64-musl, prisma (+28 more)

### Community 1 - "Member Logic & Testing"
Cohesion: 0.14
Nodes (28): RFC-4180, zod, runTests(), createMember(), deleteMember(), getMembers(), memberSchema, safeRevalidatePath() (+20 more)

### Community 2 - "Auth & App Layout"
Cohesion: 0.20
Nodes (17): getAdminStatusAction(), loginAdminAction(), logoutAdminAction(), safeRevalidatePath(), inter, metadata, RootLayout(), Navbar() (+9 more)

### Community 3 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "Dashboard & Login UI"
Cohesion: 0.20
Nodes (12): sonner, LoginModal(), LoginModalProps, DashboardClient(), DashboardClientProps, MONTH_NAMES, KpiCards(), WeeklyCashChart() (+4 more)

### Community 5 - "Member Table UI"
Cohesion: 0.31
Nodes (12): MemberManagementClientProps, MemberWithCount, Modal(), Table, TableBody, TableCaption, TableCell, TableFooter (+4 more)

### Community 6 - "KPI Charts & Cards"
Cohesion: 0.26
Nodes (10): recharts, KpiCardsProps, WeeklyCashChartProps, WeeklyDataItem, Card, CardContent, CardDescription, CardFooter (+2 more)

### Community 7 - "Runtime Dependencies"
Cohesion: 0.17
Nodes (12): dependencies, class-variance-authority, clsx, lucide-react, next, @prisma/client, react, react-dom (+4 more)

### Community 8 - "Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+3 more)

### Community 9 - "Transaction Table UI"
Cohesion: 0.24
Nodes (9): class-variance-authority, MONTH_NAMES, TransactionItem, TransactionTable(), TransactionTableProps, Badge(), BadgeProps, badgeVariants (+1 more)

### Community 10 - "Quick Input Forms"
Cohesion: 0.29
Nodes (7): MemberOption, MONTH_NAMES, QuickInputModal(), QuickInputModalProps, Input, InputProps, formatCurrency()

### Community 11 - "Reporting & CSV Export"
Cohesion: 0.38
Nodes (7): CSV Export RFC 4180 FR-RPT-02, CSV Column Schema, Goals & Success Metrics G-01 to G-04, Grafik Pemasukan Mingguan FR-RPT-01, Ekspor CSV RFC 4180 UTF-8 BOM, Grafik Batang Recharts Visualization, Automated Test Suite 13 PASSED

### Community 12 - "Shared UI Primitives"
Cohesion: 0.33
Nodes (5): lucide-react, react, ModalProps, Select, SelectProps

### Community 13 - "Docker Infrastructure"
Cohesion: 0.40
Nodes (6): App Service catatan-kas-app, DB Service MySQL 8.0 catatan-kas-db, MySQL Healthcheck mysqladmin ping, MySQL Volume mysql_data, Docker Compose Setup, Tech Stack

### Community 14 - "Window Icon Asset"
Cohesion: 0.33
Nodes (6): Browser Window UI Concept, 16x16 Monochrome System Icon Style, Browser Window Icon Visual, window.svg SVG Asset, Window Controls Detail, Browser Window Frame Geometry

### Community 15 - "File Icon Asset"
Cohesion: 0.50
Nodes (5): Document Sheet Geometry, Folded Corner Detail, Gray Monochrome Style (#666), Placeholder Text Lines, File SVG Icon

### Community 16 - "Vercel Brand Asset"
Cohesion: 0.50
Nodes (5): Vercel Brand Identity Concept, vercel.svg SVG Asset, Equilateral Triangle Path Geometry, Vercel Triangle Logo Visual, White Fill Monochrome Style (#fff)

### Community 17 - "Agent Rules & Docs"
Cohesion: 0.50
Nodes (4): Generate Agent Files Script, Next.js Agent Rules Block, Next.js Docs Guide at node_modules/next/dist/docs/, Claude Delegation to AGENTS.md

### Community 18 - "User Personas & Scope"
Cohesion: 0.50
Nodes (4): Bendahara Persona (Primary User), Form Input Kas FR-KAS-01, Scope of Release v1.0, Quick Input Kas with FAB and Modal

### Community 19 - "Globe Icon Asset"
Cohesion: 0.50
Nodes (4): Global Internationalization Concept, 16x16 Monochrome System Icon Style, Globe Wireframe Icon Visual, globe.svg SVG Asset

### Community 20 - "Product Vision"
Cohesion: 0.67
Nodes (3): KasMinggu Product, Problem Statement: Manual Cash Recording, KasMinggu Overview

## Knowledge Gaps
- **128 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 135 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Shared UI Primitives` to `Build & Package Config`, `Dashboard & Login UI`, `Member Table UI`, `KPI Charts & Cards`, `Transaction Table UI`, `Quick Input Forms`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Build & Package Config`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Build & Package Config`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Build & Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Member Logic & Testing` be split into smaller, more focused modules?**
  _Cohesion score 0.13963963963963963 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._