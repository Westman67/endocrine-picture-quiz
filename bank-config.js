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
        ? 'Practice E1–E4 histology, hormone physiology, feedback, receptor signaling, and hypothalamic-pituitary control (plus labeled 3rd-party support under Source type).'
        : 'Practice E5 hypothalamic & pituitary pathology MRI, histology, gross, clinical photos, and pathway diagrams (plus labeled 3rd-party support under Source type).',
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
    description: 'Multi-question linked clinical-visual cases will populate here as clinical endocrine lectures are added.',
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
    description: 'Drug mechanism, adverse effect, and endocrine therapy reasoning will populate here as pharmacology lectures are added.',
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
