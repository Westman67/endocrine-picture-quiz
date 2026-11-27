# Endocrine Picture Quiz — Preflight Audit

## Bank Summary (E1–E9 + EX.1–EX.12)

| Section | Lectures & EX RxBricks | Total Items | Core Lectures | EX RxBricks | 3rd Party |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Physiology** | E1–E4, E7, E8 + EX.1, EX.2, EX.3, EX.4, EX.7, EX.11 | 83 | 68 | 13 | 2 |
| **Pathology** | E5 + EX.5, EX.6, EX.8, EX.9, EX.12 | 40 | 23 | 14 | 3 |
| **Pharmacology** | E6 + EX.10 | 14 | 10 | 4 | 0 |
| **Clinical Cases** | E9 (9 two-question integrated cases) | 18 | 18 | 0 | 0 |
| **Combined** | E1–E9 + EX.1–EX.12 | 155 | 119 | 31 | 5 |

## Verification Gate Results
- `npm test`: **8/8 passing** across all 4 populated sections (`Physiology`, `Pathology`, `Pharmacology`, `Clinical Cases`), covering `E1–E9` + `EX.1–EX.12`, lineage, assets, schema v2, 3 canonical categories, option-length parity (0 length-flagged across all 155 items), Keanne Button, Learn/Exam timing, and rotation/filtering.
- `scripts/audit_question_quality.py --strict` (`physiology`, `pathology`, `pharmacology`, `clinical-cases`): **0 hard errors | 0 review leads** across all 4 sections.
- `npm run build` & `scripts/validate_bank.py --all --data dist/data --published`: all 5 section manifests valid, zero raw originals in `dist/`, zero files > 1 MiB.
- **Full Bank & UI Review Fixes:**
  - Fixed `coverageMarkup()` crash in `app.js` when `coverage.json` omits a `gaps` array, and included text-only lectures in Lecture Coverage.
  - Updated Clinical Cases home/quiz copy and eyebrow labels so text vignettes vs. visual diagrams display accurately (and skipped unnecessary `wireImage()` calls on text-only questions).
  - Updated single-section hero copy (`"Every visual question starts with the image."`) and stat label (`"Source groups"`).
  - Added quick `Core E1–E9 only` and `EX RxBricks only` buttons to Combined Practice and a live total count badge (`155`) on the Combined Practice top nav tab.
  - Normalized the single remaining ASCII `T4` → `T₄` in `q-ex6-raiu-scan-patterns`.
