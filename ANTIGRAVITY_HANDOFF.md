# Endocrine Picture Quiz — Comprehensive Antigravity Handoff

**Last updated:** 2026-11-27  
**Repository root:** `/Users/chriselwell/Desktop/Picture Quiz/Endocrine/Endo Quiz App`  
**Git remote:** `https://github.com/Westman67/endocrine-picture-quiz.git` (`main`, synced with `origin/main`)  
**HEAD commit:** `2f2cbca` (*Add E9 (9 Clinical Cases) and complete full bank & UI review fixes*)  
**Live GitHub Pages URL:** `https://westman67.github.io/endocrine-picture-quiz/`

---

## 1. Executive Summary & Current State

The **Endocrine Picture Quiz** is a local-first, zero-dependency vanilla JS/HTML/CSS browser application with a GitHub Pages production build (`dist/`). It uses a **single shared application engine** (`app.js`, `engine.js`, `bank-config.js`) serving **four isolated study sections** plus **Combined Practice**, each with isolated `localStorage` progress and preference keys.

All lectures through **E9** plus all **12 Scholar Rx Bricks (`EX.1–EX.12`)** are authored, visually verified, quality-audited (`0 hard errors | 0 review leads` across all four sections), tested (`8/8` passing), built (`336` published images in `dist/`), and pushed to `main`.

| Section | URL Param | Data Directory | Lectures & EX RxBricks | Total | Core | EX | 3rd Party | Visual / Table / Text |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Physiology** | `?bank=physiology` (default) | `data/physiology/` *(mirrored in root `data/`)* | E1–E4, E7, E8 + EX.1–5, EX.7, EX.11 | **119** | 68 | 49 | 2 | 70 img / 2 table / 47 text |
| **Pathology** | `?bank=pathology` | `data/pathology/` | E5 + EX.4–6, EX.8–9, EX.12 | **44** | 23 | 18 | 3 | 30 img / 0 table / 14 text |
| **Pharmacology** | `?bank=pharmacology` | `data/pharmacology/` | E6 + EX.4, EX.5, EX.10 | **17** | 10 | 7 | 0 | 4 img / 0 table / 13 text |
| **Clinical Cases** | `?bank=clinical-cases` | `data/clinical-cases/` | E9 (9 two-question linked cases) | **18** | 18 | 0 | 0 | 2 img / 0 table / 16 text |
| **Combined** | `?bank=combined` | Loads all 4 sections | **E1–E9 + EX.1–EX.12** | **198** | 119 | 74 | 5 | 106 img / 2 table / 90 text |

- **Retired questions:** `1` in `data/physiology/` (duplicate E1 item retired cleanly; preserved in `retired_questions` so existing learner `localStorage` imports never break).
- **Content categories (strictly 3 canonical buckets across all sections):**
  - `Physiology`: `Imaging` (15), `Diagrams/Graphs/Tables` (56), `Questions` (12)
  - `Pathology`: `Imaging` (19), `Diagrams/Graphs/Tables` (11), `Questions` (10)
  - `Pharmacology`: `Imaging` (1), `Diagrams/Graphs/Tables` (3), `Questions` (10)
  - `Clinical Cases`: `Diagrams/Graphs/Tables` (2), `Questions` (16)

---

## 2. Local Directory Map & Read-Only Rules

Treat all upstream study/image directories as **strictly read-only**. Only write inside `/Users/chriselwell/Desktop/Picture Quiz/Endocrine/Endo Quiz App` (or `/tmp` for scratch rendering).

| Purpose | Absolute macOS Path | Access Policy |
| :--- | :--- | :--- |
| **Quiz App Repo (Writable)** | `/Users/chriselwell/Desktop/Picture Quiz/Endocrine/Endo Quiz App` | Read/Write |
| **Extracted Lecture Images & 3rd-Party Visuals** | `/Users/chriselwell/Desktop/Picture Quiz/Endocrine` (`E1`–`E9`, `BB Endocrinology 1P 2026`, `Bootcamp Endocrinology`, `First Aid 2023 Endocrinology`) | **Read-only** |
| **Obsidian Endocrine Vault (Reconciled Detailed Notes)** | `/Users/chriselwell/Desktop/Systems Vault/Systems Vault/Endo/Lecture` (`E0`–`E9 ... - Detailed Notes.md`, `Lecture Index.md`) | **Read-only** |
| **Endo Lectures (RLS PDFs & Transcripts)** | `/Users/chriselwell/Desktop/Endo/Lectures` | **Read-only** |
| **Desktop Download (Newly downloaded RLS/Tran PDFs)** | `/Users/chriselwell/Desktop/Desktop Download` | **Read-only** |

**Why check the Obsidian Detailed Notes first:** Each `E<N> ... - Detailed Notes.md` file reconciles the lecture RLS PDF, transcript (`Tran`), and slide annotations, and contains explicit **`Emphasized Exam Content`**, **`Not Required`**, and **`Source Conflicts`** sections. Always read the full Detailed Notes file before writing a single question for a new lecture.

---

## 3. Application Architecture & File Map

```text
Endo Quiz App/
├── index.html                  # Single-page shell (top nav, view nav, main #app, toast, footer)
├── styles.css                  # Light-theme responsive UI styles, mobile breakpoints, image controls
├── app.js                      # UI views: home(), combinedHome(), caseHome(), quiz(), results(), progress(), review()
├── engine.js                   # Pure quiz logic: filtering, source-group rotation, resurface weighting, scoring, Keanne Button, import/export validation
├── bank-config.js              # Section definitions (Physiology, Pathology, Pharmacology, Clinical Cases, Combined) & isolated storage keys
├── progress-migration.js       # Legacy single-bank & supplementary localStorage progress migration
├── sw.js / manifest.webmanifest# PWA offline caching
├── Start Quiz.command          # Double-click macOS launcher (serves locally via scripts/serve.py)
├── package.json                # npm scripts (test, validate, prebuild, build, start, audit, test:ui)
├── assets/
│   ├── originals/              # Lossless source teaching PNGs (<sha16>.png) — NEVER degraded, NEVER copied raw to dist/
│   ├── display/                # Quiz-safe masked/cropped WebPs (<slug>-<sha16>.webp, max 1400px, q=88, ≤ 1 MiB)
│   └── zoom/                   # High-res quiz-safe WebPs (<slug>-<sha16>.webp, max 2000px, q=90, ≤ 1 MiB)
├── data/
│   ├── question-bank.json      # Legacy root mirror of data/physiology/question-bank.json (MUST stay in sync!)
│   ├── source-manifest.json    # Legacy root mirror of data/physiology/source-manifest.json (MUST stay in sync!)
│   ├── coverage.json           # Legacy root mirror of data/physiology/coverage.json (MUST stay in sync!)
│   ├── physiology/             # E1–E4, E7, E8 + EX.1–4, EX.7, EX.11 (83 Qs)
│   ├── pathology/              # E5 + EX.5–6, EX.8–9, EX.12 (40 Qs)
│   ├── pharmacology/           # E6 + EX.10 (14 Qs)
│   └── clinical-cases/         # E9 (9 cases, 18 Qs)
├── scripts/
│   ├── build.mjs               # Builds dist/ with content-hashed cache-busting, verifies asset paths ([a-z0-9]+)
│   ├── validate_bank.py        # Fail-closed schema, lineage, manifest, asset, and published dist/ validator
│   ├── audit_question_quality.py # Strict question/option/rationale/citation quality auditor (--strict)
│   ├── serve.py                # Local HTTP server with explicit .webp MIME type registration
│   └── smoke.mjs               # UI smoke test runner
├── tests/
│   └── endo-quiz.test.mjs      # 8 Node unit tests (bank integrity, E1–E9 + EX.1–12 coverage, option-length parity, Keanne Button, Learn/Exam timing, rotation, 3-bucket categories)
├── reports/
│   └── preflight-audit.md      # Human-readable audit ledger updated after each lecture batch
└── dist/                       # Production build output (generated by `npm run build`)
```

**Critical Mirror Invariant:** Whenever you modify `data/physiology/{question-bank,source-manifest,coverage}.json`, you must mirror the exact same changes to the legacy root `data/{question-bank,source-manifest,coverage}.json` files. `validate_bank.py --all` validates both.

---

## 4. Non-Negotiable Content, Schema & Quality Invariants

### 4.1 Medical Grounding & Scope

- Never fabricate clinical, pathologic, radiographic, or pharmacologic facts not explicitly stated in the lecture RLS/transcript/Obsidian Detailed Notes or directly visible in the image.
- Strictly honor `Not Required` exclusions in each lecture's Obsidian note (for example: E6 omits ACTH gelatin vial cost, recombinant vs. urinary gonadotropin origin, and granular IVF day-by-day protocols; E9 omits the endocrine disease grid, hyperphosphatemic rickets/raised FGF23, random GH/low GH during hypoglycemia, Carney complex, T₃ for depression/cardiac surgery, and MC4R/setmelanotide).
- 3rd-party visuals (`source_origin: "third_party"`): Only include 3rd-party images (Bootcamp, B&B, First Aid) that strictly match in-scope lecture topics, and always label them `source_origin: "third_party"`.

### 4.2 Schema v2 & Categories

- **Canonical `category` (3 buckets ONLY — never add new categories):**
  - `"Imaging"` — all histology, pathology, IHC, radiology, ultrasound, gross/clinical photos
  - `"Diagrams/Graphs/Tables"` — all schematic diagrams, pathways, graphs, curves, and tables
  - `"Questions"` — text-only conceptual, calculation, and clinical vignette questions (`visual_kind: "text"`)
- **Valid `format_type` enum:** `"vignette"`, `"except"`, `"two_statement"`, `"incorrect_statement"`, `"matching"`, `"comparison"` (do NOT invent values like `"interpretation"` — `tests/endo-quiz.test.mjs` enforces this enum).
- **Valid `reasoning_order`:** integer `1`, `2`, or `3` (target mostly `2` and `3`).
- **Valid `study_skill`:** `"morphology"`, `"interpretation"`, `"stain"`, `"mechanism"`, `"management"`.
- **Valid `visual_kind`:** `"image"`, `"table"`, `"text"`.
- **Exact citations:** Every question must have `citations: [{ "document": "<Exact RLS PDF filename>", "page": <int> }]`.
- **Non-redundant 4-part answer keys:**
  - `explanation`: Structured `Step 1. ... Step 2. ...` mechanistic teaching explanation.
  - `choice_rationales`: Array of 4 index-aligned, non-empty (`>20` chars) strings; `choice_rationales[correct_index]` must not duplicate `explanation`, and every distractor rationale must name a specific absent or conflicting feature.
  - `visual_clues`: Required for all `visual_kind: "image"` items; concise, capitalized, non-duplicate with `explanation`.
  - `condition_name` & `condition_overview`: Included on all items for high-yield reinforcement.

### 4.3 Clinical Cases Contract (`data/clinical-cases/`)

- Every entry in `cases[]` (`{ case_id, lecture, title, question_ids }`) must contain at least 2 `question_ids` (`validate_bank.py` enforces `>= 2`).
- Every question belonging to a case must include `case_id`, `scenario`, `lead_in`, and `stem` (set `stem = lead_in`).
- Keep questions for the same `case_id` contiguous in `question-bank.json` in the exact order listed in `cases[].question_ids`.

### 4.4 Option-Length Parity & Typography

Enforced in `tests/endo-quiz.test.mjs` and `scripts/audit_question_quality.py --strict`:

- **Correct-is-longest:** `≤ 45%` per section (target `≤ 30%`; currently Physiology 23.5%, Pathology 22.5%, Pharmacology 21.4%, Clinical Cases 38.9%).
- **Length-flagged** (`correct >= 1.2 × max_other` AND `correct - max_other >= 10` chars): `≤ 3%` per section (currently `0` across all 155 questions).
- **Answer-position balance:** Distribute `correct_index` evenly across `0, 1, 2, 3`.
- **Zero absolute giveaway words** in options (`always`, `never`, `exclusively`, `all of the above`, `none of the above`).
- **Scientific Unicode:** Use `Ca²⁺`, `PO₄³⁻`, `T₃`, `T₄`, `V₁`, `V₂`, `V₃`, `D₂`, `H⁺`, `Na⁺`, `K⁺`, `≥`, `≤`, `×`, `→`, `μg/dL` (avoid plain ASCII `Ca2+`, `T4`, `PO4`).

---

## 5. Image Processing & Quiz-Safe Masking Pipeline

### Local Toolchain Note (macOS Apple Silicon)

- Homebrew binaries live in `/opt/homebrew/bin` (`export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"`): `node`, `npm`, `cwebp`, `webpinfo`, `python3` (3.12).
- `pymupdf` (`import pymupdf`) is installed; `PIL/Pillow` is NOT installed in `/opt/homebrew/bin/python3`. Use `pymupdf` (blank page of exact pixel size → `insert_image` → `draw_rect` + `insert_text` → `get_pixmap` → `cwebp`) for crisp, zero-dependency masking and cropping.

### Two-Tier Asset Rules

1. **Teaching original:** Copy untouched source PNG to `assets/originals/<sha16>.png` (where `<sha16>` is the first 16 hex chars of the file's SHA-256).
2. **Quiz-safe display & zoom WebPs:**
   - Mask only answer-revealing labels using clean opaque boxes (`#eff6ff` fill, `#1e40af` border, bold label like `Signal X`, `Cell A`, `Curve B`). Never obscure axes, units, legends, arrows, anatomy, or diagnostic pixels.
   - Never upscale low-resolution originals (if source `< 1400 px`, render at `1.0x`).
   - Save display tier (max 1400px, `cwebp -q 88`) to `assets/display/<slug>-<sha16>.webp` and zoom tier (max 2000px, `cwebp -q 90`) to `assets/zoom/<slug>-<sha16>.webp`.
   - Every WebP must be `< 1 MiB` and match regex `^assets/(display|originals|zoom)/[a-z0-9]+(?:-[a-z0-9-]+)?\.(png|webp)$`.
3. **Mandatory visual verification:** Open and visually inspect every masked display WebP at full clarity before shipping to confirm zero answer leakage, zero stray characters/parentheses peeking past mask edges, and intact pointer lines.

---

## 6. Playbook: Adding Future Lectures (E10+)

1. **Source Audit:**
   - Check `/Users/chriselwell/Desktop/Systems Vault/Systems Vault/Endo/Lecture/E<N> ... - Detailed Notes.md` (read in full: note topic, section routing, `Emphasized Exam Content`, `Not Required`, and `Source Conflicts`).
   - Check `/Users/chriselwell/Desktop/Picture Quiz/Endocrine/E<N>/` (`_extraction_index.csv` + extracted PNGs) and `/Users/chriselwell/Desktop/Endo/Lectures/` or `Desktop Download` for the RLS PDF page numbers and `pdf_sha256`.
   - Route to the matching section: `physiology`, `pathology`, `pharmacology`, or `clinical-cases`.
2. **Visual Asset Generation:**
   - Visually inspect candidate source PNGs, design leak-free masks, generate lossless PNG + display/zoom WebP tiers via `pymupdf` + `cwebp`, and visually inspect every masked WebP.
3. **Question Authoring & Integration:**
   - Author ~10 high-yield schema-v2 questions per core lecture (or 2+ questions per case for Clinical Cases), ensuring balanced `correct_index`, zero length-flagged options, exact RLS page citations, and non-redundant rationales.
   - Update `data/<section>/{source-manifest,question-bank,coverage}.json` (and mirror to root `data/` if `physiology`).
   - Update `bank-config.js` section descriptions and `tests/endo-quiz.test.mjs` (`E1–E<N>` assertion + section count floors).
   - If adding E10+ to Combined Practice, update the `Core E1–E9 only` button label in `app.js` to `Core E1–E<N> only` (its filter logic `!id.startsWith('EX.')` is already dynamic!).
4. **Verify, Build & Ship:**
   - Run the full verification suite below, update `reports/preflight-audit.md`, commit to `main`, and push (`git push origin main`).

---

## 7. Verification, Build & Local Dev Commands

Run all commands from `/Users/chriselwell/Desktop/Picture Quiz/Endocrine/Endo Quiz App` with Homebrew on `PATH`:

```bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# 1. Unit tests (8 tests) + manifest/bank validation + production build (dist/)
npm run build

# 2. Validate published dist/ (verifies every image resolves, no raw originals, no files > 1 MiB)
python3 scripts/validate_bank.py --all --data dist/data --published

# 3. Strict question quality audit across all 4 sections (must return 0 hard errors | 0 review leads; supports --data data or --data data/<section>)
python3 scripts/audit_question_quality.py --data data --strict

# 4. Serve locally for interactive browser testing (registers .webp MIME type cleanly)
npm start

# 5. Optional UI smoke test
npm run test:ui

# 6. Push to GitHub Pages
git push origin main
```

---

## 8. UI Features Implemented & Suggested Next Tasks for Antigravity

### Already Built & Verified

- **Top navigation:** Live question count badges on all 4 sections (83, 40, 14, 18) + Combined Practice (155).
- **Single-section home (`app.js`):** Separate Lectures grid (E1–E8) and collapsible EX RxBricks dropdown (`<details id="ex-lectures">`) with short topic labels and `Select all EX` / `Clear EX` buttons; 3-box multi-select Content type filter (`Imaging`, `Diagrams/Graphs/Tables`, `Questions`).
- **Combined Practice (`combinedHome`):** Multi-section checkboxes, per-section filter overrides, 3-box Content type filter, and `Select all` / `Core E1–E9 only` / `EX RxBricks only` / `Clear` lecture buttons.
- **Clinical Cases (`caseHome`):** 9 E9 case cards showing accurate question + visual counts, study-skill filter, and accurate `Clinical Case` vs. `Clinical Case · Visual` eyebrows.
- **Quiz view:** Fit-to-frame zoom default, opt-in zoom/pan/tone/fullscreen, dynamic "Compare with teaching visual" toggle, `1–4` / `Enter` / `←→` / `M` / `F` / `Z` shortcuts, right-click or `Shift+1–4` choice strikeout, locked scoring + Keanne Button override, and guarded `coverageMarkup()` (fixed `info.gaps` crash).

### High-Value Next Tasks Well-Suited to Antigravity

1. **Interactive browser visual QA (desktop + mobile):** Serve via `npm start`, open in Antigravity's built-in browser, and visually verify all 5 views (Physiology, Pathology, Pharmacology, Clinical Cases, Combined Practice), dark/contrast image tones, mobile responsive layout (`<= 850px`), and `npm run test:ui`.
2. **Optional Clinical Cases UX upgrades:** Add a "Practice all cases" button or Learn/Exam mode toggle on `caseHome()` if you want immediate per-question feedback during cases (currently `caseSession` defaults to exam mode with feedback at case end).
3. **Optional iCloud duplicate cleanup:** The repo root currently contains untracked macOS/iCloud duplicate folders `dist 2` through `dist 12` (ignored by git). Ask before deleting them, and keep only `dist/`.
4. **Ingest E10+** as new lectures are added to the Obsidian vault and `Picture Quiz/Endocrine` folder using the Section 6 playbook above.
