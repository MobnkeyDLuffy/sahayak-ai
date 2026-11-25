import JSZip from 'jszip';
import { LIVE_SITE_URL } from '../data/forms';
import type { FormField, FormSchema } from '../types/sahayak';

export const EPHEMERAL_FIELD_REGEX =
  /captcha|kaptcha|recaptcha|hcaptcha|turnstile|cf-turnstile|g-recaptcha|sec(urity)?[\s_-]*(code|text|pin|check)|verification[\s_-]*(code|pin|otp)|verify[\s_-]*(code|otp)|enter[\s_-]*(the[\s_-]*)?(code|characters|letters|captcha|text[\s_-]*shown|image[\s_-]*text|above[\s_-]*code|below[\s_-]*code|otp)|type[\s_-]*(the[\s_-]*)?(characters|text|code)|human[\s_-]*verification|math[\s_-]*(captcha|answer|question)|solve[\s_-]*(this|captcha)|\botp\b|one[\s_-]*time[\s_-]*(pass|pin|code)|sms[\s_-]*(code|otp)|email[\s_-]*(code|otp)|mobile[\s_-]*otp|aadhaar[\s_-]*otp|auth[\s_-]*code|2fa|mfa|totp|password|passwd|\bpwd\b|passcode|mpin|tpin|login[\s_-]*pin|confirm[\s_-]*pass|csrf|xsrf|__viewstate|__eventvalidation|__requestverificationtoken|nonce|session[\s_-]*id|\btoken\b|timestamp|honeypot|कैप्चा|सुरक्षा कोड|ओटीपी|पासवर्ड/i;

export function isEphemeralOrCaptchaFieldDef(field: Partial<FormField>): boolean {
  const idStr = String(field.id || '');
  const rawIdStr = String(field.rawId || '');
  const rawNameStr = String(field.rawName || '');
  const labelEn = typeof field.label === 'string' ? field.label : String(field.label?.en || '');
  const labelHi = typeof field.label === 'string' ? field.label : String(field.label?.hi || '');
  const hint = String(field.selectorHint || '');
  const combined = `${idStr} ${rawIdStr} ${rawNameStr} ${labelEn} ${labelHi} ${hint}`;
  return EPHEMERAL_FIELD_REGEX.test(combined);
}

export function sanitizeImportedSchema(schema: FormSchema): FormSchema {
  if (!schema || !Array.isArray(schema.fields)) return schema;
  const keptFields: FormField[] = [];
  let filteredHere = 0;

  schema.fields.forEach((field) => {
    if (isEphemeralOrCaptchaFieldDef(field)) {
      filteredHere += 1;
    } else {
      keptFields.push(field);
    }
  });

  if (keptFields.length === 0) {
    return schema;
  }

  const renumbered = keptFields.map((field, idx) => {
    const stripNum = (s: string) => s.replace(/^\d+\.\s*/, '');
    return {
      ...field,
      label: {
        en: `${idx + 1}. ${stripNum(field.label.en)}`,
        hi: `${idx + 1}. ${stripNum(field.label.hi || field.label.en)}`,
      },
    };
  });

  const keptIds = new Set(renumbered.map((f) => f.id));
  const cleanedDocs = (schema.documents || []).map((doc) =>
    keptIds.has(doc.linkedField) ? doc : { ...doc, linkedField: renumbered[0].id }
  );

  return {
    ...schema,
    fields: renumbered,
    documents: cleanedDocs,
    skippedDynamicCount: (schema.skippedDynamicCount || 0) + filteredHere,
  };
}

export function decodeSchemaBase64(str: string): FormSchema {
  let clean = str.trim();
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // Already decoded
  }
  let b64 = clean.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as FormSchema;
}

export function getChromeExtensionFiles(targetSiteUrl: string = LIVE_SITE_URL): Record<string, string> {
  const normalizedTarget = targetSiteUrl.endsWith('/') ? targetSiteUrl : `${targetSiteUrl}/`;
  let targetOriginPattern = 'https://mobnkeydluffy.github.io/*';
  let targetMatchPattern = 'https://mobnkeydluffy.github.io/sahayak-form-ai/*';

  try {
    const parsed = new URL(normalizedTarget);
    targetOriginPattern = `${parsed.origin}/*`;
    targetMatchPattern = `${parsed.origin}/*`;
  } catch {
    // Keep default GitHub Pages patterns
  }

  const hostPermissions = Array.from(
    new Set([
      'https://mobnkeydluffy.github.io/*',
      'https://*.run.app/*',
      targetOriginPattern,
    ])
  );

  const contentScriptMatches = Array.from(
    new Set([
      'https://mobnkeydluffy.github.io/sahayak-form-ai/*',
      'https://*.run.app/*',
      targetMatchPattern,
      'http://localhost/*',
      'http://127.0.0.1/*',
    ])
  );

  const displayHost = normalizedTarget.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const manifestJson = JSON.stringify(
    {
      manifest_version: 3,
      name: 'Sahayak Form AI — Live Website Form Scanner',
      version: '1.3.0',
      description:
        'Scan any website form (auto-skipping CAPTCHA, OTP, passwords & dynamic fields), save to Sahayak AI, and reliably 1-click autofill React, iframe & government portals.',
      permissions: ['activeTab', 'scripting', 'storage'],
      host_permissions: hostPermissions,
      action: {
        default_popup: 'popup.html',
        default_title: 'Sahayak Form AI Scanner',
      },
      content_scripts: [
        {
          matches: contentScriptMatches,
          js: ['bridge.js'],
          run_at: 'document_idle',
        },
      ],
    },
    null,
    2
  );

  const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Sahayak Form AI Extension</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 368px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }
    .header {
      background: #0f172a;
      color: #fff;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand { font-weight: 700; font-size: 14px; letter-spacing: -0.01em; }
    .meta { font-size: 11px; color: #94a3b8; }
    .body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
    .site-box {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 12px;
    }
    .site-title { font-weight: 600; color: #0f172a; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .site-url { color: #64748b; font-size: 11px; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .filter-note {
      font-size: 11px;
      color: #475569;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 10px;
      line-height: 1.4;
    }
    .draft-pill {
      font-size: 11px;
      color: #065f46;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 8px;
      padding: 8px 10px;
      line-height: 1.4;
    }
    .draft-pill.empty {
      color: #64748b;
      background: #fff;
      border-color: #e2e8f0;
    }
    .btn {
      width: 100%;
      padding: 10px 14px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: background-color 0.15s ease, opacity 0.15s ease;
    }
    .btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-emerald { background: #059669; color: #fff; }
    .btn-emerald:hover:not(:disabled) { background: #047857; }
    .btn-dark { background: #0f172a; color: #fff; }
    .btn-dark:hover:not(:disabled) { background: #1e293b; }
    .btn-outline { background: #fff; color: #1e293b; border: 1px solid #cbd5e1; }
    .btn-outline:hover:not(:disabled) { background: #f1f5f9; }
    .status {
      font-size: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #312e81;
      line-height: 1.45;
      display: none;
    }
    .status.show { display: block; }
    .status.ok { background: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
    .status.err { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
    .divider { height: 1px; background: #e2e8f0; margin: 2px 0; }
    .small { font-size: 11px; color: #64748b; text-align: center; word-break: break-all; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Sahayak Form AI</div>
    <span class="meta">MV3 v1.3</span>
  </div>
  <div class="body">
    <div class="site-box">
      <div class="site-title" id="siteTitle">Detecting active webpage...</div>
      <div class="site-url" id="siteUrl"></div>
    </div>

    <div class="filter-note">
      Smart Filter ON: Automatically skips CAPTCHA, OTP, passwords, search boxes, CSRF tokens, and temporary dynamic fields.
    </div>

    <button id="scanBtn" class="btn btn-primary">1. Scan This Website's Form</button>
    <div id="statusBox" class="status"></div>
    <button id="sendBtn" class="btn btn-emerald" disabled>2. Add Form &amp; Open in Sahayak AI ↗</button>
    <button id="copyJsonBtn" class="btn btn-outline" disabled>Copy Scanned Form JSON (Manual Import)</button>

    <div class="divider"></div>
    <div id="draftInfo" class="draft-pill empty">Checking synced draft...</div>
    <button id="autofillBtn" class="btn btn-dark">Autofill Synced Draft onto This Page</button>
    <div class="small">Linked to: ${displayHost}</div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`;

  const contentJs = `// Sahayak Form AI — Live Webpage Form Scanner, Smart Anti-CAPTCHA Filter & React-Safe Autofiller (v1.3)
(function () {
  function cleanText(str) {
    return (str || "").replace(/\\s+/g, " ").replace(/\\*/g, "").trim();
  }

  function normalizeForMatch(str) {
    return cleanText(str)
      .replace(/^\\d+\\.\\s*/, "")
      .toLowerCase()
      .replace(/[^a-z0-9\\s]/g, " ")
      .replace(/\\s+/g, " ")
      .trim();
  }

  function prettifyName(raw) {
    return cleanText(
      (raw || "Field")
        .replace(/[_\\-]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\\b\\w/g, (c) => c.toUpperCase())
    );
  }

  function findLabelForElement(el) {
    if (el.id) {
      const explicit = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
      if (explicit && cleanText(explicit.innerText)) return cleanText(explicit.innerText);
    }
    const parentLabel = el.closest("label");
    if (parentLabel && cleanText(parentLabel.innerText)) return cleanText(parentLabel.innerText);

    if (el.getAttribute("aria-label")) return cleanText(el.getAttribute("aria-label"));

    const labelledBy = el.getAttribute("aria-labelledby");
    if (labelledBy) {
      const ids = labelledBy.split(/\\s+/);
      const parts = ids
        .map((id) => {
          const ref = document.getElementById(id);
          return ref ? cleanText(ref.innerText) : "";
        })
        .filter(Boolean);
      if (parts.length) return parts.join(" ");
    }

    // Google Forms / modern card-based question headings
    const questionBox = el.closest('[role="listitem"], .form-group, .field-wrapper, .form-field');
    if (questionBox) {
      const heading = questionBox.querySelector('[role="heading"], label, .form-label, legend');
      if (heading && cleanText(heading.innerText) && cleanText(heading.innerText).length <= 120) {
        return cleanText(heading.innerText);
      }
    }

    const td = el.closest("td");
    if (td && td.previousElementSibling && cleanText(td.previousElementSibling.innerText)) {
      const t = cleanText(td.previousElementSibling.innerText);
      if (t.length <= 90) return t;
    }

    const prev = el.previousElementSibling;
    if (prev && cleanText(prev.innerText) && cleanText(prev.innerText).length <= 90) {
      return cleanText(prev.innerText);
    }

    if (el.placeholder) return cleanText(el.placeholder);
    if (el.name) return prettifyName(el.name);
    if (el.id) return prettifyName(el.id);
    return "Form Field";
  }

  const CAPTCHA_OR_EPHEMERAL_REGEX =
    /captcha|kaptcha|recaptcha|hcaptcha|turnstile|cf-turnstile|g-recaptcha|sec(urity)?[\\s_-]*(code|text|pin|check|img)|verification[\\s_-]*(code|pin|otp)|verify[\\s_-]*(code|otp|text|image)|enter[\\s_-]*(the[\\s_-]*)?(code|characters|letters|captcha|text[\\s_-]*shown|image[\\s_-]*text|above[\\s_-]*code|below[\\s_-]*code|otp)|type[\\s_-]*(the[\\s_-]*)?(characters|text|code)|human[\\s_-]*verification|math[\\s_-]*(captcha|answer|question)|solve[\\s_-]*(this|captcha)|\\botp\\b|one[\\s_-]*time[\\s_-]*(pass|pin|code)|sms[\\s_-]*(code|otp)|email[\\s_-]*(code|otp)|mobile[\\s_-]*otp|aadhaar[\\s_-]*otp|auth[\\s_-]*code|2fa|mfa|totp|password|passwd|\\bpwd\\b|passcode|mpin|tpin|login[\\s_-]*pin|confirm[\\s_-]*pass|csrf|xsrf|__viewstate|__eventvalidation|__requestverificationtoken|nonce|session[\\s_-]*id|\\btoken\\b|timestamp|honeypot|rand(om)?[\\s_-]*(id|key|code)|refresh[\\s_-]*(code|captcha)|reload[\\s_-]*(code|captcha)|कैप्चा|सुरक्षा कोड|ओटीपी|पासवर्ड/i;

  const SEARCH_FIELD_REGEX =
    /^search\\b|search[\\s_-]*(site|here|menu|portal|box|query|bar|input)|filter[\\s_-]*(table|list|results)|खोजें/i;

  const RANDOM_HASH_ID_REGEX =
    /^(?:[0-9a-f]{12,}|[a-z0-9]{16,}|(?:field|input|txt|el)[_-]?\\d{6,}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

  function hasNearbyCaptchaWidget(el) {
    if (
      el.closest(
        '[class*="captcha" i], [id*="captcha" i], [class*="kaptcha" i], [id*="kaptcha" i], .g-recaptcha, .h-captcha, .cf-turnstile, [data-captcha], [data-otp]'
      )
    ) {
      return true;
    }

    const container = el.closest("tr, .form-group, .form-row, .input-group, .field-row, p, li") || el.parentElement;
    if (container && container.querySelectorAll("input, select, textarea").length <= 3) {
      const imgs = container.querySelectorAll("img, canvas");
      for (const img of imgs) {
        const imgSig = [
          img.getAttribute("src") || "",
          img.getAttribute("id") || "",
          img.getAttribute("alt") || "",
          img.getAttribute("class") || "",
          img.getAttribute("title") || ""
        ].join(" ");
        if (/captcha|kaptcha|verify|sec(urity)?|code|refresh/i.test(imgSig)) {
          return true;
        }
      }

      const buttons = container.querySelectorAll("button, a, span[onclick], img[onclick]");
      for (const btn of buttons) {
        const btnSig = [
          cleanText(btn.innerText),
          btn.getAttribute("title") || "",
          btn.getAttribute("aria-label") || "",
          btn.getAttribute("id") || "",
          btn.getAttribute("class") || "",
          btn.getAttribute("onclick") || ""
        ].join(" ");
        if (/refresh[\\s_-]*(captcha|code|img)?|reload[\\s_-]*(captcha|code)|new[\\s_-]*captcha|regenerate|resend[\\s_-]*otp|send[\\s_-]*otp/i.test(btnSig)) {
          return true;
        }
      }
    }
    return false;
  }

  function shouldSkipDynamicOrSecurityField(el, rawLabel) {
    const tag = el.tagName.toLowerCase();
    const type = tag === "input" ? (el.type || "text").toLowerCase() : tag;

    if (
      ["hidden", "submit", "button", "reset", "image", "file", "checkbox", "radio", "password", "search"].includes(type)
    ) {
      return true;
    }
    if (el.disabled || el.readOnly) return true;

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
      return true;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return true;
    if (el.getAttribute("aria-hidden") === "true" || el.tabIndex === -1) return true;

    const ac = (el.getAttribute("autocomplete") || "").toLowerCase();
    if (["one-time-code", "current-password", "new-password"].includes(ac)) {
      return true;
    }

    if (el.getAttribute("role") === "searchbox" || el.closest('header, nav, footer, [role="search"]')) {
      return true;
    }

    const sig = [
      rawLabel || "",
      el.id || "",
      el.name || "",
      el.placeholder || "",
      el.getAttribute("aria-label") || "",
      el.getAttribute("title") || "",
      typeof el.className === "string" ? el.className : ""
    ].join(" ");

    if (CAPTCHA_OR_EPHEMERAL_REGEX.test(sig)) return true;
    if (SEARCH_FIELD_REGEX.test(sig)) return true;
    if (hasNearbyCaptchaWidget(el)) return true;

    if (tag === "input" && el.maxLength === 1 && ["text", "tel", "number"].includes(type)) {
      return true;
    }

    const rawIdOrName = (el.id || el.name || "").trim();
    const hasHumanLabel = Boolean(rawLabel && rawLabel !== "Form Field" && !RANDOM_HASH_ID_REGEX.test(rawLabel));
    if (!hasHumanLabel && rawIdOrName && RANDOM_HASH_ID_REGEX.test(rawIdOrName)) {
      return true;
    }

    return false;
  }

  function getFillableElements() {
    const allCandidates = Array.from(document.querySelectorAll("input, select, textarea"));
    const kept = [];
    let skippedDynamicCount = 0;

    for (const el of allCandidates) {
      const tag = el.tagName.toLowerCase();
      const type = tag === "input" ? (el.type || "text").toLowerCase() : tag;

      if (["hidden", "submit", "button", "reset", "image", "file", "checkbox", "radio"].includes(type)) {
        continue;
      }

      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;

      const rawLabel = findLabelForElement(el).slice(0, 100);
      if (shouldSkipDynamicOrSecurityField(el, rawLabel)) {
        skippedDynamicCount++;
        continue;
      }

      kept.push({ el, rawLabel });
    }

    return { kept, skippedDynamicCount };
  }

  function buildBilingualMeta(rawLabel) {
    const l = rawLabel.toLowerCase();
    const rules = [
      {
        match: /aadhaar|aadhar|uid/,
        hi: "आधार संख्या / पहचान विवरण (" + rawLabel + ")",
        expEn: "In simple words: Enter your 12-digit Aadhaar number exactly as printed on your Aadhaar card for e-KYC verification.",
        expHi: "सरल शब्दों में: e-KYC सत्यापन के लिए अपना 12-अंकों का आधार नंबर बिल्कुल सही दर्ज करें।",
        doc: { id: "aadhaar", titleEn: "Aadhaar Card", titleHi: "आधार कार्ड", descEn: "Valid 12-digit Aadhaar Card linked with active mobile number.", descHi: "सक्रिय मोबाइल नंबर से जुड़ा वैध आधार कार्ड।" }
      },
      {
        match: /father|husband|guardian|parent/,
        hi: "पिता / पति / अभिभावक का नाम (" + rawLabel + ")",
        expEn: "In simple words: Enter your father's, husband's, or legal guardian's full name matching official ID records.",
        expHi: "सरल शब्दों में: सरकारी पहचान पत्र के अनुसार पिता, पति या अभिभावक का पूरा नाम लिखें।"
      },
      {
        match: /mother/,
        hi: "माता का नाम (" + rawLabel + ")",
        expEn: "In simple words: Enter your mother's full legal name as printed on family or school records.",
        expHi: "सरल शब्दों में: पारिवारिक या स्कूल रिकॉर्ड के अनुसार माता का पूरा नाम दर्ज करें।"
      },
      {
        match: /name|applicant|candidate|student|user/,
        hi: "आवेदक का पूरा नाम (" + rawLabel + ")",
        expEn: "In simple words: Enter your full name exactly as written on your official ID / Aadhaar to prevent spelling mismatches.",
        expHi: "सरल शब्दों में: वर्तनी की गलती से बचने के लिए आधार / आधिकारिक ID के अनुसार अपना पूरा नाम लिखें।",
        doc: { id: "id_proof", titleEn: "Photo ID Proof (Aadhaar / Voter ID)", titleHi: "फोटो पहचान पत्र (आधार / वोटर ID)", descEn: "Government-issued identity document matching applicant name.", descHi: "आवेदक के नाम से मेल खाता सरकारी पहचान पत्र।" }
      },
      {
        match: /dob|birth|age/,
        hi: "जन्म तिथि (" + rawLabel + ")",
        expEn: "In simple words: Select your date of birth matching your Class 10 certificate or Aadhaar Card.",
        expHi: "सरल शब्दों में: कक्षा 10 के प्रमाण पत्र या आधार कार्ड के अनुसार जन्म तिथि चुनें।"
      },
      {
        match: /gender|sex/,
        hi: "लिंग (" + rawLabel + ")",
        expEn: "In simple words: Choose your gender category for official demographic records.",
        expHi: "सरल शब्दों में: आधिकारिक रिकॉर्ड के लिए सही लिंग विकल्प चुनें।"
      },
      {
        match: /mobile|phone|tel|contact/,
        hi: "मोबाइल नंबर (" + rawLabel + ")",
        expEn: "In simple words: Provide an active 10-digit mobile number to receive OTPs and status SMS alerts.",
        expHi: "सरल शब्दों में: OTP और आवेदन स्थिति SMS पाने के लिए सक्रिय 10-अंकों का मोबाइल नंबर लिखें।"
      },
      {
        match: /email|e-mail|mail/,
        hi: "ईमेल पता (" + rawLabel + ")",
        expEn: "In simple words: Enter an active email address where confirmation receipts and PDF copies can be sent.",
        expHi: "सरल शब्दों में: रसीद और PDF कॉपी प्राप्त करने के लिए अपना सक्रिय ईमेल पता दर्ज करें।"
      },
      {
        match: /income|salary|earning|annual/,
        hi: "वार्षिक पारिवारिक आय (" + rawLabel + ")",
        expEn: "In simple words: Enter total yearly family income from all sources as stated on your Tehsil Income Certificate.",
        expHi: "सरल शब्दों में: तहसील के आय प्रमाण पत्र के अनुसार परिवार की कुल वार्षिक आय दर्ज करें।",
        doc: { id: "income_cert", titleEn: "Income Certificate", titleHi: "आय प्रमाण पत्र", descEn: "Valid family income proof issued by Tehsildar / revenue authority.", descHi: "तहसीलदार द्वारा जारी वैध पारिवारिक आय प्रमाण पत्र।" }
      },
      {
        match: /caste|category|obc|sc|st|tribe/,
        hi: "जाति / श्रेणी विवरण (" + rawLabel + ")",
        expEn: "In simple words: Enter your recognized caste category / sub-caste as listed in official state records.",
        expHi: "सरल शब्दों में: राज्य की आधिकारिक सूची के अनुसार अपनी जाति / वर्ग की जानकारी दर्ज करें।",
        doc: { id: "caste_cert", titleEn: "Caste / Revenue Proof", titleHi: "जाति / राजस्व प्रमाण पत्र", descEn: "Caste certificate or Patwari / revenue verification report.", descHi: "जाति प्रमाण पत्र या पटवारी सत्यापन रिपोर्ट।" }
      },
      {
        match: /bank|ifsc|account|passbook/,
        hi: "बैंक खाता / IFSC विवरण (" + rawLabel + ")",
        expEn: "In simple words: Enter your Aadhaar-linked bank account & IFSC code from the front page of your passbook.",
        expHi: "सरल शब्दों में: अपनी पासबुक के पहले पन्ने से आधार-लिंक बैंक खाता नंबर और IFSC कोड लिखें।",
        doc: { id: "bank_doc", titleEn: "Bank Passbook Front Page", titleHi: "बैंक पासबुक का प्रथम पृष्ठ", descEn: "Passbook copy clearly showing account number & IFSC code.", descHi: "खाता संख्या और IFSC कोड दिखाने वाली पासबुक की प्रति।" }
      },
      {
        match: /address|village|tehsil|district|city|state|pin|zip|domicile|residence/,
        hi: "स्थायी पता / निवास विवरण (" + rawLabel + ")",
        expEn: "In simple words: Enter your complete permanent residential address (House/Village, Tehsil, District, PIN).",
        expHi: "सरल शब्दों में: अपना पूरा स्थायी पता (ग्राम/वार्ड, तहसील, जिला, पिन कोड) सही-सही लिखें।",
        doc: { id: "address_proof", titleEn: "Residence / Domicile Proof", titleHi: "निवास / पता प्रमाण पत्र", descEn: "Domicile certificate, Ration Card, Parivar Register, or Electricity Bill.", descHi: "स्थायी निवास प्रमाण पत्र, राशन कार्ड या बिजली बिल।" }
      },
      {
        match: /school|college|university|course|class|roll|degree|education|marks/,
        hi: "शिक्षा / कॉलेज विवरण (" + rawLabel + ")",
        expEn: "In simple words: Enter your current school/college name, course, or academic details exactly as on your marksheet/ID.",
        expHi: "सरल शब्दों में: अपनी मार्कशीट या छात्र ID के अनुसार स्कूल/कॉलेज और कोर्स का विवरण भरें।",
        doc: { id: "edu_doc", titleEn: "Marksheet / Student ID", titleHi: "अंकतालिका / छात्र पहचान पत्र", descEn: "Latest academic marksheet or bonafide college ID proof.", descHi: "नवीनतम अंकतालिका या कॉलेज बोनाफाइड प्रमाण।" }
      }
    ];

    for (const r of rules) {
      if (r.match.test(l)) {
        return {
          labelHi: r.hi,
          expEn: r.expEn,
          expHi: r.expHi,
          doc: r.doc || null
        };
      }
    }

    return {
      labelHi: rawLabel + " (विवरण दर्ज करें)",
      expEn: 'In simple words: Fill in accurate information for "' + rawLabel + '" as required by this portal.',
      expHi: 'सरल शब्दों में: इस पोर्टल की आवश्यकता के अनुसार "' + rawLabel + '" की सही जानकारी भरें।',
      doc: null
    };
  }

  window.__SAHAYAK_SCAN_PAGE__ = function () {
    const { kept: keptElements, skippedDynamicCount } = getFillableElements();

    const fields = [];
    const docsMap = {};
    const usedIds = new Set();

    keptElements.slice(0, 22).forEach(({ el, rawLabel }, idx) => {
      let baseId = (el.name || el.id || "field_" + (idx + 1))
        .replace(/[^a-zA-Z0-9_]/g, "_")
        .slice(0, 32);
      if (!baseId || usedIds.has(baseId) || RANDOM_HASH_ID_REGEX.test(baseId)) {
        baseId = "field_" + (idx + 1);
      }
      usedIds.add(baseId);

      const tag = el.tagName.toLowerCase();
      let fieldType = "text";
      let options = null;

      if (tag === "select") {
        fieldType = "select";
        options = Array.from(el.options)
          .filter((o) => cleanText(o.text) && o.value !== "")
          .slice(0, 20)
          .map((o) => ({
            value: o.value,
            label: { en: cleanText(o.text), hi: cleanText(o.text) }
          }));
        if (!options.length) fieldType = "text";
      } else if (tag === "input") {
        const t = (el.type || "text").toLowerCase();
        if (["date", "email", "tel", "number"].includes(t)) fieldType = t;
      }

      const meta = buildBilingualMeta(rawLabel);
      const numPrefix = (idx + 1) + ". ";

      const fieldObj = {
        id: baseId,
        rawId: el.id || "",
        rawName: el.name || "",
        selectorHint: el.id
          ? "#" + CSS.escape(el.id)
          : el.name
            ? '[name="' + CSS.escape(el.name) + '"]'
            : "",
        type: fieldType,
        optional: false,
        label: {
          en: numPrefix + rawLabel,
          hi: numPrefix + meta.labelHi
        },
        placeholder: {
          en: el.placeholder ? cleanText(el.placeholder) : "Enter " + rawLabel,
          hi: el.placeholder ? cleanText(el.placeholder) : rawLabel + " दर्ज करें"
        },
        explanation: {
          en: meta.expEn,
          hi: meta.expHi
        }
      };

      if (options) fieldObj.options = options;
      fields.push(fieldObj);

      if (meta.doc && !docsMap[meta.doc.id]) {
        docsMap[meta.doc.id] = {
          id: meta.doc.id,
          linkedField: baseId,
          title: { en: meta.doc.titleEn, hi: meta.doc.titleHi },
          desc: { en: meta.doc.descEn, hi: meta.doc.descHi }
        };
      }
    });

    const documents = Object.values(docsMap);
    if (documents.length === 0 && fields.length > 0) {
      documents.push({
        id: "primary_id",
        linkedField: fields[0].id,
        title: { en: "Valid Government Photo ID", hi: "वैध सरकारी फोटो पहचान पत्र" },
        desc: { en: "Keep your Aadhaar or official ID ready while submitting this portal form.", hi: "इस पोर्टल पर आवेदन करते समय आधार या आधिकारिक ID तैयार रखें।" }
      });
    }

    const host = window.location.hostname.replace(/^www\\./, "") || "local-form";
    const pageName = cleanText(document.title).slice(0, 48) || host;
    const schemaId = "ext_" + host.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 24) + "_" + Date.now().toString(36);

    return {
      id: schemaId,
      isCustom: true,
      sourceUrl: window.location.href,
      skippedDynamicCount,
      name: {
        en: pageName + " (" + host + ") — Extension",
        hi: pageName + " (" + host + ") — एक्सटेंशन"
      },
      fields,
      documents
    };
  };

  // React / Vue / Angular / Vanilla-compatible value setter with visual highlight
  function setNativeFieldValue(el, rawVal) {
    const tag = el.tagName.toLowerCase();
    const val = String(rawVal);

    if (tag === "select") {
      const options = Array.from(el.options || []);
      const lowerVal = val.trim().toLowerCase();
      let matched =
        options.find((o) => o.value === val) ||
        options.find((o) => o.value.trim().toLowerCase() === lowerVal) ||
        options.find((o) => cleanText(o.text).toLowerCase() === lowerVal) ||
        options.find((o) => cleanText(o.text).toLowerCase().includes(lowerVal) || lowerVal.includes(cleanText(o.text).toLowerCase()));

      if (!matched) return false;

      const protoDesc = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value");
      if (protoDesc && protoDesc.set) {
        protoDesc.set.call(el, matched.value);
      } else {
        el.value = matched.value;
      }
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
    } else {
      const proto =
        tag === "textarea"
          ? window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement.prototype;
      const protoDesc = Object.getOwnPropertyDescriptor(proto, "value");

      el.focus({ preventScroll: true });
      if (protoDesc && protoDesc.set) {
        protoDesc.set.call(el, val);
      } else {
        el.value = val;
      }

      // Reset React's internal value tracker if present
      if (el._valueTracker && typeof el._valueTracker.setValue === "function") {
        el._valueTracker.setValue("");
      }

      try {
        el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: val }));
      } catch {
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
      el.dispatchEvent(new Event("change", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
    }

    // Brief visual confirmation outline so user sees which fields autofilled
    const prevOutline = el.style.outline;
    const prevBg = el.style.backgroundColor;
    el.style.outline = "2px solid #10b981";
    el.style.backgroundColor = "#ecfdf5";
    window.setTimeout(() => {
      el.style.outline = prevOutline;
      el.style.backgroundColor = prevBg;
    }, 1800);

    return true;
  }

  // Semantic match groups so even built-in Sahayak forms autofill external portals
  const SEMANTIC_BUCKETS = [
    { key: "aadhaar", rx: /aadhaar|aadhar|\\buid\\b/i },
    { key: "father", rx: /father|husband|guardian|parent/i },
    { key: "mother", rx: /mother/i },
    { key: "fullname", rx: /full[\\s_-]*name|applicant[\\s_-]*name|candidate[\\s_-]*name|student[\\s_-]*name|\\bname\\b/i },
    { key: "dob", rx: /\\bdob\\b|date[\\s_-]*of[\\s_-]*birth|birth[\\s_-]*date/i },
    { key: "gender", rx: /gender|\\bsex\\b/i },
    { key: "mobile", rx: /mobile|phone|contact|\\btel\\b/i },
    { key: "email", rx: /email|e-mail/i },
    { key: "income", rx: /income|annual[\\s_-]*family|salary/i },
    { key: "subcaste", rx: /sub[\\s_-]*caste|community/i },
    { key: "caste", rx: /caste|category/i },
    { key: "bank", rx: /bank|ifsc|account[\\s_-]*no|passbook/i },
    { key: "college", rx: /college|school|institute|university|course/i },
    { key: "address", rx: /address|domicile|village|tehsil|district|residence/i },
    { key: "purpose", rx: /purpose|reason/i }
  ];

  function detectSemanticBucket(text) {
    const s = String(text || "");
    for (const b of SEMANTIC_BUCKETS) {
      if (b.rx.test(s)) return b.key;
    }
    return null;
  }

  window.__SAHAYAK_AUTOFILL_PAGE__ = function (draftPayloadOrValues) {
    if (!draftPayloadOrValues || typeof draftPayloadOrValues !== "object") return 0;

    // Normalize both rich SyncedDraftPayload ({ entries, values, sourceUrl }) and legacy plain values map
    let entries = [];
    let sourceHost = "";
    if (Array.isArray(draftPayloadOrValues.entries) && draftPayloadOrValues.entries.length) {
      entries = draftPayloadOrValues.entries.filter((e) => e && String(e.value || "").trim().length > 0);
      if (draftPayloadOrValues.sourceUrl) {
        try {
          sourceHost = new URL(draftPayloadOrValues.sourceUrl).hostname;
        } catch {}
      }
    } else {
      const vals = draftPayloadOrValues.values || draftPayloadOrValues;
      entries = Object.keys(vals)
        .filter((k) => String(vals[k] || "").trim().length > 0)
        .map((k, idx) => ({ id: k, value: String(vals[k]), labelEn: k, index: idx }));
    }

    if (!entries.length) return 0;

    const { kept } = getFillableElements();
    if (!kept.length) return 0;

    const usedElements = new Set();
    let filled = 0;

    function claimAndFill(el, value) {
      if (!el || usedElements.has(el)) return false;
      const rawLabel = findLabelForElement(el).slice(0, 100);
      if (shouldSkipDynamicOrSecurityField(el, rawLabel)) return false;
      const ok = setNativeFieldValue(el, value);
      if (ok) {
        usedElements.add(el);
        filled++;
      }
      return ok;
    }

    const candidates = kept.map((item, idx) => ({
      el: item.el,
      rawLabel: item.rawLabel,
      normLabel: normalizeForMatch(item.rawLabel),
      sig: [item.el.id || "", item.el.name || "", item.rawLabel, item.el.placeholder || ""].join(" "),
      bucket: detectSemanticBucket([item.rawLabel, item.el.id || "", item.el.name || "", item.el.placeholder || ""].join(" ")),
      idx
    }));

    const unmatchedEntries = [];

    // Pass 1: Exact rawId, rawName, selectorHint, or sanitized id
    for (const entry of entries) {
      let targetEl = null;

      if (entry.rawId) {
        targetEl = document.getElementById(entry.rawId);
      }
      if (!targetEl && entry.rawName) {
        try {
          targetEl = document.querySelector('[name="' + CSS.escape(entry.rawName) + '"]');
        } catch {}
      }
      if (!targetEl && entry.selectorHint) {
        try {
          targetEl = document.querySelector(entry.selectorHint);
        } catch {}
      }
      if (!targetEl && entry.id) {
        targetEl =
          document.getElementById(entry.id) ||
          (() => {
            try {
              return document.querySelector('[name="' + CSS.escape(entry.id) + '"]');
            } catch {
              return null;
            }
          })();
      }

      if (targetEl && claimAndFill(targetEl, entry.value)) {
        continue;
      }
      unmatchedEntries.push(entry);
    }

    // Pass 2: Exact or partial normalized Label match (works on Google Forms, ASP.NET, dynamic IDs)
    const stillUnmatched = [];
    for (const entry of unmatchedEntries) {
      const entryNorm = normalizeForMatch(entry.labelEn || entry.id);
      let match = null;

      if (entryNorm) {
        match =
          candidates.find((c) => !usedElements.has(c.el) && c.normLabel === entryNorm) ||
          candidates.find(
            (c) =>
              !usedElements.has(c.el) &&
              c.normLabel.length >= 3 &&
              (c.normLabel.includes(entryNorm) || entryNorm.includes(c.normLabel))
          );
      }

      if (match && claimAndFill(match.el, entry.value)) {
        continue;
      }
      stillUnmatched.push(entry);
    }

    // Pass 3: Semantic bucket match (maps built-in Sahayak fields like fullName/aadhaarNo/annualIncome to external portals)
    const finalUnmatched = [];
    for (const entry of stillUnmatched) {
      const bucket = detectSemanticBucket([entry.id || "", entry.labelEn || ""].join(" "));
      let match = null;
      if (bucket) {
        match = candidates.find((c) => !usedElements.has(c.el) && c.bucket === bucket);
      }
      if (match && claimAndFill(match.el, entry.value)) {
        continue;
      }
      finalUnmatched.push(entry);
    }

    // Pass 4: Same-host positional index fallback for unlabeled fields on the exact scanned website
    const sameHost = Boolean(sourceHost && sourceHost === window.location.hostname);
    if (sameHost) {
      for (const entry of finalUnmatched) {
        const candidate = candidates[entry.index];
        if (candidate && !usedElements.has(candidate.el)) {
          claimAndFill(candidate.el, entry.value);
        }
      }
    }

    return filled;
  };
})();`;

  const popupJs = `const SAHAYAK_URL = "${normalizedTarget}";
let latestSchema = null;

function encodeSchema(obj) {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/, "");
}

function showStatus(msg, type) {
  const box = document.getElementById("statusBox");
  box.textContent = msg;
  box.className = "status show" + (type ? " " + type : "");
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function refreshDraftIndicator() {
  const draftEl = document.getElementById("draftInfo");
  const stored = await chrome.storage.local.get(["sahayak_synced_draft"]);
  const draft = stored.sahayak_synced_draft;
  if (draft && draft.values && Object.keys(draft.values).length > 0) {
    const filledCount = Object.values(draft.values).filter((v) => String(v || "").trim().length > 0).length;
    draftEl.textContent = "Ready Draft: " + (draft.formName || "Saved Form") + " (" + filledCount + " answers)";
    draftEl.className = "draft-pill";
  } else {
    draftEl.textContent = 'No synced draft yet — click "Save Progress" or "Save & Sync to Extension" on Sahayak AI.';
    draftEl.className = "draft-pill empty";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const tab = await getActiveTab();
  if (tab) {
    document.getElementById("siteTitle").textContent = tab.title || "Current Webpage";
    document.getElementById("siteUrl").textContent = tab.url || "";
  }

  await refreshDraftIndicator();

  document.getElementById("scanBtn").addEventListener("click", async () => {
    const activeTab = await getActiveTab();
    if (!activeTab || !activeTab.id || !/^https?:|^file:/.test(activeTab.url || "")) {
      showStatus("Cannot scan Chrome internal pages. Open any normal website with a form first.", "err");
      return;
    }

    showStatus("Scanning webpage DOM (skipping CAPTCHA, OTP & dynamic fields)...");
    try {
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id, allFrames: true },
        files: ["content.js"]
      });

      const results = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id, allFrames: true },
        func: () => (typeof window.__SAHAYAK_SCAN_PAGE__ === "function" ? window.__SAHAYAK_SCAN_PAGE__() : null)
      });

      // Pick the frame with the most form fields (supports iframe-based government portals)
      const validSchemas = (results || [])
        .map((r) => r && r.result)
        .filter((s) => s && Array.isArray(s.fields) && s.fields.length > 0)
        .sort((a, b) => b.fields.length - a.fields.length);

      const schema = validSchemas[0];
      if (!schema) {
        showStatus("No fillable permanent form inputs found on this page (CAPTCHA/OTP/search boxes are ignored).", "err");
        return;
      }

      latestSchema = schema;

      const stored = await chrome.storage.local.get(["sahayak_scanned_forms"]);
      const list = Array.isArray(stored.sahayak_scanned_forms) ? stored.sahayak_scanned_forms : [];
      const deduped = [schema, ...list.filter((item) => item && item.id !== schema.id)].slice(0, 20);
      await chrome.storage.local.set({
        sahayak_scanned_forms: deduped,
        sahayak_pending_import: schema
      });

      const skippedMsg = schema.skippedDynamicCount > 0
        ? " · Skipped " + schema.skippedDynamicCount + " CAPTCHA/dynamic field(s)"
        : "";
      showStatus(
        "Extracted " + schema.fields.length + " fields & " + schema.documents.length + " checklist docs" + skippedMsg + ".",
        "ok"
      );
      document.getElementById("sendBtn").disabled = false;
      document.getElementById("copyJsonBtn").disabled = false;
    } catch (err) {
      showStatus("Scan error: " + (err && err.message ? err.message : String(err)), "err");
    }
  });

  document.getElementById("sendBtn").addEventListener("click", async () => {
    if (!latestSchema) return;
    await chrome.storage.local.set({ sahayak_pending_import: latestSchema });
    const encoded = encodeSchema(latestSchema);
    const targetUrl = encoded.length <= 12000
      ? SAHAYAK_URL + "#ext_schema=" + encoded
      : SAHAYAK_URL + "#ext_import=1";
    await chrome.tabs.create({ url: targetUrl });
  });

  document.getElementById("copyJsonBtn").addEventListener("click", async () => {
    if (!latestSchema) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(latestSchema));
      showStatus('Copied form JSON! Click "+ Add / Import Form" on Sahayak AI and paste it.', "ok");
    } catch (err) {
      showStatus("Could not copy automatically: " + (err && err.message ? err.message : String(err)), "err");
    }
  });

  document.getElementById("autofillBtn").addEventListener("click", async () => {
    const activeTab = await getActiveTab();
    if (!activeTab || !activeTab.id || !/^https?:|^file:/.test(activeTab.url || "")) {
      showStatus("Open a webpage with a form first before running autofill.", "err");
      return;
    }

    const stored = await chrome.storage.local.get(["sahayak_synced_draft"]);
    const draft = stored.sahayak_synced_draft;
    if (!draft || (!draft.entries && !draft.values)) {
      showStatus('No synced draft found! Fill your form on Sahayak AI and click "Save Progress" or "Save & Sync to Extension" first.', "err");
      return;
    }

    showStatus("Autofilling matching fields across page & frames...");
    try {
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id, allFrames: true },
        files: ["content.js"]
      });
      const results = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id, allFrames: true },
        func: (payload) =>
          typeof window.__SAHAYAK_AUTOFILL_PAGE__ === "function"
            ? window.__SAHAYAK_AUTOFILL_PAGE__(payload)
            : 0,
        args: [draft]
      });
      const totalFilled = (results || []).reduce(
        (sum, r) => sum + (typeof r.result === "number" ? r.result : 0),
        0
      );
      if (totalFilled > 0) {
        showStatus(
          "Autofilled " + totalFilled + " matching field(s) (highlighted in green; CAPTCHA/OTP/password safely skipped).",
          "ok"
        );
      } else {
        showStatus(
          "0 matching fields found on this page. Make sure you are on the target form page and your draft has filled answers.",
          "err"
        );
      }
    } catch (err) {
      showStatus("Autofill failed on this page: " + (err && err.message ? err.message : String(err)), "err");
    }
  });
});`;

  const bridgeJs = `// Sahayak Form AI — Reliable Two-Way Bridge between Chrome Extension & Sahayak Website (v1.3)
(function () {
  function syncLocalDraftIntoExtension() {
    try {
      const raw = window.localStorage.getItem("sahayak_extension_synced_draft");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.values && Object.keys(parsed.values).length > 0) {
        chrome.storage.local.set({ sahayak_synced_draft: parsed });
      }
    } catch {}
  }

  function pushStateToPage() {
    window.postMessage({ type: "SAHAYAK_EXT_CONNECTED" }, "*");
    syncLocalDraftIntoExtension();

    chrome.storage.local.get(["sahayak_scanned_forms", "sahayak_pending_import"], (res) => {
      if (res && Array.isArray(res.sahayak_scanned_forms) && res.sahayak_scanned_forms.length) {
        window.postMessage(
          { type: "SAHAYAK_EXT_SYNC_DB", forms: res.sahayak_scanned_forms },
          "*"
        );
      }
      if (res && res.sahayak_pending_import && res.sahayak_pending_import.id) {
        window.postMessage(
          { type: "SAHAYAK_EXT_IMPORT_FORM", schema: res.sahayak_pending_import },
          "*"
        );
      }
    });
  }

  pushStateToPage();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (changes.sahayak_pending_import && changes.sahayak_pending_import.newValue) {
      window.postMessage(
        { type: "SAHAYAK_EXT_IMPORT_FORM", schema: changes.sahayak_pending_import.newValue },
        "*"
      );
    } else if (changes.sahayak_scanned_forms && Array.isArray(changes.sahayak_scanned_forms.newValue)) {
      window.postMessage(
        { type: "SAHAYAK_EXT_SYNC_DB", forms: changes.sahayak_scanned_forms.newValue },
        "*"
      );
    }
  });

  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data) return;

    if (event.data.type === "SAHAYAK_SITE_READY") {
      pushStateToPage();
    } else if (event.data.type === "SAHAYAK_SITE_IMPORT_ACK") {
      chrome.storage.local.remove("sahayak_pending_import");
    } else if (event.data.type === "SAHAYAK_SITE_DELETE_FORM" && event.data.formId) {
      chrome.storage.local.get(["sahayak_scanned_forms"], (res) => {
        const list = Array.isArray(res.sahayak_scanned_forms) ? res.sahayak_scanned_forms : [];
        const filtered = list.filter((item) => item && item.id !== event.data.formId);
        chrome.storage.local.set({ sahayak_scanned_forms: filtered });
      });
    } else if (event.data.type === "SAHAYAK_SITE_SYNC_DRAFT" && event.data.payload) {
      chrome.storage.local.set({ sahayak_synced_draft: event.data.payload }, () => {
        window.postMessage({ type: "SAHAYAK_EXT_DRAFT_SAVED" }, "*");
      });
    }
  });
})();`;

  const installGuideTxt = `SAHAYAK FORM AI — CHROME EXTENSION INSTALL GUIDE (v1.3)
========================================================
1. Extract (Unzip) this folder anywhere on your computer.
2. Open Google Chrome and visit: chrome://extensions
3. Turn ON "Developer mode" (top-right switch).
4. Click "Load unpacked" and select this extracted folder.
   (If upgrading from an older version, replace the folder and click the Reload icon.)
5. What's New in v1.3:
   - Upgraded 4-tier Autofill engine (exact ID/name + label match + semantic match + iframe support)
   - React / Vue / Angular / Google Forms native value setter with green highlight confirmation
   - Smart anti-CAPTCHA, anti-OTP, anti-password & dynamic field filter on both scan and autofill
   - Live synced draft indicator right inside the extension popup
6. How to Autofill:
   - Fill your form on Sahayak AI (${normalizedTarget}) and click "Save Progress" or "Verify & Generate Draft" -> "Save & Sync to Extension".
   - Switch to the target website form tab, click the Sahayak Extension icon, and press "Autofill Synced Draft onto This Page".
`;

  return {
    'manifest.json': manifestJson,
    'popup.html': popupHtml,
    'popup.js': popupJs,
    'content.js': contentJs,
    'bridge.js': bridgeJs,
    'INSTALL_GUIDE.txt': installGuideTxt,
  };
}

export async function downloadChromeExtensionZip(targetSiteUrl: string = LIVE_SITE_URL): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('sahayak-chrome-extension');
  if (!folder) {
    throw new Error('Could not initialize zip archive folder.');
  }

  const files = getChromeExtensionFiles(targetSiteUrl);
  Object.entries(files).forEach(([filename, content]) => {
    folder.file(filename, content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'sahayak-chrome-extension.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
