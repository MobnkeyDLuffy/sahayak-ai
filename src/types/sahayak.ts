export type Language = 'en' | 'hi';

export interface LocalizedText {
  en: string;
  hi: string;
}

export interface FormFieldOption {
  value: string;
  label: LocalizedText;
}

export interface FormField {
  id: string;
  selectorHint?: string;
  rawId?: string;
  rawName?: string;
  type: 'text' | 'date' | 'tel' | 'email' | 'number' | 'select';
  optional?: boolean;
  section?: LocalizedText;
  label: LocalizedText;
  placeholder?: LocalizedText;
  options?: FormFieldOption[];
  explanation: LocalizedText;
}

export interface DocumentRequirement {
  id: string;
  linkedField: string;
  title: LocalizedText;
  desc: LocalizedText;
}

export interface FormSchema {
  id: string;
  isCustom?: boolean;
  sourceUrl?: string;
  skippedDynamicCount?: number;
  name: LocalizedText;
  fields: FormField[];
  documents: DocumentRequirement[];
}

export interface SyncedDraftEntry {
  id: string;
  value: string;
  rawId?: string;
  rawName?: string;
  selectorHint?: string;
  labelEn: string;
  labelHi?: string;
  type: FormField['type'];
  index: number;
}

export interface SyncedDraftPayload {
  formId: string;
  formName: string;
  sourceUrl?: string;
  values: Record<string, string>;
  entries: SyncedDraftEntry[];
  syncedAt: string;
}
