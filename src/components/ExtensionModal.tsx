import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Download,
  Puzzle,
  Sparkles,
  X,
} from 'lucide-react';
import { LIVE_SITE_URL, UI_TEXT } from '../data/forms';
import type { Language } from '../types/sahayak';
import {
  downloadChromeExtensionZip,
  getChromeExtensionFiles,
} from '../utils/extensionBuilder';

interface ExtensionModalProps {
  isOpen: boolean;
  lang: Language;
  extensionConnected: boolean;
  onClose: () => void;
  onRunQuickDemo: () => void;
}

export function ExtensionModal({
  isOpen,
  lang,
  extensionConnected,
  onClose,
  onRunQuickDemo,
}: ExtensionModalProps) {
  const t = UI_TEXT[lang];
  const [targetMode, setTargetMode] = useState<'github' | 'current'>(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'mobnkeydluffy.github.io') {
      return 'github';
    }
    return 'current';
  });
  const [downloadState, setDownloadState] = useState<'idle' | 'building' | 'done' | 'error'>('idle');
  const [downloadError, setDownloadError] = useState<string>('');
  const [showFiles, setShowFiles] = useState<boolean>(false);
  const [activeFile, setActiveFile] = useState<string>('manifest.json');
  const [copiedFile, setCopiedFile] = useState<string>('');

  const currentOriginUrl = useMemo(() => {
    if (typeof window === 'undefined') return LIVE_SITE_URL;
    return `${window.location.origin}${window.location.pathname}`;
  }, []);

  const targetSiteUrl = targetMode === 'github' ? LIVE_SITE_URL : currentOriginUrl;
  const extensionFiles = useMemo(() => getChromeExtensionFiles(targetSiteUrl), [targetSiteUrl]);
  const fileNames = useMemo(() => Object.keys(extensionFiles), [extensionFiles]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setDownloadState('building');
    setDownloadError('');
    try {
      await downloadChromeExtensionZip(targetSiteUrl);
      setDownloadState('done');
      window.setTimeout(() => {
        setDownloadState('idle');
      }, 4500);
    } catch (err) {
      setDownloadState('error');
      setDownloadError(err instanceof Error ? err.message : 'Unable to generate extension package.');
    }
  };

  const handleCopyFile = async (fileName: string) => {
    try {
      await navigator.clipboard.writeText(extensionFiles[fileName]);
      setCopiedFile(fileName);
      window.setTimeout(() => setCopiedFile(''), 1800);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  const buttonLabel =
    downloadState === 'building'
      ? t.buildingExtZipText
      : downloadState === 'done'
        ? t.downloadedExtZipText
        : t.downloadExtZipText;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ext-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Puzzle className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 id="ext-modal-title" className="text-base font-bold text-white truncate">
                {t.extModalTitle}
              </h3>
              <p className="text-xs text-slate-300 truncate">{t.extModalSub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Close extension setup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Live Bridge Status */}
          <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
            {extensionConnected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5"
                aria-hidden="true"
              />
            )}
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
              {extensionConnected ? t.extConnectedLabel : t.extNotConnectedLabel}
            </p>
          </div>

          {/* Step 1: Package & Download */}
          <div className="space-y-3.5">
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t.extDownloadTitle}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.extDownloadDesc}</p>
            </div>

            {/* Return Destination Selector */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-700">
                {t.extTargetUrlLabel}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTargetMode('github')}
                  className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors text-left truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    targetMode === 'github'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.extTargetGithub}
                </button>
                <button
                  type="button"
                  onClick={() => setTargetMode('current')}
                  className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors text-left truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    targetMode === 'current'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.extTargetCurrent}
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-500 truncate">{targetSiteUrl}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={downloadState === 'building'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
              >
                <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{buttonLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFiles((prev) => !prev)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Code2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{showFiles ? t.extHideFilesBtn : t.extInspectFilesBtn}</span>
              </button>
            </div>

            {downloadState === 'error' && (
              <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {downloadError}
              </p>
            )}
          </div>

          {/* Expandable Source File Inspector */}
          {showFiles && (
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-950 text-slate-100">
              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800 overflow-x-auto">
                <div className="flex items-center gap-1">
                  {fileNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setActiveFile(name)}
                      className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                        activeFile === name
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyFile(activeFile)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  {copiedFile === activeFile ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-56 text-slate-200">
                <code>{extensionFiles[activeFile]}</code>
              </pre>
            </div>
          )}

          {/* Step 2: 3-Step Chrome Install Guide */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">{t.extGuideTitle}</h4>
            <ol className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="font-mono font-semibold text-indigo-700 tabular-nums shrink-0">01.</span>
                <span>{t.extGuide1}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-semibold text-indigo-700 tabular-nums shrink-0">02.</span>
                <span>{t.extGuide2}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-semibold text-indigo-700 tabular-nums shrink-0">03.</span>
                <span>{t.extGuide3}</span>
              </li>
            </ol>
          </div>

          {/* Quick Demo Fallback */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-600">{t.extDemoHint}</span>
            <button
              type="button"
              onClick={onRunQuickDemo}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{t.extQuickDemoBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
