# Endocrine Picture Quiz — Preflight Audit

## Bank Summary (E1–E5)

| Section | Lectures | Total Items | Lecture | 3rd Party | Imaging | Diagrams/Graphs/Tables | Questions | Correct-Longest | Length-Flagged |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Physiology** | E1–E4 | 51 | 48 | 3 | 11 | 33 | 7 | 20.8% | 0% |
| **Pathology** | E5 | 26 | 23 | 3 | 16 | 7 | 3 | 8.7% | 0% |
| **Combined** | E1–E5 | 77 | 71 | 6 | 27 | 40 | 10 | 16.9% | 0% |

## Verification Gate Results
- `npm test`: **9/9 passing** (lineage, assets, schema v2, 3 canonical categories, E1–E5 coverage, option-length parity, Keanne Button, Learn/Exam timing, rotation/filtering)
- `scripts/audit_question_quality.py --strict` (`physiology` & `pathology`): **0 hard errors | 0 review leads**
- `npm run build` & `scripts/validate_bank.py --all --data dist/data --published`: **207 published images**, all 5 section manifests valid, zero raw originals in `dist/`, zero files > 1 MiB

## E4 & E5 Scope & Exclusions
- **E4 (Physiology of the Hypothalamus & Pituitary):** Covers hypothalamic magnocellular ADH/oxytocin synthesis & neurophysins, hypophyseal portal circulation & continuous GnRH desensitization, glycoprotein α/β subunits & hCG-LH receptor binding, hypothalamic factors & stalk effect, primary/secondary/tertiary localization, dual TRH/dopamine prolactin regulation & GnRH suppression, GH/IGF-1 fed vs. fasting & thyroid permissive role, anterior hormone families, clearance & feed-forward control.
- **E5 (Pathology of Hypothalamus & Pituitary):** Covers bitemporal hemianopia, PitNET gross/monomorphic H&E/reticulin A-B/WHO 2022 IHC (`PIT1`, `TPIT`, `SF1`)/micro (<1 cm) vs. macroadenoma (≥1 cm) MRI, adamantinomatous (`CTNNB1`, wet keratin, machinery oil) vs. papillary (`BRAF p.V600E`) craniopharyngioma A-B + MRI, prolactinoma (>200 ng/mL, first-line dopamine agonist), acromegaly (IGF-1/OGTT, transsphenoidal surgery), gigantism, pituitary apoplexy emergency, septo-optic dysplasia MRI, alobar holoprosencephaly, Kallmann syndrome, ectopic posterior pituitary MRI, Rathke cleft cyst histology, lymphocytic hypophysitis (histology + MRI), Sheehan syndrome, empty sella MRI, hypopituitarism >75% threshold/order/proportionate short stature, central vs. nephrogenic DI, water deprivation/desmopressin test, SIAD/vaptan V₂ mechanism, and hypothalamic nuclei localization.
- **Strict `Not Required` exclusions enforced:** No scored items on congenital anomaly gene lists (`HESX1`, `SOX2`, `ANOS1`), `GNAS`/`USP8` PitNET mutations, densely vs. sparsely granulated PitNET subtypes, or giant adenoma (>4 cm) extension staging.
