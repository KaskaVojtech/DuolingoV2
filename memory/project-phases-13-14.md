---
name: project-phases-13-14
description: Fáze 13 (Mix editor) a fáze 14 (Procvičování) — implementovány, build prošel
metadata:
  type: project
---

Fáze 13a (Mix editor architektura) + 13b (herní pluginy) + 14 (Procvičování) dokončeny.

**Why:** Tyto fáze implementují hlavní herní editor a sekci procvičování.

**How to apply:** Obě funkce jsou dostupné na `/admin/lessons/[id]/mix` a `/admin/lessons/[id]/practice`. Používají mock data (stejný vzor jako předchozí fáze).

**Klíčové soubory:**
- `lib/mix-editor/` — typy, store (Zustand), API, utils, game-registry
- `components/admin/mix-editor/games/{connector,fill-in,multiple-choice,listening,word-order,translation,word-transform}/` — 7 herních pluginů
- `components/admin/mix-editor/` — MixEditor, TopBar, SequenceBar, sidebary
- `lib/practice/` — typy, utils (computePracticeAvailability), API
- `components/admin/practice/` — PracticePageHeader, PracticeCategory, PracticeTypeCard, atd.
- `backend/src/practice/` — NestJS modul, entity, service, controller
- `backend/migrations/phase14_practice.sql` — SQL migrace pro tabulky procvičování

**Opraveny pre-existing bugy:**
- `theme('fontSize.*')` v SCSS → nahrazeno `var(--font-size-*)` ve všech SCSS souborech (Tailwind v4 kompatibilita)
- `useSearchParams()` bez Suspense v access/delete, access/edit-status, lessons/templates → obaleno `<Suspense>`
