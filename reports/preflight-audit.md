# Endocrine Picture Quiz — Preflight Audit

## Bank Summary (E1–E5)

| Section | Lectures | Total Items | Lecture | 3rd Party | Imaging | Diagrams/Graphs/Tables | Questions | Correct-Longest | Length-Flagged |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Physiology** | E1–E4 | 50 | 48 | 2 | 11 | 32 | 7 | 20.8% | 0% |
| **Pathology** | E5 | 26 | 23 | 3 | 16 | 7 | 3 | 8.7% | 0% |
| **Combined** | E1–E5 | 76 | 71 | 5 | 27 | 39 | 10 | 16.9% | 0% |

## Verification Gate Results
- `npm test`: **9/9 passing** (lineage, assets, schema v2, 3 canonical categories, E1–E5 coverage, option-length parity, Keanne Button, Learn/Exam timing, rotation/filtering)
- `scripts/audit_question_quality.py --strict` (`physiology` & `pathology`): **0 hard errors | 0 review leads**
- `npm run build` & `scripts/validate_bank.py --all --data dist/data --published`: **207 published images**, all 5 section manifests valid, zero raw originals in `dist/`, zero files > 1 MiB
- **Audit cleanup applied:** Retired duplicate E1 bitemporal hemianopia card (`q-e1-3p-bitemporal-hemianopia`, now owned by E5 Pathology); removed absolute giveaway words, leftover masked-row meta-clue, ASCII typography (`× Kd`, `V₁/V₂`), and repetitive keyed rationales; populated `joint_panels` on E5 A/B comparisons; tightened `e4-primary-secondary-tertiary` crop and `e5-septo-optic-mri` seamless mask; upgraded UI (`Concept question` eyebrow, 3-box `Content type` filter in Combined Practice, dynamic `Compare with teaching visual` toggle, clean "Coming soon" empty state for upcoming sections).
