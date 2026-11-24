# Endocrine Picture Quiz (E1–E3) Preflight Audit

- **Generated:** 2026-11-24
- **Source Root (read-only):** `/Users/chriselwell/Desktop/Picture Quiz/Endocrine`
- **App Root:** `/Users/chriselwell/Desktop/Picture Quiz/Endocrine/Endo Quiz App`
- **Primary Lecture Sources Audited:**
  - `E1 Endocrine Histology RLS.pdf` (51 pages) + E1 Transcripts 1 & 2
  - `E2 Introduction to Endocrine Physiology RLS.pdf` (35 pages) + E2 Notes & Transcript
  - `E3 Hormones, Receptors and Cell Signalling RLS.pdf` (20 pages) + E3 Learning Objectives & Transcript
- **3rd-Party Collections Scanned:** `Bootcamp Endocrinology` (86 files) and `First Aid 2023 Endocrinology` (59 files)

## Source Inventory Summary

| Scope | Extracted Files (kept) | Single Crops | Full-Slide Companions | Active Scored Visual Sources | Active Questions |
|---|---:|---:|---:|---:|---:|
| E1 (Lecture) | 61 | 44 | 17 | 19 (+1 A/B composite) | 19 |
| E1 (3rd-Party in-scope) | 86 Bootcamp / 59 FA | — | — | 3 (Bootcamp) | 3 |
| E2 (Lecture) | 18 | 11 | 7 | 4 (+1 table, +1 quantitative) | 6 |
| E3 (Lecture) | 24 | 19 | 5 | 9 (+1 two-statement text) | 10 |
| **Total (Physiology)** | **103 lecture PNGs** | **74** | **29** | **37 visual sources** | **38** |

## Deduplication & Source-Group Policy
- Full-slide companion PNGs (`* full slide - Diagram.png`) are excluded from scored duplication and preserved untouched in the read-only source library.
- `Pituitary gland H&E - Histology.png` and `Posterior pituitary H&E - Histology.png` share `source_group_id` (`pituitary_whole_mount`), and `Adrenal gland H&E` / `Adrenal cortex zones H&E` share `adrenal_cross_section` so consecutive items never repeat the same underlying micrograph.
- Cross-lecture overlapping overview slides (e.g., E2 `Endocrine paracrine and autocrine signaling` vs. E3 `Modes of cell cell signaling`) were deduplicated rather than double-counted.

## 3rd-Party Provenance & Scope Gate
- All pathology-only 3rd-party figures (Graves, Hashimoto, PTC, MTC, Cushing, Acromegaly, Pheochromocytoma, Neuroblastoma, etc.) were held back for upcoming **Pathology** lectures to preserve the strict lecture-only boundary.
- **3 strictly in-scope 3rd-party items** (`Bootcamp Endocrinology`: Bitemporal hemianopsia visual fields, Pituitary tumor & optic chiasm, Embryonic thyroid descent) were added to **Physiology** with `source_origin: "third_party"` so they are clearly selectable/filterable under **Source type → 3rd Party**.
- **5 aligned 3rd-party teaching diagrams** (Bootcamp & First Aid) were attached strictly as labeled post-answer `choice_images` supplements.

## Protocol & Format Distribution
- **Source origins:** `lecture`: 34, `third_party`: 3, `lecture-table`: 1
- **Format types:** `vignette`: 32, `comparison`: 1, `two_statement`: 2, `except`: 1, `incorrect_statement`: 1, `matching`: 1
- **Answer-safe masking:** All masked variants use opaque `#000000` rectangles strictly in non-diagnostic label/margin space, with lossless unmasked teaching originals preserved in `assets/originals/`.
