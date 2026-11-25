import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Info,
  Languages,
  Plus,
  Puzzle,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { AddFormModal } from './components/AddFormModal';
import { DraftModal } from './components/DraftModal';
import { ExtensionModal } from './components/ExtensionModal';
import {
  BUILTIN_FORMS,
  CUSTOM_FORMS_STORAGE_KEY,
  DEMO_CASTE_SCHEMA,
  SAVED_ANSWERS_STORAGE_KEY,
  SAVED_DOCS_STORAGE_KEY,
  SYNCED_DRAFT_STORAGE_KEY,
  UI_TEXT,
} from './data/forms';
import type { FormSchema, Language, SyncedDraftPayload } from './types/sahayak';
import { decodeSchemaBase64, sanitizeImportedSchema } from './utils/extensionBuilder';

interface SyncBannerInfo {
  titleEn: string;
  titleHi: string;
  fieldCount: number;
  skippedDynamicCount?: number;
  sourceUrl?: string;
}

function loadSavedCustomForms(): Record<string, FormSchema> {
  try {
    const raw = localStorage.getItem(CUSTOM_FORMS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, FormSchema>;
    if (!parsed || typeof parsed !== 'object') return {};
    const valid: Record<string, FormSchema> = {};
    Object.entries(parsed).forEach(([key, schema]) => {
      if (schema && Array.isArray(schema.fields) && schema.fields.length > 0) {
        valid[key] = { ...schema, isCustom: true };
      }
    });
    return valid;
  } catch {
    return {};
  }
}

function persistCustomForms(allForms: Record<string, FormSchema>) {
  const customOnly: Record<string, FormSchema> = {};
  Object.entries(allForms).forEach(([key, schema]) => {
    if (!BUILTIN_FORMS[key]) {
      customOnly[key] = schema;
    }
  });
  try {
    localStorage.setItem(CUSTOM_FORMS_STORAGE_KEY, JSON.stringify(customOnly));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

function loadJsonStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveJsonStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [formsDb, setFormsDb] = useState<Record<string, FormSchema>>(() => ({
    ...BUILTIN_FORMS,
    ...loadSavedCustomForms(),
  }));
  const [currentFormId, setCurrentFormId] = useState<string>('scholarship');
  const [extensionConnected, setExtensionConnected] = useState<boolean>(false);

  const [valuesByForm, setValuesByForm] = useState<Record<string, Record<string, string>>>(() => ({
    scholarship: {},
    income: {},
    ...loadJsonStorage<Record<string, Record<string, string>>>(SAVED_ANSWERS_STORAGE_KEY, {}),
  }));
  const [manualDocsByForm, setManualDocsByForm] = useState<
    Record<string, Record<string, boolean>>
  >(() => ({
    scholarship: {},
    income: {},
    ...loadJsonStorage<Record<string, Record<string, boolean>>>(SAVED_DOCS_STORAGE_KEY, {}),
  }));

  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [showGlobalError, setShowGlobalError] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const [syncBanner, setSyncBanner] = useState<SyncBannerInfo | null>(null);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState<boolean>(false);
  const [isAddFormModalOpen, setIsAddFormModalOpen] = useState<boolean>(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);
  const [draftSyncedToExt, setDraftSyncedToExt] = useState<boolean>(false);

  const t = UI_TEXT[lang];
  const currentForm: FormSchema = formsDb[currentFormId] || formsDb.scholarship;
  const currentValues = valuesByForm[currentForm.id] || {};
  const currentManualDocs = manualDocsByForm[currentForm.id] || {};

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Build rich autofill payload including original selectors & labels so 1-click autofill matches reliably
  const buildDraftPayload = useCallback(
    (formDef: FormSchema, vals: Record<string, string>): SyncedDraftPayload => ({
      formId: formDef.id,
      formName: formDef.name[lang] || formDef.name.en,
      sourceUrl: formDef.sourceUrl,
      values: vals,
      entries: formDef.fields.map((field, idx) => ({
        id: field.id,
        value: vals[field.id] || '',
        rawId: field.rawId,
        rawName: field.rawName,
        selectorHint: field.selectorHint,
        labelEn: field.label.en,
        labelHi: field.label.hi,
        type: field.type,
        index: idx,
      })),
      syncedAt: new Date().toISOString(),
    }),
    [lang]
  );

  // Automatically persist user answers, manual checklist ticks, and keep extension draft synced
  useEffect(() => {
    saveJsonStorage(SAVED_ANSWERS_STORAGE_KEY, valuesByForm);
    const activeVals = valuesByForm[currentForm.id] || {};
    const hasAnyValue = Object.values(activeVals).some((v) => String(v || '').trim().length > 0);
    if (hasAnyValue) {
      const payload = buildDraftPayload(currentForm, activeVals);
      saveJsonStorage(SYNCED_DRAFT_STORAGE_KEY, payload);
      window.postMessage({ type: 'SAHAYAK_SITE_SYNC_DRAFT', payload }, '*');
    }
  }, [valuesByForm, currentForm, buildDraftPayload]);

  useEffect(() => {
    saveJsonStorage(SAVED_DOCS_STORAGE_KEY, manualDocsByForm);
  }, [manualDocsByForm]);

  const registerExtractedForm = useCallback((schema: FormSchema, showNotice = true) => {
    if (!schema || !schema.id || !Array.isArray(schema.fields) || schema.fields.length === 0) {
      return;
    }
    const sanitized = sanitizeImportedSchema(schema);
    const normalized: FormSchema = { ...sanitized, isCustom: true };
    setFormsDb((prev) => {
      const next = { ...prev, [normalized.id]: normalized };
      persistCustomForms(next);
      return next;
    });
    setValuesByForm((prev) => (prev[normalized.id] ? prev : { ...prev, [normalized.id]: {} }));
    setManualDocsByForm((prev) =>
      prev[normalized.id] ? prev : { ...prev, [normalized.id]: {} }
    );
    setCurrentFormId(normalized.id);
    setValidationErrors({});
    setShowGlobalError(false);

    if (showNotice) {
      setSyncBanner({
        titleEn: normalized.name.en,
        titleHi: normalized.name.hi || normalized.name.en,
        fieldCount: normalized.fields.length,
        skippedDynamicCount: normalized.skippedDynamicCount,
        sourceUrl: normalized.sourceUrl,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Import form from URL hash (#ext_schema=...) or query (?ext_schema=...) when opened by Extension
  const checkUrlForExtensionSchema = useCallback(() => {
    let encoded = '';
    const hash = window.location.hash || '';
    const searchParams = new URLSearchParams(window.location.search);

    if (hash.startsWith('#ext_schema=')) {
      encoded = hash.slice('#ext_schema='.length);
    } else if (searchParams.get('ext_schema')) {
      encoded = searchParams.get('ext_schema') || '';
    }

    if (!encoded) return;

    try {
      const schema = decodeSchemaBase64(encoded);
      registerExtractedForm(schema, true);
      window.postMessage({ type: 'SAHAYAK_SITE_IMPORT_ACK' }, '*');
      window.history.replaceState(null, '', window.location.pathname);
    } catch {
      // If URL payload was truncated, bridge.js will still deliver sahayak_pending_import
      window.postMessage({ type: 'SAHAYAK_SITE_READY' }, '*');
    }
  }, [registerExtractedForm]);

  useEffect(() => {
    checkUrlForExtensionSchema();
    window.addEventListener('hashchange', checkUrlForExtensionSchema);
    return () => window.removeEventListener('hashchange', checkUrlForExtensionSchema);
  }, [checkUrlForExtensionSchema]);

  // Listen for live two-way Chrome Extension bridge messages & perform handshake
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window || !event.data || typeof event.data !== 'object') return;
      const data = event.data as {
        type?: string;
        schema?: FormSchema;
        forms?: FormSchema[];
      };

      if (data.type === 'SAHAYAK_EXT_CONNECTED') {
        setExtensionConnected(true);
      } else if (data.type === 'SAHAYAK_EXT_IMPORT_FORM' && data.schema) {
        setExtensionConnected(true);
        registerExtractedForm(data.schema, true);
        window.postMessage({ type: 'SAHAYAK_SITE_IMPORT_ACK' }, '*');
      } else if (data.type === 'SAHAYAK_EXT_SYNC_DB' && Array.isArray(data.forms)) {
        setExtensionConnected(true);
        setFormsDb((prev) => {
          let changed = false;
          const next = { ...prev };
          data.forms!.forEach((schema) => {
            if (schema && schema.id && Array.isArray(schema.fields) && !next[schema.id]) {
              next[schema.id] = { ...sanitizeImportedSchema(schema), isCustom: true };
              changed = true;
            }
          });
          if (changed) persistCustomForms(next);
          return changed ? next : prev;
        });
      }
    };

    window.addEventListener('message', handleMessage);

    // Proactively handshake with bridge.js so we never miss forms even if bridge loaded first
    window.postMessage({ type: 'SAHAYAK_SITE_READY' }, '*');
    const retry1 = window.setTimeout(() => {
      window.postMessage({ type: 'SAHAYAK_SITE_READY' }, '*');
    }, 350);
    const retry2 = window.setTimeout(() => {
      window.postMessage({ type: 'SAHAYAK_SITE_READY' }, '*');
    }, 1100);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.clearTimeout(retry1);
      window.clearTimeout(retry2);
    };
  }, [registerExtractedForm]);

  const filledFieldCount = useMemo(() => {
    return currentForm.fields.filter((f) => (currentValues[f.id] || '').trim().length > 0).length;
  }, [currentForm.fields, currentValues]);

  const readyDocCount = useMemo(() => {
    return currentForm.documents.filter((doc) => {
      const linkedFilled = (currentValues[doc.linkedField] || '').trim().length > 0;
      return linkedFilled || Boolean(currentManualDocs[doc.id]);
    }).length;
  }, [currentForm.documents, currentValues, currentManualDocs]);

  const checklistProgressPct = useMemo(() => {
    const total = currentForm.documents.length || 1;
    return Math.round((readyDocCount / total) * 100);
  }, [currentForm.documents.length, readyDocCount]);

  const handleFormChange = (nextId: string) => {
    setCurrentFormId(nextId);
    setValidationErrors({});
    setShowGlobalError(false);
    setSavedNotice(false);
  };

  const handleDeleteCustomForm = () => {
    if (BUILTIN_FORMS[currentForm.id]) return;
    const removedId = currentForm.id;
    setFormsDb((prev) => {
      const next = { ...prev };
      delete next[removedId];
      persistCustomForms(next);
      return next;
    });
    setValuesByForm((prev) => {
      const next = { ...prev };
      delete next[removedId];
      return next;
    });
    setManualDocsByForm((prev) => {
      const next = { ...prev };
      delete next[removedId];
      return next;
    });
    window.postMessage({ type: 'SAHAYAK_SITE_DELETE_FORM', formId: removedId }, '*');
    setCurrentFormId('scholarship');
    setValidationErrors({});
    setShowGlobalError(false);
    setSyncBanner(null);
  };

  const handleFieldInput = (fieldId: string, value: string) => {
    const nextFormValues = {
      ...currentValues,
      [fieldId]: value,
    };

    setValuesByForm((prev) => ({
      ...prev,
      [currentForm.id]: nextFormValues,
    }));

    if (value.trim().length > 0 && validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }

    const allRequiredFilled = currentForm.fields.every(
      (f) => f.optional || (nextFormValues[f.id] || '').trim().length > 0
    );
    if (allRequiredFilled) {
      setShowGlobalError(false);
    }
  };

  const handleToggleExplanation = (fieldId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleManualDocToggle = (docId: string, checked: boolean) => {
    const doc = currentForm.documents.find((d) => d.id === docId);
    const linkedFilled = Boolean(doc && (currentValues[doc.linkedField] || '').trim().length > 0);
    if (linkedFilled) return;

    setManualDocsByForm((prev) => ({
      ...prev,
      [currentForm.id]: {
        ...(prev[currentForm.id] || {}),
        [docId]: checked,
      },
    }));
  };

  const handleResetCurrentForm = () => {
    setValuesByForm((prev) => ({ ...prev, [currentForm.id]: {} }));
    setManualDocsByForm((prev) => ({ ...prev, [currentForm.id]: {} }));
    setValidationErrors({});
    setShowGlobalError(false);
    setSavedNotice(false);
  };

  const handleSaveProgressNow = () => {
    saveJsonStorage(SAVED_ANSWERS_STORAGE_KEY, valuesByForm);
    saveJsonStorage(SAVED_DOCS_STORAGE_KEY, manualDocsByForm);
    persistCustomForms(formsDb);
    const payload = buildDraftPayload(currentForm, currentValues);
    saveJsonStorage(SYNCED_DRAFT_STORAGE_KEY, payload);
    window.postMessage({ type: 'SAHAYAK_SITE_SYNC_DRAFT', payload }, '*');
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleVerifyAndGenerateDraft = () => {
    const errors: Record<string, boolean> = {};
    let firstInvalidId: string | null = null;

    currentForm.fields.forEach((field) => {
      if (field.optional) return;
      const val = (currentValues[field.id] || '').trim();
      if (!val) {
        errors[field.id] = true;
        if (!firstInvalidId) firstInvalidId = field.id;
      }
    });

    if (firstInvalidId) {
      setValidationErrors(errors);
      setShowGlobalError(true);
      const firstEl = document.getElementById(`input_${firstInvalidId}`);
      if (firstEl) {
        firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstEl.focus();
      }
      return;
    }

    setValidationErrors({});
    setShowGlobalError(false);
    setDraftSyncedToExt(false);
    setIsDraftModalOpen(true);
  };

  const handleSyncDraftToExtension = () => {
    const payload = buildDraftPayload(currentForm, currentValues);
    saveJsonStorage(SYNCED_DRAFT_STORAGE_KEY, payload);
    saveJsonStorage(SAVED_ANSWERS_STORAGE_KEY, valuesByForm);
    window.postMessage({ type: 'SAHAYAK_SITE_SYNC_DRAFT', payload }, '*');
    setDraftSyncedToExt(true);
  };

  const handleRunQuickDemo = () => {
    setIsExtensionModalOpen(false);
    const cloned = JSON.parse(JSON.stringify(DEMO_CASTE_SCHEMA)) as FormSchema;
    registerExtractedForm(cloned, true);
  };

  const isCustomForm = !BUILTIN_FORMS[currentForm.id];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar — Clean 3-Zone Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" aria-hidden="true" />
            </span>
            <span>Sahayak AI</span>
          </a>

          {/* Zone 2: Concise Navigation Links + Bilingual Switch */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#guided-form"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navGuidedForm}
            </a>
            <a
              href="#document-checklist"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navChecklist}
            </a>
            <button
              type="button"
              onClick={() => setIsExtensionModalOpen(true)}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.navHowItWorks}
            </button>
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
              className="inline-flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Toggle language between English and Hindi"
            >
              <Languages className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.langToggleText}</span>
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0"
              aria-label="Toggle language"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
              <span>{t.langToggleText}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExtensionModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-xs sm:text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
            >
              <Puzzle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{extensionConnected ? t.extConnectedBtnText : t.extInstallBtnText}</span>
              {extensionConnected && (
                <span
                  className="w-2 h-2 rounded-full bg-emerald-300 shrink-0"
                  title="Extension Connected"
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Form Added & Saved Confirmation Banner */}
        {syncBanner && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <CheckCircle2
                className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5 sm:mt-0"
                aria-hidden="true"
              />
              <div className="text-xs sm:text-sm text-emerald-950 min-w-0">
                <p className="font-semibold">
                  {lang === 'hi'
                    ? `नया फॉर्म जोड़ा और सेव किया गया: ${syncBanner.titleHi} (${syncBanner.fieldCount} फ़ील्ड्स${
                        syncBanner.skippedDynamicCount
                          ? ` · ${syncBanner.skippedDynamicCount} CAPTCHA/डायनामिक फ़ील्ड छोड़े गए`
                          : ''
                      })`
                    : `Form added and saved: ${syncBanner.titleEn} (${syncBanner.fieldCount} fields${
                        syncBanner.skippedDynamicCount
                          ? ` · ${syncBanner.skippedDynamicCount} CAPTCHA/dynamic skipped`
                          : ''
                      })`}
                </p>
                {syncBanner.sourceUrl && (
                  <p className="text-xs text-emerald-800 font-mono mt-0.5 truncate">
                    {t.sourcePrefix}: {syncBanner.sourceUrl}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSyncBanner(null)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 self-end sm:self-center whitespace-nowrap shrink-0"
            >
              <span>{t.dismissLabel}</span>
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Service Header & Form Selector */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-emerald-800 mb-1.5">{t.trustLine}</p>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {t.pageTitle}
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                {t.pageDescPrefix}
                <span className="font-semibold text-slate-800 tabular-nums">
                  {currentForm.fields.length}
                </span>
                {t.pageDescSuffix}
              </p>
            </div>

            {/* Form Selector Dropdown + Add/Remove Controls */}
            <div className="w-full lg:w-[29rem] shrink-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label
                  htmlFor="formSelector"
                  className="block text-xs font-semibold text-slate-600"
                >
                  {t.formSelectorLabel}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddFormModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.addCustomFormBtn.replace(/^\+\s*/, '')}</span>
                  </button>
                  {isCustomForm && (
                    <button
                      type="button"
                      onClick={handleDeleteCustomForm}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t.deleteCustomFormBtn}</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="relative">
                <select
                  id="formSelector"
                  value={currentForm.id}
                  onChange={(e) => handleFormChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50 hover:bg-white px-3.5 py-2.5 pr-10 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  {Object.values(formsDb).map((schema) => (
                    <option key={schema.id} value={schema.id}>
                      {schema.name[lang] || schema.name.en}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Guided Question Flow */}
          <section
            id="guided-form"
            className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden scroll-mt-24"
          >
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.leftCardTitle}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t.leftCardSubtitlePrefix}
                  <span className="tabular-nums font-semibold">{currentForm.fields.length}</span>
                  {t.leftCardSubtitleSuffix}
                </p>
              </div>
              <span
                className={`text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 ${
                  filledFieldCount === currentForm.fields.length
                    ? 'text-emerald-700'
                    : 'text-indigo-700'
                }`}
              >
                {filledFieldCount} / {currentForm.fields.length} {t.filledSuffix}
              </span>
            </div>

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyAndGenerateDraft();
              }}
              className="p-5 sm:p-6 space-y-6"
            >
              <div className="space-y-6">
                {currentForm.fields.map((field) => {
                  const val = currentValues[field.id] || '';
                  const hasError = Boolean(validationErrors[field.id]);
                  const isExpanded = Boolean(expandedExplanations[field.id]);

                  const inputBorderClass = hasError
                    ? 'border-red-500 bg-red-50/40 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-300 bg-white focus:ring-indigo-500 focus:border-indigo-500';

                  return (
                    <div key={field.id} className="space-y-1.5">
                      {field.section && (
                        <div className="pt-2 pb-1.5 border-b border-slate-200 mb-3">
                          <span className="text-xs font-bold text-indigo-700">
                            {field.section[lang] || field.section.en}
                          </span>
                        </div>
                      )}

                      <label
                        htmlFor={`input_${field.id}`}
                        className="block text-sm font-semibold text-slate-800"
                      >
                        {field.label[lang] || field.label.en}{' '}
                        {field.optional ? (
                          <span className="text-xs font-normal text-slate-500 ml-1">
                            {t.optionalTag}
                          </span>
                        ) : (
                          <span className="text-red-600" aria-hidden="true">
                            *
                          </span>
                        )}
                      </label>

                      {field.type === 'select' && Array.isArray(field.options) ? (
                        <div className="relative">
                          <select
                            id={`input_${field.id}`}
                            value={val}
                            onChange={(e) => handleFieldInput(field.id, e.target.value)}
                            aria-invalid={hasError ? 'true' : 'false'}
                            className={`w-full appearance-none rounded-lg border ${inputBorderClass} px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 transition-colors cursor-pointer`}
                          >
                            <option value="">{t.selectPlaceholder}</option>
                            {field.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label[lang] || opt.label.en}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <input
                          id={`input_${field.id}`}
                          type={field.type || 'text'}
                          value={val}
                          placeholder={
                            (field.placeholder &&
                              (field.placeholder[lang] || field.placeholder.en)) ||
                            ''
                          }
                          onChange={(e) => handleFieldInput(field.id, e.target.value)}
                          aria-invalid={hasError ? 'true' : 'false'}
                          className={`w-full rounded-lg border ${inputBorderClass} px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors`}
                        />
                      )}

                      {hasError && (
                        <p className="text-xs font-semibold text-red-700 flex items-center gap-1.5 pt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{t.requiredError}</span>
                        </p>
                      )}

                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleToggleExplanation(field.id)}
                          aria-expanded={isExpanded}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{isExpanded ? t.hideExpBtn : t.simpleExpBtn}</span>
                        </button>

                        {isExpanded && (
                          <div className="mt-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs leading-relaxed text-amber-950">
                            {field.explanation[lang] || field.explanation.en}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Global Validation Alert */}
              {showGlobalError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-800 flex items-start gap-2.5"
                >
                  <AlertTriangle
                    className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{t.globalErrorText}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetCurrentForm}
                    className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {t.clearFormBtn}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProgressNow}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    {savedNotice ? (
                      <>
                        <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{t.savedProgressToast}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>{t.saveProgressBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.verifyBtnText}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Right Column: Live Document Checklist */}
          <aside
            id="document-checklist"
            className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden lg:sticky lg:top-24 scroll-mt-24"
          >
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.rightCardTitle}
                </h2>
                <span
                  className={`text-xs font-semibold tabular-nums whitespace-nowrap ${
                    readyDocCount === currentForm.documents.length
                      ? 'text-emerald-700'
                      : 'text-slate-700'
                  }`}
                >
                  {readyDocCount} / {currentForm.documents.length} {t.readySuffix}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{t.rightCardSubtitle}</p>

              {/* Progress Bar */}
              <div
                className="mt-3 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={checklistProgressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-emerald-600 transition-transform duration-300 origin-left"
                  style={{ transform: `scaleX(${checklistProgressPct / 100})` }}
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {currentForm.documents.map((doc) => {
                const linkedVal = (currentValues[doc.linkedField] || '').trim();
                const isAutoChecked = linkedVal.length > 0;
                const isManualChecked = Boolean(currentManualDocs[doc.id]);
                const isChecked = isAutoChecked || isManualChecked;

                const statusText = isAutoChecked
                  ? `✓ ${t.docStatusVerified}`
                  : isManualChecked
                    ? `✓ ${t.docStatusManual}`
                    : t.docStatusPending;

                const statusColor = isAutoChecked
                  ? 'text-emerald-700'
                  : isManualChecked
                    ? 'text-indigo-700'
                    : 'text-slate-500';

                return (
                  <label
                    key={doc.id}
                    htmlFor={`doc_${doc.id}`}
                    className={`flex items-start gap-3 px-5 sm:px-6 py-4 transition-colors cursor-pointer ${
                      isChecked ? 'bg-emerald-50/40' : 'bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <input
                      id={`doc_${doc.id}`}
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleManualDocToggle(doc.id, e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isChecked ? 'text-emerald-950' : 'text-slate-900'
                          }`}
                        >
                          {doc.title[lang] || doc.title.en}
                        </span>
                        <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {doc.desc[lang] || doc.desc.en}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p>{t.validatorTipText}</p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>{t.footerLeft}</span>
          <span>{t.footerRight}</span>
        </div>
      </footer>

      {/* Real Chrome Extension Download & Setup Modal */}
      <ExtensionModal
        isOpen={isExtensionModalOpen}
        lang={lang}
        extensionConnected={extensionConnected}
        onClose={() => setIsExtensionModalOpen(false)}
        onRunQuickDemo={handleRunQuickDemo}
      />

      {/* Add & Save Custom Form / Paste Extension JSON Modal */}
      <AddFormModal
        isOpen={isAddFormModalOpen}
        lang={lang}
        onClose={() => setIsAddFormModalOpen(false)}
        onSaveForm={(schema) => registerExtractedForm(schema, true)}
      />

      {/* Application Summary Draft Modal */}
      <DraftModal
        isOpen={isDraftModalOpen}
        lang={lang}
        formDef={currentForm}
        values={currentValues}
        manualDocs={currentManualDocs}
        syncedToExtension={draftSyncedToExt}
        onClose={() => setIsDraftModalOpen(false)}
        onSyncToExtension={handleSyncDraftToExtension}
      />
    </div>
  );
}
