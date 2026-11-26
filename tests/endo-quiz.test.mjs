import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { empty, filtered, session, see, answer, override, totals, canReveal, validateImport, ordered, CONTENT_CATEGORIES } from '../engine.js';
import { BANKS, CLINICAL_CASES, PHARMACOLOGY, COMBINED, STUDY_SECTIONS, resolveBankConfig } from '../bank-config.js';

const base = path.resolve(import.meta.dirname, '..');
const physBankPayload = JSON.parse(fs.readFileSync(path.join(base, 'data/physiology/question-bank.json'), 'utf8'));
const bank = physBankPayload.questions;
const sources = JSON.parse(fs.readFileSync(path.join(base, 'data/physiology/source-manifest.json'), 'utf8')).sources;

const pathBankPayload = JSON.parse(fs.readFileSync(path.join(base, 'data/pathology/question-bank.json'), 'utf8'));
const pathBank = pathBankPayload.questions;
const pathSources = JSON.parse(fs.readFileSync(path.join(base, 'data/pathology/source-manifest.json'), 'utf8')).sources;

const pharmBankPayload = JSON.parse(fs.readFileSync(path.join(base, 'data/pharmacology/question-bank.json'), 'utf8'));
const pharmBank = pharmBankPayload.questions;
const pharmSources = JSON.parse(fs.readFileSync(path.join(base, 'data/pharmacology/source-manifest.json'), 'utf8')).sources;

test('4-section Endocrine bank config resolves cleanly with isolated storage keys', () => {
    assert.equal(STUDY_SECTIONS.length, 4);
    assert.equal(resolveBankConfig('').id, 'physiology');
    assert.equal(resolveBankConfig('?bank=pathology').id, 'pathology');
    assert.equal(resolveBankConfig('?bank=pharmacology').id, 'pharmacology');
    assert.equal(resolveBankConfig('?bank=clinical-cases').id, 'clinical-cases');
    assert.equal(resolveBankConfig('?bank=combined').id, 'combined');
    const keys = new Set([
        BANKS.physiology.progressKey,
        BANKS.pathology.progressKey,
        PHARMACOLOGY.progressKey,
        CLINICAL_CASES.progressKey,
        COMBINED.progressKey,
    ]);
    assert.equal(keys.size, 5);
    for (const k of keys) assert.match(k, /^endocrine-/);
});

function validateBankIntegrity(questions, manifestSources, label) {
    const ids = new Set();
    const validFormats = new Set(['vignette', 'except', 'two_statement', 'incorrect_statement', 'matching', 'comparison']);
    const allowedCategories = new Set(CONTENT_CATEGORIES);
    for (const q of questions) {
        assert(!ids.has(q.question_id), `${label}: duplicate id ${q.question_id}`);
        ids.add(q.question_id);
        assert.ok(allowedCategories.has(q.category), `${label} ${q.question_id}: unexpected category ${q.category}`);
        assert.ok(validFormats.has(q.format_type), `${label} ${q.question_id}: invalid format_type ${q.format_type}`);
        assert.ok([1, 2, 3].includes(q.reasoning_order), `${label} ${q.question_id}: invalid reasoning_order ${q.reasoning_order}`);
        assert.ok(q.citations?.length > 0, `${label} ${q.question_id}: missing citations`);
        assert.equal(q.options.length, 4);
        assert.equal(new Set(q.options.map(s => s.trim().toLowerCase())).size, 4);
        assert.equal(q.choice_rationales.length, 4);
        assert.ok(q.choice_rationales.every(s => s.trim().length > 20));
        assert.notEqual(q.choice_rationales[q.correct_index].trim(), q.explanation.trim());

        if (q.visual_kind !== 'table' && q.visual_kind !== 'text') {
            const s = manifestSources.find(x => x.source_id === q.source_id);
            assert.ok(s, `${label} ${q.question_id}: source ${q.source_id} missing`);
            assert.equal(s.status, 'USABLE');
            assert.equal(s.source_group_id, q.source_group_id);
            assert.ok(s.variants.some(v => v.variant_id === q.variant_id));
            assert.ok(q.visual_target);
            for (const key of ['image', 'original_image', 'zoom_image']) {
                assert.match(q[key], /^assets\/(display|originals|zoom)\/[a-z0-9]+(?:-[a-z0-9-]+)?\.(png|webp)$/);
                const data = fs.readFileSync(path.join(base, q[key]));
                assert.ok(data.length > 100);
                if (q[key].endsWith('.webp')) assert.equal(data.subarray(8, 12).toString(), 'WEBP');
                else assert.equal(data.subarray(1, 4).toString(), 'PNG');
            }
        }
    }
}

test('physiology, pathology, and pharmacology banks pass full lineage, asset, and schema v2 checks', () => {
    assert.ok(bank.length >= 70, `expected >= 70 physiology questions, got ${bank.length}`);
    assert.ok(pathBank.length >= 35, `expected >= 35 pathology questions, got ${pathBank.length}`);
    assert.ok(pharmBank.length >= 14, `expected >= 14 pharmacology questions, got ${pharmBank.length}`);
    validateBankIntegrity(bank, sources, 'physiology');
    validateBankIntegrity(pathBank, pathSources, 'pathology');
    validateBankIntegrity(pharmBank, pharmSources, 'pharmacology');
});

test('all E1-E7 lectures and all 12 EX.1-EX.12 RxBricks plus labeled third-party support are represented', () => {
    const allQs = [...bank, ...pathBank, ...pharmBank];
    for (const id of ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7']) {
        assert.ok(allQs.some(q => q.collection === id), `missing lecture ${id}`);
    }
    for (let i = 1; i <= 12; i++) {
        const exId = `EX.${i}`;
        assert.ok(allQs.some(q => q.collection === exId), `missing RxBrick ${exId}`);
    }
    assert.ok(bank.some(q => q.source_origin === 'third_party'), 'missing physiology third_party items');
    assert.ok(pathBank.some(q => q.source_origin === 'third_party'), 'missing pathology third_party items');
});

test('option length parity stays within protocol ceilings across physiology, pathology, and pharmacology', () => {
    for (const [label, qs] of [['physiology', bank], ['pathology', pathBank], ['pharmacology', pharmBank]]) {
        const lectureQs = qs.filter(q => q.source_origin !== 'third_party');
        let longest = 0;
        const flagged = [];
        for (const q of lectureQs) {
            const L = q.options.map(o => o.length);
            const c = L[q.correct_index];
            const maxOther = Math.max(...L.filter((_, i) => i !== q.correct_index));
            if (c > maxOther) longest++;
            if (c >= 1.2 * maxOther && c - maxOther >= 10) flagged.push(q.question_id);
        }
        assert.ok(longest / lectureQs.length <= 0.45, `${label} correct-is-longest ${Math.round(100 * longest / lectureQs.length)}% > 45%`);
        assert.ok(flagged.length / lectureQs.length <= 0.03, `${label} length-flagged: ${flagged.join(', ')}`);
    }
});

test('locked scoring and Keanne Button correction preserve selection and attempt count', () => {
    const p = empty(), q = bank[0], s = session([q]), it = s.items[0];
    see(p, q, it);
    see(p, q, it);
    it.draft = (q.correct_index + 1) % 4;
    assert.ok(answer(p, q, it));
    assert.ok(!answer(p, q, it));
    assert.equal(p.questions[q.question_id].times_seen, 1);
    assert.equal(filtered(bank, p, { filter: 'incorrect' }).length, 1);
    const choice = it.draft;
    assert.ok(override(p, q, it));
    assert.equal(it.draft, choice);
    assert.equal(p.questions[q.question_id].times_answered, 1);
    assert.equal(filtered(bank, p, { filter: 'incorrect' }).length, 0);
    assert.equal(totals(s).correct, 1);
    assert.ok(!override(p, q, it));
});

test('Learn and Exam reveal timing, skips, saved drafts and shuffled rationales', () => {
    const p = empty();
    for (const mode of ['learn', 'exam']) {
        const s = session(bank.slice(0, 3), mode), it = s.items[0], q = bank[0];
        assert.ok(!canReveal(s, it));
        it.draft = q.correct_index;
        answer(p, q, it);
        assert.equal(canReveal(s, it), mode === 'learn');
        s.index = 1;
        s.index = 0;
        assert.equal(s.items[0].draft, q.correct_index);
        assert.equal(s.items[0].locked, true);
        assert.equal(totals(s).unanswered, 2);
        for (const oi of it.order) assert.ok(q.choice_rationales[oi]);
        s.complete = true;
        assert.ok(canReveal(s, it));
        p.session = s;
        assert.deepEqual(validateImport(JSON.parse(JSON.stringify(p)), bank), p);
    }
});

test('source groups rotate before repeat and filters respect origin and EX collection selection', () => {
    const p = empty(), q = bank[0];
    see(p, q, session([q]).items[0]);
    assert.ok(filtered(bank, p, { filter: 'unseen' }).every(x => x.source_group_id !== q.source_group_id));
    assert.ok(filtered(bank, p, { origin: 'third_party' }).every(x => x.source_origin === 'third_party'));
    assert.ok(filtered(bank, p, { collection: ['E7'] }).length === 10);
    assert.ok(filtered(bank, p, { collection: ['EX.7'] }).every(x => x.collection === 'EX.7'));
    assert.ok(filtered(pathBank, p, { collection: ['EX.6'] }).every(x => x.collection === 'EX.6'));
    assert.ok(filtered(pharmBank, p, { collection: ['E6'] }).length === 10);
    assert.ok(filtered(pharmBank, p, { collection: ['EX.10'] }).every(x => x.collection === 'EX.10'));
    const pool = [
        { question_id: 'a', source_group_id: '1' },
        { question_id: 'b', source_group_id: '1' },
        { question_id: 'c', source_group_id: '2' },
        { question_id: 'd', source_group_id: '2' },
    ];
    const out = ordered(pool, () => 0.4);
    for (let i = 1; i < out.length; i++) assert.notEqual(out[i].source_group_id, out[i - 1].source_group_id);
});

test('canonical 3-bucket content categories support multi-select filtering across sections', () => {
    const p = empty();
    for (const qs of [bank, pathBank, pharmBank]) {
        const imgOnly = filtered(qs, p, { category: ['Imaging'] });
        const dgtOnly = filtered(qs, p, { category: ['Diagrams/Graphs/Tables'] });
        const qOnly = filtered(qs, p, { category: ['Questions'] });
        const combinedTwo = filtered(qs, p, { category: ['Imaging', 'Questions'] });
        assert.ok(imgOnly.length > 0 && dgtOnly.length > 0 && qOnly.length > 0);
        assert.equal(imgOnly.length + dgtOnly.length + qOnly.length, qs.length);
        assert.equal(combinedTwo.length, imgOnly.length + qOnly.length);
    }
});
