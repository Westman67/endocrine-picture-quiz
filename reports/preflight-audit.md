# Endocrine Picture Quiz — Preflight Audit

## Bank Summary (E1–E5 + EX.1–EX.12)

| Section | Lectures & EX RxBricks | Total Items | Core Lectures | EX RxBricks | 3rd Party |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Physiology** | E1–E4 + EX.1, EX.2, EX.3, EX.4, EX.7, EX.11 | 63 | 48 | 13 | 2 |
| **Pathology** | E5 + EX.5, EX.6, EX.8, EX.9, EX.12 | 40 | 23 | 14 | 3 |
| **Pharmacology** | EX.10 (Meds & Supplements) | 4 | 0 | 4 | 0 |
| **Combined** | E1–E5 + EX.1–EX.12 | 107 | 71 | 31 | 5 |

## Verification Gate Results
- `npm test`: **8/8 passing** (all 3 populated sections, all E1–E5 lectures, all 12 EX.1–EX.12 RxBricks, lineage, assets, schema v2, 3 canonical categories, option-length parity, Keanne Button, Learn/Exam timing, rotation/filtering)
- `scripts/audit_question_quality.py --strict` (`physiology`, `pathology`, `pharmacology`): **0 hard errors | 0 review leads**
- `npm run build` & `scripts/validate_bank.py --all --data dist/data --published`: **270 published images**, all 5 section manifests valid, zero raw originals in `dist/`, zero files > 1 MiB
- **UI:** Added collapsible **EX RxBricks** dropdown (`<details id="ex-lectures">`) with per-brick topic labels and `Select all EX` / `Clear EX` controls so any subset of `EX.1–EX.12` can be included or excluded cleanly alongside core lectures.
