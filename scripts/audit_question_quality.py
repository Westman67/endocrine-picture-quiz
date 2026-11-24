#!/usr/bin/env python3
"""Audit active Endocrine quiz banks against the Custom Medical Quiz Authoring Protocol."""
import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

SECTIONS = ("physiology", "pathology", "pharmacology", "clinical-cases")
VALID_FORMATS = {"vignette", "except", "two_statement", "incorrect_statement", "matching", "comparison"}
ABSOLUTE_RE = re.compile(r"\b(always|never|only|proves|guarantees|all cases|no risk|no effect)\b", re.I)
STOP = set("the and this that with for has have which when what there without from than shown shows inside rather field other tissue image".split())


def tokens(text):
    return {
        part.removesuffix("s")
        for part in re.findall(r"\w+", text.casefold())
        if len(part) > 2 and part not in STOP
    }


def normalized(text):
    return " ".join(text.casefold().split())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=Path(__file__).resolve().parents[1] / "data")
    parser.add_argument("--flags", type=Path, help="Optional CSV output for audit findings")
    parser.add_argument("--strict", action="store_true", help="Exit nonzero on hard protocol violations")
    args = parser.parse_args()

    hard_errors = []
    review_leads = []

    for section in SECTIONS:
        bank_file = args.data / section / "question-bank.json"
        if not bank_file.is_file():
            continue
        questions = json.loads(bank_file.read_bytes()).get("questions", [])
        if not questions:
            print(f"{section}: 0 questions (ready stub)")
            continue

        rows = defaultdict(Counter)
        formats = Counter()
        orders = Counter()
        longest_correct = 0
        length_flagged = 0
        lecture_qs = [q for q in questions if q.get("source_origin") != "third_party"]

        for q in questions:
            label = q["question_id"]
            lecture = q.get("collection", "unknown")
            options, rationales, keyed = q["options"], q["choice_rationales"], q["correct_index"]
            skill = q.get("study_skill", "unassigned")
            fmt = q.get("format_type")
            order = q.get("reasoning_order")
            rows[lecture]["total"] += 1
            rows[lecture][skill] += 1
            formats[fmt or "missing"] += 1
            orders[str(order)] += 1

            if fmt not in VALID_FORMATS:
                hard_errors.append((section, lecture, label, f"invalid format_type: {fmt!r}", ""))
            if order not in (1, 2, 3):
                hard_errors.append((section, lecture, label, f"invalid reasoning_order: {order!r}", ""))
            if normalized(q["explanation"]) == normalized(rationales[keyed]):
                hard_errors.append((section, lecture, label, "duplicate teaching explanation", ""))
            if len({" ".join(r.casefold().split()) for r in rationales}) != len(rationales):
                hard_errors.append((section, lecture, label, "duplicate choice rationales", ""))

            for idx, (opt, rat) in enumerate(zip(options, rationales, strict=True)):
                if len(rat.strip()) <= 20:
                    hard_errors.append((section, lecture, label, "short rationale (<=20 chars)", rat))
                if ABSOLUTE_RE.search(opt):
                    review_leads.append((section, lecture, label, "absolute wording in option", opt))
                vocab = tokens(opt)
                if idx != keyed and len(vocab) > 1 and not vocab.intersection(tokens(rat)):
                    review_leads.append((section, lecture, label, "distractor wording to inspect", opt))

            if q.get("source_origin") != "third_party":
                lengths = [len(o) for o in options]
                c_len = lengths[keyed]
                max_other = max(l for i, l in enumerate(lengths) if i != keyed)
                if c_len > max_other:
                    longest_correct += 1
                if c_len >= 1.2 * max_other and (c_len - max_other) >= 10:
                    length_flagged += 1
                    hard_errors.append((section, lecture, label, "correct option >=1.2x longest distractor", options[keyed]))

        if lecture_qs:
            longest_pct = longest_correct / len(lecture_qs)
            flagged_pct = length_flagged / len(lecture_qs)
            if longest_pct > 0.45:
                hard_errors.append((section, "ALL", "option-length", f"correct-is-longest {longest_pct:.1%} > 45%", ""))
            if flagged_pct > 0.03:
                hard_errors.append((section, "ALL", "option-length", f"length-flagged {flagged_pct:.1%} > 3%", ""))

        skills = Counter(q.get("study_skill", "unassigned") for q in questions)
        print(f"{section}: {len(questions)} questions | skills={dict(sorted(skills.items()))}")
        print(f"  collections: " + ", ".join(f"{lec}={row['total']}" for lec, row in sorted(rows.items())))
        print(f"  formats={dict(sorted(formats.items()))} | reasoning_order={dict(sorted(orders.items()))}")
        if lecture_qs:
            print(f"  option-length (lecture n={len(lecture_qs)}): correct-longest={longest_correct}/{len(lecture_qs)} ({longest_correct/len(lecture_qs):.1%}), flagged={length_flagged}/{len(lecture_qs)} ({length_flagged/len(lecture_qs):.1%})")

    print(f"Hard errors: {len(hard_errors)} | Review leads: {len(review_leads)}")
    for err in hard_errors[:30]:
        print("  ERROR:", err)

    if args.flags:
        with args.flags.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.writer(handle)
            writer.writerow(("severity", "section", "lecture", "question_id", "check", "text"))
            for row in hard_errors:
                writer.writerow(("error", *row))
            for row in review_leads:
                writer.writerow(("lead", *row))

    if args.strict and hard_errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
