# Endocrine Picture Quiz — Preflight Audit

## Bank Summary (E1–E8 + EX.1–EX.12)

| Section | Lectures & EX RxBricks | Total Items | Core Lectures | EX RxBricks | 3rd Party |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Physiology** | E1–E4, E7, E8 + EX.1, EX.2, EX.3, EX.4, EX.7, EX.11 | 83 | 68 | 13 | 2 |
| **Pathology** | E5 + EX.5, EX.6, EX.8, EX.9, EX.12 | 40 | 23 | 14 | 3 |
| **Pharmacology** | E6 + EX.10 | 14 | 10 | 4 | 0 |
| **Combined** | E1–E8 + EX.1–EX.12 | 137 | 101 | 31 | 5 |

## Verification Gate Results
- `npm test`: **8/8 passing** (all 3 populated sections, all `E1–E8` lectures, all 12 `EX.1–EX.12` RxBricks, lineage, assets, schema v2, 3 canonical categories across all 3 sections, option-length parity across Physiology/Pathology/Pharmacology, Keanne Button, Learn/Exam timing, rotation/filtering)
- `scripts/audit_question_quality.py --strict` (`physiology`, `pathology`, `pharmacology`): **0 hard errors | 0 review leads**
- `npm run build` & `scripts/validate_bank.py --all --data dist/data --published`: **330 published images** (`521e0d69ab83bce3`), all 5 section manifests valid, zero raw originals in `dist/`, zero files > 1 MiB
- **E8 (*Physiology of Growth Hormone and Prolactin*) → Physiology (+10 items):** 8 visual `Diagrams/Graphs/Tables` items (GH central/peripheral feedback & ghrelin, 24-h GH pulsatility & arginine testing, lifespan/pubertal peak curve, direct lipolytic/glucose-sparing vs. indirect IGF-1 actions, dual effector liver `igf1-/-` bone growth, mammary alveolus secretory vs. myoepithelial targets, postpartum nursing prolactin curves & initiation/maintenance, suckling double-negative dopamine reflex & stalk transection) and 2 text `Questions` (isolated GH deficiency vs. cretinism & nutrition requirement; fed vs. fasting GH/IGF-1 survival-over-growth dissociation & prolactin-GnRH inhibition).
