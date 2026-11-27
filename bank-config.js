export const BANK_OPTIONS = [
    { id: 'physiology', label: 'Physiology', href: '?bank=physiology' },
    { id: 'pathology', label: 'Pathology', href: '?bank=pathology' },
];

export const BANKS = Object.fromEntries(BANK_OPTIONS.map(({ id, label, href }) => [id, {
    id,
    dataRoot: `./data/${id}`,
    progressKey: `endocrine-${id}-picture-quiz-v1`,
    preferencesKey: `endocrine-${id}-picture-quiz-preferences-v1`,
    exportName: `endocrine-${id}-progress.json`,
    title: `Endocrine ${label} · Picture Quiz`,
    brand: `${label.toUpperCase()} PICTURE QUIZ`,
    eyebrow: `Endocrine · ${label}`,
    description: id === 'physiology'
        ? 'Practice E1–E4, E7, and E8 lectures plus EX RxBricks (EX.1–EX.5, EX.7, EX.11) covering embryology, histology, hormone physiology, receptor signaling, hypothalamic-pituitary axes, posterior pituitary water balance, calcium/vitamin D, appetite control, and GH/prolactin.'
        : 'Practice E5 pituitary pathology plus EX RxBricks (EX.4–EX.6, EX.8, EX.9, EX.12) covering pituitary syndromes, water balance/SIADH, thyroid, adrenal/CAH, MEN syndromes, and diabetes.',
    footer: `Endocrine · ${label} · Local picture quiz`,
    homeUrl: href,
}]));

export const CLINICAL_CASES = {
    id: 'clinical-cases',
    dataRoot: './data/clinical-cases',
    progressKey: 'endocrine-clinical-cases-progress-v1',
    preferencesKey: 'endocrine-clinical-cases-preferences-v1',
    exportName: 'endocrine-clinical-cases-progress.json',
    title: 'Endocrine · Clinical Cases',
    brand: 'CLINICAL CASES',
    eyebrow: 'Endocrine · Clinical Cases',
    description: 'Work through E9’s 9 integrated endocrine mini-cases covering prolactinoma, acromegaly, type 1 diabetes, insulinoma, primary hyperparathyroidism, Hashimoto thyroiditis, Cushing syndrome, and primary adrenal insufficiency.',
    footer: 'Endocrine · Clinical Cases',
    homeUrl: '?bank=clinical-cases',
};

export const PHARMACOLOGY = {
    id: 'pharmacology',
    dataRoot: './data/pharmacology',
    progressKey: 'endocrine-pharmacology-quiz-v1',
    preferencesKey: 'endocrine-pharmacology-quiz-preferences-v1',
    exportName: 'endocrine-pharmacology-progress.json',
    title: 'Endocrine · Pharmacology Quiz',
    brand: 'PHARMACOLOGY QUIZ',
    eyebrow: 'Endocrine · Pharmacology',
    description: 'Practice E6 pituitary pharmacology plus EX RxBricks (EX.4, EX.5, EX.10) covering dopamine agonists, GnRH analogs, octreotide, pegvisomant, desmopressin, abiraterone, biotin, amiodarone, lithium, steroids, and checkpoint inhibitors.',
    footer: 'Endocrine · Pharmacology · Local quiz',
    homeUrl: '?bank=pharmacology',
};

export const STUDY_SECTIONS = [
    ...BANK_OPTIONS.map(option => ({ ...option, dataRoot: BANKS[option.id].dataRoot })),
    { id: PHARMACOLOGY.id, label: 'Pharmacology', href: PHARMACOLOGY.homeUrl, dataRoot: PHARMACOLOGY.dataRoot },
    { id: CLINICAL_CASES.id, label: 'Clinical Cases', href: CLINICAL_CASES.homeUrl, dataRoot: CLINICAL_CASES.dataRoot },
];

export const COMBINED = {
    id: 'combined',
    progressKey: 'endocrine-combined-practice-v1',
    preferencesKey: 'endocrine-combined-practice-preferences-v1',
    exportName: 'endocrine-combined-practice-progress.json',
    title: 'Endocrine · Combined Practice',
    brand: 'COMBINED PRACTICE',
    footer: 'Endocrine · Combined Practice',
    homeUrl: '?bank=combined',
};

export function resolveBankConfig(search = '') {
    const params = new URLSearchParams(search);
    const bank = params.get('bank');
    if (bank === CLINICAL_CASES.id || (bank === 'pathology' && params.get('mode') === 'cases')) return CLINICAL_CASES;
    if (bank === COMBINED.id) return COMBINED;
    if (bank === PHARMACOLOGY.id) return PHARMACOLOGY;
    if (bank === 'supplementary') return BANKS.pathology;
    return Object.hasOwn(BANKS, bank) ? BANKS[bank] : BANKS.physiology;
}
