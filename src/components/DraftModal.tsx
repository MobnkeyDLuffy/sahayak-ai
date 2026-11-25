import { useEffect } from 'react';
import { CheckCircle2, Printer, RefreshCw, X } from 'lucide-react';
import { UI_TEXT } from '../data/forms';
import type { FormSchema, Language } from '../types/sahayak';

interface DraftModalProps {
  isOpen: boolean;
  lang: Language;
  formDef: FormSchema;
  values: Record<string, string>;
  manualDocs: Record<string, boolean>;
  syncedToExtension: boolean;
  onClose: () => void;
  onSyncToExtension: () => void;
}

export function DraftModal({
  isOpen,
  lang,
  formDef,
  values,
  manualDocs,
  syncedToExtension,
  onClose,
  onSyncToExtension,
}: DraftModalProps) {
  const t = UI_TEXT[lang];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const nowStr = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const getDisplayValue = (fieldId: string) => {
    const field = formDef.fields.find((f) => f.id === fieldId);
    if (!field) return '';
    let val = (values[field.id] || '').trim();
    if (field.type === 'select' && val && field.options) {
      const matchedOpt = field.options.find((o) => o.value === val);
      if (matchedOpt) val = matchedOpt.label[lang] || matchedOpt.label.en;
    }
    if (!val && field.optional) {
      val = lang === 'hi' ? 'उपलब्ध नहीं (वैकल्पिक)' : 'Not Provided (Optional)';
    }
    return val;
  };

  return (
    <div
      id="draft-print-root"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="draft-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="draft-print-card"
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.modalVerifiedTag}</span>
            </p>
            <h3 id="draft-modal-title" className="text-lg font-bold text-slate-900 mt-0.5">
              {t.modalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="no-print p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close summary draft modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Metadata Summary Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <p className="text-xs font-medium text-slate-500">{t.draftFormLabel}</p>
              <p className="text-base font-bold text-indigo-700 mt-0.5">
                {formDef.name[lang] || formDef.name.en}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-medium text-slate-500">{t.draftGeneratedOn}</p>
              <p className="text-sm font-semibold text-slate-900 tabular-nums mt-0.5">{nowStr}</p>
            </div>
          </div>

          {/* Applicant Details Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2.5">{t.draftSectionApplicant}</h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <tbody>
                  {formDef.fields.map((field) => (
                    <tr
                      key={field.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="py-2.5 px-4 text-slate-600 font-medium align-top w-1/2">
                        {field.label[lang] || field.label.en}
                      </td>
                      <td className="py-2.5 px-4 text-slate-900 font-semibold align-top">
                        {getDisplayValue(field.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verified Document Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2.5">{t.draftSectionDocs}</h4>
            <ul className="border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white text-xs sm:text-sm">
              {formDef.documents.map((doc) => {
                const isReady =
                  (values[doc.linkedField] || '').trim().length > 0 || Boolean(manualDocs[doc.id]);
                return (
                  <li key={doc.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span className="text-slate-800 font-medium">
                      {doc.title[lang] || doc.title.en}
                    </span>
                    <span
                      className={`text-xs font-semibold whitespace-nowrap ${
                        isReady ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isReady ? `✓ ${t.draftReadyLabel}` : t.draftPendingLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
            {t.draftDisclaimer}
          </p>
        </div>

        {/* Footer */}
        <div className="no-print px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-3">
          {syncedToExtension && (
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.syncExtensionStatus}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {t.modalCloseBtn}
            </button>
            <button
              type="button"
              onClick={onSyncToExtension}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.modalSyncBtnText}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
            >
              <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.modalPrintBtnText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
