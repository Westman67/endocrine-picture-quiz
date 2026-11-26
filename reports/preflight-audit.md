# Endocrine Picture Quiz — Preflight Audit

## Bank Summary (E1–E7 + EX.1–EX.12)

| Section | Lectures & EX RxBricks | Total Items | Core Lectures | EX RxBricks | 3rd Party |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Physiology** | E1–E4, E7 + EX.1, EX.2, EX.3, EX.4, EX.7, EX.11 | 73 | 58 | 13 | 2 |
| **Pathology** | E5 + EX.5, EX.6, EX.8, EX.9, EX.12 | 40 | 23 | 14 | 3 |
| **Pharmacology** | E6 + EX.10 | 14 | 10 | 4 | 0 |
| **Combined** | E1–E7 + EX.1–EX.12 | 127 | 91 | 31 | 5 |

## Verification Gate Results
- `npm test`: **8/8 passing** (all 3 populated sections, all `E1–E7` lectures, all 12 `EX.1–EX.12` RxBricks, lineage, assets, schema v2, 3 canonical categories across all 3 sections, option-length parity across Physiology/Pathology/Pharmacology, Keanne Button, Learn/Exam timing, rotation/filtering)
- `scripts/audit_question_quality.py --strict` (`physiology`, `pathology`, `pharmacology`): **0 hard errors | 0 review leads**
- `npm run build` & `scripts/validate_bank.py --all --data dist/data --published`: **306 published images** (`4234f61516ca789c`), all 5 section manifests valid, zero raw originals in `dist/`, zero files > 1 MiB
- **E6 (*Medical Treatment of Pituitary Disorders*) → Pharmacology (+10 items):** 4 visual items (1 `Imaging` ultrasound for IVF/hCG/OHSS + 3 `Diagrams/Graphs/Tables` for degarelix vs. leuprolide, cabergoline BBB, GH direct vs. IGF-1 drugs) and 6 text `Questions`, strictly honoring E6 `Not Required` exclusions (ACTH gelatin vial cost, recombinant vs. urinary gonadotropin origin, granular IVF day-by-day protocols).
- **E7 (*Posterior Pituitary Hormones*) → Physiology (+10 items):** 8 visual `Diagrams/Graphs/Tables` items (osmolar vs. hemodynamic AVP, AVP vs. thirst thresholds, non-osmotic AVP stimuli, V₁/V₂/V₃ receptors, postoperative triphasic response, urine vs. serum osmolarity curves, chronic hypernatremia idiogenic osmoles, DDAVP structure/fluid limit) and 2 text `Questions` (free water deficit calculation, copeptin & familial AVP deficiency).
