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
- `npm test`: **9/9 passing** across all 4 populated sections (`Physiology`, `Pathology`, `Pharmacology`, `Clinical Cases`), covering `E1–E9` + `EX.1–EX.12`, lineage, assets, schema v2, 3 canonical categories, option-length parity (0 length-flagged across all 155 items), Keanne Button, Learn/Exam timing, Clinical Cases Learn/Exam + Practice All Cases, and rotation/filtering.
- `scripts/audit_question_quality.py --data data --strict`: **0 hard errors | 0 review leads** across all 4 sections (fixed silent no-op bug when passing a single section folder, added fail-closed empty-target guard plus ASCII formula and inline page-tag checks).
- `npm run build` & `scripts/validate_bank.py --all --data dist/data --published`: all 5 section manifests valid, **337** published WebP images verified (fixed `[a-z0-9]+` regex parity in `validate_bank.py`), zero raw originals in `dist/`, zero files > 1 MiB, zero orphaned assets (`17` unreferenced files / `8.47 MB` pruned), and `dist 2`–`dist 12` iCloud duplicates cleaned (`build.mjs` now stages in `os.tmpdir()`).
- **Post-Audit Macro & Micro Improvements:**
  - **PWA & Caching:** Isolated service worker cache to `endo-quiz-offline-<version>` with prefix-scoped cleanup (no cross-app collision with sibling quizzes on `westman67.github.io`), added `icon.svg` + complete `manifest.webmanifest`, and generated lightweight `data/section-counts.json` (83 bytes) to eliminate redundant 4-bank nav fetches.
  - **UI & Responsive Fixes:** Eliminated `1280px` desktop header right-edge overflow (stacked 2-line brand lockup) and `"Diagrams/Graphs/Tables"` box text clipping; converted mobile `<= 850px` `.bank-switch` into a single horizontal-scroll bar; consolidated all `@media(max-width:850px)` blocks; aligned `.file-label` ("Import progress") height with buttons; added `.pill-btn` affordance on secondary controls, `a.button` empty-state styles, clean `.choice-text` strikeout (badge uncrossed), and footer disclaimer preservation (`#footer-title`).
  - **Clinical Cases & Quiz UX:** Added **Learn / Exam** mode toggle, **"Practice all cases"** button, and per-case completion badges on `caseHome()`; enabled `A–E` / `Shift+A–E` keyboard choice & strikeout on clinical cases and `O` shortcut for teaching original; upgraded Flag Image across all sections to native `<dialog>` with `aria-labelledby`, `autofocus`, `closedby="any"`, and modal `overscroll-behavior: contain`; applied `fetchpriority="high"` on active `#quiz-image`, `fetchpriority="low"` on hidden comparison images, next-image preloading, and global `withGlobalSeen()` resurface weighting.
  - **Content & Visual Polish:** Resolved all 12 initial audit leads (absolute wording in E7/E9 options, distractor rationale alignment), 15 inline page tags, 3 ASCII `V1`/`V2`/`V3` clues, and `"masked"` meta-language; upgraded `q-e1-3p-sella-turcica-compression` distractors; re-masked `q-e3-ip3-dag-convergence` (`Effector A` / `Kinase B`), `q-e3-camp-pka-pde` (`Enzyme X`), `q-e6-degarelix-vs-leuprolide` (removed stray `|`), and `q-e5-kallmann-syndrome` (clean red `X` + `Origin / signal ?` box); added cropped high-res 3rd-party PTC histology comparison to `q-ex6-papillary-thyroid-carcinoma`.
