import { useEffect, useState } from 'react';
import { FilePlus2, Plus, Trash2, Upload, X } from 'lucide-react';
import { UI_TEXT } from '../data/forms';
import type { FormField, FormSchema, Language } from '../types/sahayak';

interface AddFormModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onSaveForm: (schema: FormSchema) => void;
}

interface DraftFieldRow {
  key: string;
  label: string;
  type: FormField['type'];
  explanation: string;
  optional: boolean;
}

function makeDefaultRows(): DraftFieldRow[] {
  return [
    {
      key: 'row_1',
      label: '',
      type: 'text',
      explanation: '',
      optional: false,
    },
    {
      key: 'row_2',
      label: '',
      type: 'text',
      explanation: '',
      optional: false,
    },
  ];
}

export function AddFormModal({ isOpen, lang, onClose, onSaveForm }: AddFormModalProps) {
  const t = UI_TEXT[lang];
  const [tab, setTab] = useState<'manual' | 'import'>('manual');
  const [formName, setFormName] = useState<string>('');
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('');
  const [rows, setRows] = useState<DraftFieldRow[]>(makeDefaultRows);
  const [importText, setImportText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetFormState = () => {
    setFormName('');
    setSourceUrl('');
    setDocTitle('');
    setRows(makeDefaultRows());
    setImportText('');
    setErrorMsg('');
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        key: `row_${Date.now()}_${prev.length + 1}`,
        label: '',
        type: 'text',
        explanation: '',
        optional: false,
      },
    ]);
  };

  const handleUpdateRow = (key: string, patch: Partial<DraftFieldRow>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const handleRemoveRow = (key: string) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = formName.trim();
    if (!trimmedName) {
      setErrorMsg(t.addFormErrorName);
      return;
    }

    const validRows = rows.filter((r) => r.label.trim().length > 0);
    if (validRows.length === 0) {
      setErrorMsg(t.addFormErrorFields);
      return;
    }

    const fields: FormField[] = validRows.map((row, idx) => {
      const cleanLabel = row.label.trim();
      const fieldId = `custom_field_${idx + 1}_${cleanLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .slice(0, 20)}`;
      const cleanExp = row.explanation.trim();

      return {
        id: fieldId,
        type: row.type,
        optional: row.optional,
        label: {
          en: `${idx + 1}. ${cleanLabel}`,
          hi: `${idx + 1}. ${cleanLabel}`,
        },
        placeholder: {
          en: `Enter ${cleanLabel}`,
          hi: `${cleanLabel} दर्ज करें`,
        },
        explanation: {
          en:
            cleanExp ||
            `In simple words: Enter accurate details for "${cleanLabel}" matching your official ID records.`,
          hi:
            cleanExp ||
            `सरल शब्दों में: अपने आधिकारिक दस्तावेज़ के अनुसार "${cleanLabel}" की सही जानकारी भरें।`,
        },
      };
    });

    const trimmedDoc = docTitle.trim();
    const schema: FormSchema = {
      id: `custom_${Date.now().toString(36)}`,
      isCustom: true,
      sourceUrl: sourceUrl.trim() || undefined,
      name: {
        en: trimmedName,
        hi: trimmedName,
      },
      fields,
      documents: [
        {
          id: 'doc_primary',
          linkedField: fields[0].id,
          title: {
            en: trimmedDoc || 'Valid Government Photo ID (Aadhaar)',
            hi: trimmedDoc || 'वैध सरकारी फोटो पहचान पत्र (आधार)',
          },
          desc: {
            en: 'Keep the required supporting document ready before final submission.',
            hi: 'अंतिम सबमिशन से पहले आवश्यक दस्तावेज़ तैयार रखें।',
          },
        },
      ],
    };

    onSaveForm(schema);
    resetFormState();
    onClose();
  };

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const parsed = JSON.parse(importText.trim()) as Partial<FormSchema>;
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.fields) || parsed.fields.length === 0) {
        setErrorMsg(t.addFormErrorJson);
        return;
      }

      const normalizedName =
        typeof parsed.name === 'string'
          ? { en: parsed.name, hi: parsed.name }
          : {
              en: parsed.name?.en || 'Imported Scanned Form',
              hi: parsed.name?.hi || parsed.name?.en || 'इम्पोर्ट किया गया फॉर्म',
            };

      const normalizedFields: FormField[] = parsed.fields.map((f, idx) => ({
        id: f.id || `field_${idx + 1}`,
        rawId: f.rawId,
        rawName: f.rawName,
        selectorHint: f.selectorHint,
        type: f.type || 'text',
        optional: Boolean(f.optional),
        section: f.section,
        options: f.options,
        label:
          typeof f.label === 'string'
            ? { en: f.label, hi: f.label }
            : {
                en: f.label?.en || `${idx + 1}. Field ${idx + 1}`,
                hi: f.label?.hi || f.label?.en || `${idx + 1}. फ़ील्ड ${idx + 1}`,
              },
        placeholder: f.placeholder,
        explanation:
          typeof f.explanation === 'string'
            ? { en: f.explanation, hi: f.explanation }
            : {
                en: f.explanation?.en || 'Fill in accurate information as required by this form.',
                hi: f.explanation?.hi || f.explanation?.en || 'इस फॉर्म के अनुसार सही जानकारी दर्ज करें।',
              },
      }));

      const normalizedDocs =
        Array.isArray(parsed.documents) && parsed.documents.length > 0
          ? parsed.documents
          : [
              {
                id: 'primary_id',
                linkedField: normalizedFields[0].id,
                title: { en: 'Valid Government Photo ID', hi: 'वैध सरकारी फोटो पहचान पत्र' },
                desc: {
                  en: 'Keep your Aadhaar or official ID ready while submitting this portal form.',
                  hi: 'इस पोर्टल पर आवेदन करते समय आधार या आधिकारिक ID तैयार रखें।',
                },
              },
            ];

      const schema: FormSchema = {
        id: parsed.id || `ext_imported_${Date.now().toString(36)}`,
        isCustom: true,
        sourceUrl: parsed.sourceUrl,
        name: normalizedName,
        fields: normalizedFields,
        documents: normalizedDocs,
      };

      onSaveForm(schema);
      resetFormState();
      onClose();
    } catch {
      setErrorMsg(t.addFormErrorJson);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-form-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <FilePlus2 className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 id="add-form-modal-title" className="text-base font-bold text-white truncate">
                {t.addFormModalTitle}
              </h3>
              <p className="text-xs text-slate-300 truncate">{t.addFormModalSub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Close add form modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-200 bg-slate-50">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setTab('manual');
                setErrorMsg('');
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                tab === 'manual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.addFormTabManual}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('import');
                setErrorMsg('');
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                tab === 'import'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.addFormTabImport}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {errorMsg && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700"
            >
              {errorMsg}
            </div>
          )}

          {tab === 'manual' ? (
            <form id="manual-add-form" onSubmit={handleSaveManual} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="custom-form-name"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    {t.addFormNameLabel} <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="custom-form-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={t.addFormNamePlaceholder}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="custom-form-url"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    {t.addFormUrlLabel}
                  </label>
                  <input
                    id="custom-form-url"
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder={t.addFormUrlPlaceholder}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">{t.addFormFieldsHeading}</span>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.addFormAddFieldBtn}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {rows.map((row, idx) => (
                    <div
                      key={row.key}
                      className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums w-5 shrink-0">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={row.label}
                          onChange={(e) => handleUpdateRow(row.key, { label: e.target.value })}
                          placeholder={t.addFormFieldLabelPlaceholder}
                          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <select
                          value={row.type}
                          onChange={(e) =>
                            handleUpdateRow(row.key, {
                              type: e.target.value as FormField['type'],
                            })
                          }
                          aria-label={`Field ${idx + 1} type`}
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="text">Text</option>
                          <option value="date">Date</option>
                          <option value="tel">Phone</option>
                          <option value="email">Email</option>
                          <option value="number">Number</option>
                        </select>
                        {rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(row.key)}
                            className="p-1.5 rounded text-slate-400 hover:text-red-600 transition-colors"
                            aria-label={`Remove field ${idx + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="pl-7">
                        <input
                          type="text"
                          value={row.explanation}
                          onChange={(e) =>
                            handleUpdateRow(row.key, { explanation: e.target.value })
                          }
                          placeholder={t.addFormFieldExpPlaceholder}
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="custom-form-doc"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  {t.addFormDocLabel}
                </label>
                <input
                  id="custom-form-doc"
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder={t.addFormDocPlaceholder}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </form>
          ) : (
            <form id="import-json-form" onSubmit={handleImportJson} className="space-y-3">
              <label
                htmlFor="import-json-textarea"
                className="block text-xs font-semibold text-slate-700"
              >
                {t.addFormImportLabel}
              </label>
              <textarea
                id="import-json-textarea"
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={t.addFormImportPlaceholder}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors whitespace-nowrap"
          >
            {t.dismissLabel}
          </button>
          {tab === 'manual' ? (
            <button
              type="submit"
              form="manual-add-form"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <FilePlus2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.addFormSaveBtn}</span>
            </button>
          ) : (
            <button
              type="submit"
              form="import-json-form"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.addFormImportBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
