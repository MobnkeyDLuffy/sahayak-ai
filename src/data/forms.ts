import type { FormSchema, Language } from '../types/sahayak';

export const LIVE_SITE_URL = 'https://mobnkeydluffy.github.io/sahayak-form-ai/';
export const CUSTOM_FORMS_STORAGE_KEY = 'sahayak_custom_forms_db_v1';
export const SYNCED_DRAFT_STORAGE_KEY = 'sahayak_extension_synced_draft';
export const SAVED_ANSWERS_STORAGE_KEY = 'sahayak_saved_answers_v1';
export const SAVED_DOCS_STORAGE_KEY = 'sahayak_saved_docs_v1';

export interface UiStrings {
  navGuidedForm: string;
  navChecklist: string;
  navHowItWorks: string;
  trustLine: string;
  extInstallBtnText: string;
  extConnectedBtnText: string;
  langToggleText: string;
  pageTitle: string;
  pageDescPrefix: string;
  pageDescSuffix: string;
  formSelectorLabel: string;
  addCustomFormBtn: string;
  deleteCustomFormBtn: string;
  leftCardTitle: string;
  leftCardSubtitlePrefix: string;
  leftCardSubtitleSuffix: string;
  rightCardTitle: string;
  rightCardSubtitle: string;
  filledSuffix: string;
  readySuffix: string;
  optionalTag: string;
  selectPlaceholder: string;
  simpleExpBtn: string;
  hideExpBtn: string;
  requiredError: string;
  globalErrorText: string;
  clearFormBtn: string;
  saveProgressBtn: string;
  savedProgressToast: string;
  verifyBtnText: string;
  validatorTipText: string;
  docStatusVerified: string;
  docStatusManual: string;
  docStatusPending: string;
  footerLeft: string;
  footerRight: string;
  modalVerifiedTag: string;
  modalTitle: string;
  modalCloseBtn: string;
  modalSyncBtnText: string;
  syncExtensionStatus: string;
  modalPrintBtnText: string;
  draftFormLabel: string;
  draftGeneratedOn: string;
  draftSectionApplicant: string;
  draftSectionDocs: string;
  draftReadyLabel: string;
  draftPendingLabel: string;
  draftDisclaimer: string;
  dismissLabel: string;
  sourcePrefix: string;
  extModalTitle: string;
  extModalSub: string;
  extNotConnectedLabel: string;
  extConnectedLabel: string;
  extDownloadTitle: string;
  extDownloadDesc: string;
  extTargetUrlLabel: string;
  extTargetGithub: string;
  extTargetCurrent: string;
  downloadExtZipText: string;
  buildingExtZipText: string;
  downloadedExtZipText: string;
  extGuideTitle: string;
  extGuide1: string;
  extGuide2: string;
  extGuide3: string;
  extDemoHint: string;
  extQuickDemoBtn: string;
  extInspectFilesBtn: string;
  extHideFilesBtn: string;
  addFormModalTitle: string;
  addFormModalSub: string;
  addFormTabManual: string;
  addFormTabImport: string;
  addFormNameLabel: string;
  addFormNamePlaceholder: string;
  addFormUrlLabel: string;
  addFormUrlPlaceholder: string;
  addFormFieldsHeading: string;
  addFormAddFieldBtn: string;
  addFormFieldLabelPlaceholder: string;
  addFormFieldExpPlaceholder: string;
  addFormDocLabel: string;
  addFormDocPlaceholder: string;
  addFormSaveBtn: string;
  addFormImportLabel: string;
  addFormImportPlaceholder: string;
  addFormImportBtn: string;
  addFormErrorName: string;
  addFormErrorFields: string;
  addFormErrorJson: string;
}

export const UI_TEXT: Record<Language, UiStrings> = {
  en: {
    navGuidedForm: 'Guided Form',
    navChecklist: 'Checklist',
    navHowItWorks: 'Extension Setup',
    trustLine: 'Official Rule-Verified · No AI Hallucinations · 100% Client-Side',
    extInstallBtnText: 'Get Chrome Extension',
    extConnectedBtnText: 'Extension Connected',
    langToggleText: 'हिन्दी',
    pageTitle: 'Sahayak Form AI — Guided Public-Service Assistant',
    pageDescPrefix: 'Answer ',
    pageDescSuffix:
      ' plain-language questions below. Tap "(i) Simple Explanation" anytime to understand official terms.',
    formSelectorLabel: 'Select Government / Saved Form',
    addCustomFormBtn: '+ Add / Import Form',
    deleteCustomFormBtn: 'Remove Form',
    leftCardTitle: 'Guided Question Flow',
    leftCardSubtitlePrefix: 'Complete the ',
    leftCardSubtitleSuffix: ' guided fields below to build an error-free application draft.',
    rightCardTitle: 'Live Document Checklist',
    rightCardSubtitle: 'Automatically updates as you fill your details on the left.',
    filledSuffix: 'Filled',
    readySuffix: 'Ready',
    optionalTag: '(Optional)',
    selectPlaceholder: '-- Select an option --',
    simpleExpBtn: '(i) Simple Explanation',
    hideExpBtn: '(i) Hide Explanation',
    requiredError: 'This field is required. Please enter your details.',
    globalErrorText: 'Please complete all highlighted required fields before generating your draft.',
    clearFormBtn: 'Clear Answers',
    saveProgressBtn: 'Save Progress',
    savedProgressToast: 'Progress saved in browser',
    verifyBtnText: 'Verify & Generate Draft',
    validatorTipText:
      'Checkboxes update automatically when matching fields are filled. You can also tick them manually once you have the physical or PDF document ready.',
    docStatusVerified: 'Linked details filled',
    docStatusManual: 'Marked ready',
    docStatusPending: 'Pending details',
    footerLeft: 'Sahayak Form AI · Citizen-First Public Service Assistant',
    footerRight: '100% Client-Side · Linked with Sahayak Chrome Extension (MV3)',
    modalVerifiedTag: 'Rule-Verified Draft',
    modalTitle: 'Application Summary Draft',
    modalCloseBtn: 'Edit Answers',
    modalSyncBtnText: 'Save & Sync to Extension',
    syncExtensionStatus: 'Saved locally & synced to Sahayak Chrome Extension for 1-click portal autofill.',
    modalPrintBtnText: 'Print / Save PDF',
    draftFormLabel: 'Selected Service',
    draftGeneratedOn: 'Draft Generated On',
    draftSectionApplicant: 'Applicant Details',
    draftSectionDocs: 'Verified Document Checklist',
    draftReadyLabel: 'Ready',
    draftPendingLabel: 'Check Before Submission',
    draftDisclaimer:
      'Note: This verified summary draft helps you submit accurate details on the official government portal or autofill directly via the Sahayak Chrome Extension.',
    dismissLabel: 'Dismiss',
    sourcePrefix: 'Source',
    extModalTitle: 'Sahayak Chrome Extension (Manifest V3)',
    extModalSub: 'Scan any live website form and auto-add it to Sahayak AI',
    extNotConnectedLabel: 'Extension not detected on this tab yet — download and load it in Chrome below.',
    extConnectedLabel: 'Sahayak Chrome Extension is active. Open any form website and click the extension icon to scan.',
    extDownloadTitle: 'Step 1: Download Extension Package (.zip)',
    extDownloadDesc:
      'Packages manifest.json, popup.html, popup.js, content.js, bridge.js, and INSTALL_GUIDE.txt (v1.3) — smart CAPTCHA/OTP/dynamic field filter + React/iframe-compatible 1-click autofill.',
    extTargetUrlLabel: 'Extension Return Destination',
    extTargetGithub: 'GitHub Pages (mobnkeydluffy.github.io/sahayak-form-ai)',
    extTargetCurrent: 'Current App URL (Recommended for Testing)',
    downloadExtZipText: 'Download Chrome Extension (.zip)',
    buildingExtZipText: 'Packaging sahayak-chrome-extension.zip...',
    downloadedExtZipText: 'Downloaded — Unzip & Load in chrome://extensions',
    extGuideTitle: 'Step 2: Load in Google Chrome (30 Seconds)',
    extGuide1: 'Extract (Unzip) the downloaded sahayak-chrome-extension.zip folder on your computer.',
    extGuide2:
      'Open chrome://extensions in Chrome, turn ON Developer mode (top-right), click Load unpacked, and select the extracted folder (if updating, click Reload).',
    extGuide3:
      'Visit any form website, click the Sahayak Extension icon, scan the page, and click "Add Form & Open in Sahayak AI" (or Copy Form JSON and paste in "+ Add / Import Form").',
    extDemoHint: 'Testing on mobile or running a quick walkthrough?',
    extQuickDemoBtn: 'Simulate Caste Portal Scan',
    extInspectFilesBtn: 'Inspect Extension Files',
    extHideFilesBtn: 'Hide Extension Files',
    addFormModalTitle: 'Add & Save Custom Form',
    addFormModalSub: 'Create a reusable guided form or paste a scanned form from the Chrome Extension',
    addFormTabManual: 'Create New Form',
    addFormTabImport: 'Paste Extension JSON',
    addFormNameLabel: 'Form / Service Name',
    addFormNamePlaceholder: 'e.g., Domicile Certificate Application',
    addFormUrlLabel: 'Official Portal URL (Optional)',
    addFormUrlPlaceholder: 'e.g., https://edistrict.uk.gov.in/...',
    addFormFieldsHeading: 'Guided Questions / Form Fields',
    addFormAddFieldBtn: '+ Add Question',
    addFormFieldLabelPlaceholder: 'Question or field name (e.g., Applicant Full Name)',
    addFormFieldExpPlaceholder: 'Simple explanation shown when user taps (i)',
    addFormDocLabel: 'Required Document Name (Optional)',
    addFormDocPlaceholder: 'e.g., Aadhaar Card & Address Proof',
    addFormSaveBtn: 'Add & Save Form',
    addFormImportLabel: 'Paste Scanned Form JSON from Chrome Extension',
    addFormImportPlaceholder: '{"id":"ext_...","name":{"en":"..."},"fields":[...],"documents":[...]}',
    addFormImportBtn: 'Import & Save Form',
    addFormErrorName: 'Please enter a form name.',
    addFormErrorFields: 'Please add at least one field with a label.',
    addFormErrorJson: 'Invalid form JSON. Please copy the full scanned JSON from the Sahayak Extension popup.',
  },
  hi: {
    navGuidedForm: 'निर्देशित फॉर्म',
    navChecklist: 'दस्तावेज़ सूची',
    navHowItWorks: 'एक्सटेंशन सेटअप',
    trustLine: 'आधिकारिक नियम-सत्यापित · कोई AI भ्रम नहीं · 100% ब्राउज़र आधारित',
    extInstallBtnText: 'Chrome एक्सटेंशन लें',
    extConnectedBtnText: 'एक्सटेंशन जुड़ा है',
    langToggleText: 'English',
    pageTitle: 'सहायक फॉर्म AI — सरल जन-सेवा फॉर्म सहायक',
    pageDescPrefix: 'नीचे दिए गए ',
    pageDescSuffix:
      ' आसान सवालों के जवाब भरें। किसी भी सरकारी शब्द को सरल भाषा में समझने के लिए "(i) सरल व्याख्या" दबाएँ।',
    formSelectorLabel: 'सरकारी / सेव किया गया फॉर्म चुनें',
    addCustomFormBtn: '+ नया फॉर्म जोड़ें',
    deleteCustomFormBtn: 'फॉर्म हटाएँ',
    leftCardTitle: 'चरण-दर-चरण प्रश्न प्रवाह',
    leftCardSubtitlePrefix: 'त्रुटि-रहित आवेदन ड्राफ्ट बनाने के लिए नीचे दिए गए ',
    leftCardSubtitleSuffix: ' निर्देशित फ़ील्ड भरें।',
    rightCardTitle: 'लाइव दस्तावेज़ चेकलिस्ट',
    rightCardSubtitle: 'बाईं ओर जानकारी भरते ही आवश्यक दस्तावेज़ अपने-आप अपडेट होते हैं।',
    filledSuffix: 'भरे गए',
    readySuffix: 'तैयार',
    optionalTag: '(वैकल्पिक)',
    selectPlaceholder: '-- विकल्प चुनें --',
    simpleExpBtn: '(i) सरल व्याख्या',
    hideExpBtn: '(i) व्याख्या छिपाएँ',
    requiredError: 'यह जानकारी भरना अनिवार्य है। कृपया विवरण दर्ज करें।',
    globalErrorText: 'ड्राफ्ट बनाने से पहले कृपया लाल रंग में दिखाए गए सभी अनिवार्य फ़ील्ड भरें।',
    clearFormBtn: 'उत्तर साफ़ करें',
    saveProgressBtn: 'उत्तर सेव करें',
    savedProgressToast: 'उत्तर ब्राउज़र में सेव हो गए',
    verifyBtnText: 'सत्यापित करें और ड्राफ्ट बनाएँ',
    validatorTipText:
      'संबंधित जानकारी भरते ही चेकबॉक्स अपने-आप टिक हो जाते हैं। कागज़ात तैयार होने पर आप इन्हें स्वयं भी टिक कर सकते हैं।',
    docStatusVerified: 'संबंधित जानकारी भरी गई',
    docStatusManual: 'स्वयं तैयार चिह्नित',
    docStatusPending: 'जानकारी प्रतीक्षित',
    footerLeft: 'सहायक फॉर्म AI · नागरिक-प्रथम जन-सेवा सहायक',
    footerRight: '100% ब्राउज़र आधारित · सहायक Chrome एक्सटेंशन (MV3) से जुड़ा',
    modalVerifiedTag: 'नियम-सत्यापित ड्राफ्ट',
    modalTitle: 'आवेदन सारांश ड्राफ्ट',
    modalCloseBtn: 'उत्तर बदलें',
    modalSyncBtnText: 'सेव और एक्सटेंशन से सिंक करें',
    syncExtensionStatus: 'ब्राउज़र में सेव हो गया और 1-क्लिक ऑटोफिल के लिए एक्सटेंशन में सिंक हो गया।',
    modalPrintBtnText: 'प्रिंट / PDF सेव करें',
    draftFormLabel: 'चयनित सेवा',
    draftGeneratedOn: 'ड्राफ्ट निर्माण तिथि',
    draftSectionApplicant: 'आवेदक का विवरण',
    draftSectionDocs: 'सत्यापित दस्तावेज़ सूची',
    draftReadyLabel: 'तैयार',
    draftPendingLabel: 'जमा करने से पहले जाँचें',
    draftDisclaimer:
      'नोट: यह सत्यापित सारांश ड्राफ्ट आपको आधिकारिक पोर्टल या सहायक Chrome एक्सटेंशन के ज़रिए बिना गलती के फॉर्म भरने में मदद करता है।',
    dismissLabel: 'बंद करें',
    sourcePrefix: 'स्रोत',
    extModalTitle: 'सहायक Chrome एक्सटेंशन (Manifest V3)',
    extModalSub: 'किसी भी वेबसाइट का फॉर्म स्कैन करें और सीधे सहायक AI में जोड़ें',
    extNotConnectedLabel: 'इस टैब पर अभी एक्सटेंशन नहीं मिला — नीचे से डाउनलोड कर Chrome में लोड करें।',
    extConnectedLabel: 'सहायक Chrome एक्सटेंशन कनेक्टेड है। किसी भी फॉर्म वाली वेबसाइट पर जाकर स्कैन करें।',
    extDownloadTitle: 'चरण 1: एक्सटेंशन पैकेज (.zip) डाउनलोड करें',
    extDownloadDesc:
      'इसमें manifest.json, popup.html, popup.js, content.js, bridge.js और INSTALL_GUIDE.txt (v1.3) होते हैं — CAPTCHA/OTP फ़िल्टर और React/iframe पोर्टल के लिए 1-क्लिक ऑटोफिल के साथ।',
    extTargetUrlLabel: 'एक्सटेंशन खुलने का वेबसाइट लिंक',
    extTargetGithub: 'GitHub Pages (mobnkeydluffy.github.io/sahayak-form-ai)',
    extTargetCurrent: 'वर्तमान ऐप URL (टेस्टिंग के लिए अनुशंसित)',
    downloadExtZipText: 'Chrome एक्सटेंशन (.zip) डाउनलोड करें',
    buildingExtZipText: 'sahayak-chrome-extension.zip तैयार हो रहा है...',
    downloadedExtZipText: 'डाउनलोड हो गया — अनज़िप करके chrome://extensions में लोड करें',
    extGuideTitle: 'चरण 2: Google Chrome में इंस्टॉल करें (30 सेकंड)',
    extGuide1: 'डाउनलोड की गई sahayak-chrome-extension.zip फ़ाइल को अपने कंप्यूटर पर Extract (Unzip) करें।',
    extGuide2:
      'Chrome में chrome://extensions खोलें, ऊपर दाईं ओर Developer mode चालू करें, Load unpacked दबाएँ और अनज़िप किया फ़ोल्डर चुनें।',
    extGuide3:
      'किसी भी फॉर्म वाली वेबसाइट पर जाएँ, Sahayak Extension आइकन दबाएँ, फॉर्म स्कैन करें और "Add Form & Open in Sahayak AI" दबाएँ (या JSON कॉपी करके "+ नया फॉर्म जोड़ें" में पेस्ट करें)।',
    extDemoHint: 'मोबाइल पर या तुरंत डेमो देखना चाहते हैं?',
    extQuickDemoBtn: 'जाति प्रमाण पत्र पोर्टल स्कैन डेमो',
    extInspectFilesBtn: 'एक्सटेंशन फ़ाइलें देखें',
    extHideFilesBtn: 'एक्सटेंशन फ़ाइलें छिपाएँ',
    addFormModalTitle: 'नया फॉर्म जोड़ें और सेव करें',
    addFormModalSub: 'नया निर्देशित फॉर्म बनाएँ या Chrome एक्सटेंशन से स्कैन किया JSON पेस्ट करें',
    addFormTabManual: 'नया फॉर्म बनाएँ',
    addFormTabImport: 'एक्सटेंशन JSON पेस्ट करें',
    addFormNameLabel: 'फॉर्म / सेवा का नाम',
    addFormNamePlaceholder: 'उदा., स्थायी निवास प्रमाण पत्र आवेदन',
    addFormUrlLabel: 'आधिकारिक पोर्टल URL (वैकल्पिक)',
    addFormUrlPlaceholder: 'उदा., https://edistrict.uk.gov.in/...',
    addFormFieldsHeading: 'निर्देशित प्रश्न / फॉर्म फ़ील्ड',
    addFormAddFieldBtn: '+ प्रश्न जोड़ें',
    addFormFieldLabelPlaceholder: 'प्रश्न या फ़ील्ड का नाम (उदा., आवेदक का पूरा नाम)',
    addFormFieldExpPlaceholder: 'सरल व्याख्या जो (i) दबाने पर दिखेगी',
    addFormDocLabel: 'आवश्यक दस्तावेज़ का नाम (वैकल्पिक)',
    addFormDocPlaceholder: 'उदा., आधार कार्ड और निवास प्रमाण पत्र',
    addFormSaveBtn: 'फॉर्म जोड़ें और सेव करें',
    addFormImportLabel: 'Chrome एक्सटेंशन से कॉपी किया गया JSON पेस्ट करें',
    addFormImportPlaceholder: '{"id":"ext_...","name":{"en":"..."},"fields":[...],"documents":[...]}',
    addFormImportBtn: 'इम्पोर्ट और सेव करें',
    addFormErrorName: 'कृपया फॉर्म का नाम दर्ज करें।',
    addFormErrorFields: 'कृपया कम से कम एक प्रश्न/फ़ील्ड जोड़ें।',
    addFormErrorJson: 'अमान्य JSON। कृपया सहायक एक्सटेंशन पॉपअप से पूरा JSON कॉपी करके पेस्ट करें।',
  },
};

export const BUILTIN_FORMS: Record<string, FormSchema> = {
  scholarship: {
    id: 'scholarship',
    name: {
      en: 'Uttarakhand Post-Matric Scholarship',
      hi: 'उत्तराखंड पोस्ट-मैट्रिक छात्रवृत्ति',
    },
    fields: [
      {
        id: 'fullName',
        type: 'text',
        label: {
          en: '1. What is your full name exactly as written on your Aadhaar Card?',
          hi: '1. आपका पूरा नाम क्या है (जैसा आधार कार्ड पर लिखा है)?',
        },
        placeholder: { en: 'e.g., Aarav Rawat', hi: 'उदा., आरव रावत' },
        explanation: {
          en: 'In simple words: Government portals match your name letter-by-letter with Aadhaar (e-KYC). Even a spelling difference can delay scholarship money.',
          hi: 'सरल शब्दों में: सरकारी पोर्टल आपके नाम का मिलान आधार कार्ड से अक्षर-दर-अक्षर करता है। एक भी अक्षर गलत होने पर छात्रवृत्ति अटक सकती है।',
        },
      },
      {
        id: 'aadhaarNo',
        type: 'text',
        label: {
          en: '2. Enter your 12-digit Aadhaar Number',
          hi: '2. अपना 12-अंकों का आधार नंबर दर्ज करें',
        },
        placeholder: { en: 'e.g., 1234 5678 9012', hi: 'उदा., 1234 5678 9012' },
        explanation: {
          en: 'In simple words: Aadhaar acts as your single digital identity so no one else can claim scholarship in your name, and it enables direct bank transfer (DBT).',
          hi: 'सरल शब्दों में: आधार आपकी डिजिटल पहचान है। इससे कोई और आपके नाम पर छात्रवृत्ति नहीं ले सकता और पैसा सीधे बैंक खाते में (DBT) आता है।',
        },
      },
      {
        id: 'domicileInfo',
        type: 'text',
        label: {
          en: '3. Which Uttarakhand district are you a permanent resident of (Domicile)?',
          hi: '3. आप उत्तराखंड के किस जिले के स्थायी निवासी (मूल निवास / डोमिसाइल) हैं?',
        },
        placeholder: {
          en: 'e.g., Dehradun (Cert No: UK-DOM-2025-1182)',
          hi: 'उदा., देहरादून (प्रमाण पत्र संख्या: UK-DOM-2025-1182)',
        },
        explanation: {
          en: "In simple words: 'Domicile' (Sthayi Niwas) simply means official proof that you and your family permanently live in Uttarakhand state.",
          hi: "सरल शब्दों में: 'डोमिसाइल' (स्थायी निवास प्रमाण पत्र) का अर्थ है कि आप और आपका परिवार स्थायी रूप से उत्तराखंड राज्य के निवासी हैं।",
        },
      },
      {
        id: 'bankDetails',
        type: 'text',
        label: {
          en: '4. Enter your Aadhaar-linked Bank Account Number & IFSC Code',
          hi: '4. अपना आधार से जुड़ा बैंक खाता नंबर और IFSC कोड लिखें',
        },
        placeholder: {
          en: 'e.g., 30912244556 · SBIN0000630',
          hi: 'उदा., 30912244556 · SBIN0000630',
        },
        explanation: {
          en: "In simple words: 'Aadhaar-Seeded / DBT Account' means your bank account is connected to your Aadhaar so the government sends scholarship money straight to your passbook.",
          hi: "सरल शब्दों में: 'आधार-सीडेड खाता' का मतलब है कि आपका बैंक खाता आधार से जुड़ा है, जिससे छात्रवृत्ति की राशि सीधे आपके खाते में आ सके।",
        },
      },
      {
        id: 'annualIncome',
        type: 'text',
        label: {
          en: '5. What is your total annual family income (in Rupees)?',
          hi: '5. आपके परिवार की कुल वार्षिक आय (रुपये में) कितनी है?',
        },
        placeholder: { en: 'e.g., ₹ 1,45,000 per year', hi: 'उदा., ₹ 1,45,000 प्रति वर्ष' },
        explanation: {
          en: "In simple words: 'Annual Family Income' is the combined yearly earnings of your parents/guardians from all jobs, farming, or business—as written on your Tehsil Income Certificate.",
          hi: "सरल शब्दों में: 'वार्षिक पारिवारिक आय' का मतलब माता-पिता की नौकरी, खेती या व्यापार से पूरे साल की कुल कमाई है, जो तहसील के आय प्रमाण पत्र में दर्ज होती है।",
        },
      },
      {
        id: 'collegeCourse',
        type: 'text',
        label: {
          en: '6. Write your current College/School Name & Class/Course',
          hi: '6. अपने वर्तमान कॉलेज/स्कूल का नाम और कक्षा/कोर्स लिखें',
        },
        placeholder: {
          en: 'e.g., Govt. Polytechnic Dehradun — Diploma IT (2nd Year)',
          hi: 'उदा., राजकीय पॉलिटेक्निक देहरादून — डिप्लोमा IT (द्वितीय वर्ष)',
        },
        explanation: {
          en: "In simple words: 'Post-Matric' simply means any recognized education after passing Class 10 (such as Class 11–12, ITI, Diploma, BA/BSc/BTech).",
          hi: "सरल शब्दों में: 'पोस्ट-मैट्रिक' का मतलब कक्षा 10 पास करने के बाद की कोई भी मान्यता प्राप्त पढ़ाई है (जैसे 11वीं–12वीं, ITI, डिप्लोमा या कॉलेज डिग्री)।",
        },
      },
    ],
    documents: [
      {
        id: 'aadhaar',
        linkedField: 'aadhaarNo',
        title: { en: 'Aadhaar Card', hi: 'आधार कार्ड' },
        desc: {
          en: '12-digit Aadhaar linked with active mobile number for OTP/e-KYC.',
          hi: 'OTP और e-KYC के लिए सक्रिय मोबाइल नंबर से जुड़ा 12-अंकों का आधार।',
        },
      },
      {
        id: 'domicile',
        linkedField: 'domicileInfo',
        title: { en: 'Domicile Certificate (Uttarakhand)', hi: 'स्थायी निवास प्रमाण पत्र (उत्तराखंड)' },
        desc: {
          en: 'Official Uttarakhand permanent residence proof issued by Tehsildar/SDM.',
          hi: 'तहसीलदार/SDM द्वारा जारी उत्तराखंड का स्थायी निवास प्रमाण पत्र।',
        },
      },
      {
        id: 'bank',
        linkedField: 'bankDetails',
        title: { en: 'Bank Passbook', hi: 'बैंक पासबुक' },
        desc: {
          en: "Student's own single-holder account front page with IFSC & NPCI/DBT seeding.",
          hi: 'छात्र के स्वयं के खाते की पासबुक (IFSC और आधार/DBT लिंक सहित)।',
        },
      },
      {
        id: 'income',
        linkedField: 'annualIncome',
        title: { en: 'Income Proof (Income Certificate)', hi: 'आय प्रमाण पत्र (Income Proof)' },
        desc: {
          en: 'Valid family income certificate issued by competent revenue authority.',
          hi: 'सक्षम राजस्व अधिकारी (तहसीलदार) द्वारा जारी वैध पारिवारिक आय प्रमाण पत्र।',
        },
      },
    ],
  },

  income: {
    id: 'income',
    name: {
      en: 'Income Certificate Application',
      hi: 'आय प्रमाण पत्र आवेदन',
    },
    fields: [
      {
        id: 'fullName',
        type: 'text',
        label: {
          en: "1. Applicant's Full Name (and Father/Guardian Name)",
          hi: '1. आवेदक का पूरा नाम (एवं पिता/अभिभावक का नाम)',
        },
        placeholder: {
          en: 'e.g., Priya Negi (D/o Ramesh Singh Negi)',
          hi: 'उदा., प्रिया नेगी (पुत्री श्री रमेश सिंह नेगी)',
        },
        explanation: {
          en: 'In simple words: The certificate is printed in your legal name matching your Aadhaar so schools, colleges, or welfare offices accept it without objection.',
          hi: 'सरल शब्दों में: प्रमाण पत्र आपके आधार वाले कानूनी नाम से बनता है ताकि स्कूल, कॉलेज या सरकारी विभाग इसे बिना किसी आपत्ति के स्वीकार करें।',
        },
      },
      {
        id: 'aadhaarNo',
        type: 'text',
        label: {
          en: '2. Enter Aadhaar Number (Identity Verification)',
          hi: '2. पहचान सत्यापन के लिए आधार नंबर दर्ज करें',
        },
        placeholder: { en: 'e.g., 9876 5432 1098', hi: 'उदा., 9876 5432 1098' },
        explanation: {
          en: 'In simple words: The Tehsil / e-District office verifies your identity using your Aadhaar before starting local Patwari/Lekhpal verification.',
          hi: 'सरल शब्दों में: तहसील / ई-डिस्ट्रिक्ट कार्यालय पटवारी/लेखपाल जाँच शुरू करने से पहले आधार के माध्यम से आपकी पहचान की पुष्टि करता है।',
        },
      },
      {
        id: 'domicileInfo',
        type: 'text',
        label: {
          en: '3. Full Home Address, Tehsil & District (Residence Proof)',
          hi: '3. पूरा घर का पता, तहसील और जिला (निवास विवरण)',
        },
        placeholder: {
          en: 'e.g., Village Bhaniawala, Tehsil Doiwala, Dehradun',
          hi: 'उदा., ग्राम भानियावाला, तहसील डोईवाला, देहरादून',
        },
        explanation: {
          en: "In simple words: 'Tehsil & Gram/Ward' tells the system which local revenue officer (Patwari/Lekhpal) will inspect and approve your application.",
          hi: "सरल शब्दों में: 'तहसील और ग्राम/वार्ड' से यह तय होता है कि आपके क्षेत्र के कौन से पटवारी/लेखपाल आपके आवेदन की जाँच व स्वीकृति करेंगे।",
        },
      },
      {
        id: 'bankDetails',
        type: 'text',
        label: {
          en: '4. Family Bank Account / Ration Card Reference',
          hi: '4. पारिवारिक बैंक खाता / राशन कार्ड विवरण',
        },
        placeholder: {
          en: 'e.g., PNB Acc: 441200010099 · IFSC: PUNB0441200',
          hi: 'उदा., PNB खाता: 441200010099 · IFSC: PUNB0441200',
        },
        explanation: {
          en: "In simple words: Bank passbook or family register details help the verification officer confirm your household's actual financial standing.",
          hi: 'सरल शब्दों में: बैंक पासबुक या परिवार रजिस्टर का विवरण जाँच अधिकारी को आपके परिवार की वास्तविक आर्थिक स्थिति सत्यापित करने में मदद करता है।',
        },
      },
      {
        id: 'annualIncome',
        type: 'text',
        label: {
          en: '5. Total Annual Household Income & Main Source',
          hi: '5. परिवार की कुल वार्षिक आय और आय का मुख्य स्रोत',
        },
        placeholder: {
          en: 'e.g., ₹ 96,000 per year (Agriculture & Daily Wage)',
          hi: 'उदा., ₹ 96,000 प्रति वर्ष (कृषि एवं मजदूरी)',
        },
        explanation: {
          en: 'In simple words: Add up yearly earnings of all earning members living together in your home (salary, farming, shop, or pension) and state the main work.',
          hi: 'सरल शब्दों में: घर में साथ रहने वाले सभी कमाने वाले सदस्यों की सालाना कमाई (नौकरी, खेती, दुकान या पेंशन) जोड़कर लिखें और मुख्य काम बताएँ।',
        },
      },
      {
        id: 'purpose',
        type: 'text',
        label: {
          en: '6. Purpose for requesting the Income Certificate',
          hi: '6. आय प्रमाण पत्र बनवाने का उद्देश्य क्या है?',
        },
        placeholder: {
          en: 'e.g., Scholarship & College Fee Concession',
          hi: 'उदा., छात्रवृत्ति एवं कॉलेज शुल्क में छूट हेतु',
        },
        explanation: {
          en: "In simple words: Telling the 'Purpose' (such as scholarship, EWS/ration card, or fee waiver) helps the clerk issue the certificate in the right format.",
          hi: "सरल शब्दों में: 'उद्देश्य' (जैसे छात्रवृत्ति, राशन कार्ड या फीस माफी) लिखने से तहसील कार्यालय सही प्रारूप में प्रमाण पत्र जारी करता है।",
        },
      },
    ],
    documents: [
      {
        id: 'aadhaar',
        linkedField: 'aadhaarNo',
        title: { en: 'Aadhaar Card', hi: 'आधार कार्ड' },
        desc: {
          en: "Copy of applicant's Aadhaar Card for identity & e-District verification.",
          hi: 'पहचान और ई-डिस्ट्रिक्ट सत्यापन के लिए आवेदक के आधार कार्ड की प्रति।',
        },
      },
      {
        id: 'domicile',
        linkedField: 'domicileInfo',
        title: { en: 'Domicile / Residence Proof', hi: 'निवास प्रमाण पत्र / पता प्रमाण' },
        desc: {
          en: 'Domicile Certificate, Electricity Bill, or Parivar Register copy.',
          hi: 'स्थायी निवास प्रमाण पत्र, बिजली बिल या परिवार रजिस्टर की नकल।',
        },
      },
      {
        id: 'bank',
        linkedField: 'bankDetails',
        title: { en: 'Bank Passbook', hi: 'बैंक पासबुक' },
        desc: {
          en: 'Recent bank passbook front page / statement supporting household financial record.',
          hi: 'पारिवारिक आर्थिक विवरण के समर्थन में बैंक पासबुक के प्रथम पृष्ठ की प्रति।',
        },
      },
      {
        id: 'income',
        linkedField: 'annualIncome',
        title: {
          en: 'Income Proof (Self-Declaration / Salary Slip)',
          hi: 'आय प्रमाण (स्व-घोषणा पत्र / वेतन पर्ची)',
        },
        desc: {
          en: 'Signed self-declaration (Swa-Pramanit Ghosana Patra) or employer salary slip.',
          hi: 'हस्ताक्षरित स्व-प्रमाणित घोषणा पत्र अथवा नियोक्ता की वेतन पर्ची।',
        },
      },
    ],
  },
};

export const DEMO_CASTE_SCHEMA: FormSchema = {
  id: 'ext_edistrict_caste_demo',
  isCustom: true,
  sourceUrl: 'https://edistrict.uk.gov.in/caste-certificate',
  name: {
    en: 'Caste Certificate (OBC/SC/ST) — Extracted via Extension',
    hi: 'जाति प्रमाण पत्र (OBC/SC/ST) — एक्सटेंशन द्वारा स्कैन',
  },
  fields: [
    {
      id: 'fullName',
      type: 'text',
      section: { en: 'Page 1 of 4 · Applicant Identity', hi: 'पेज 1 / 4 · आवेदक की पहचान' },
      label: {
        en: '1. Applicant Full Name (as per Aadhaar)',
        hi: '1. आवेदक का पूरा नाम (आधार कार्ड के अनुसार)',
      },
      placeholder: { en: 'e.g., Rohit Kumar', hi: 'उदा., रोहित कुमार' },
      explanation: {
        en: 'In simple words: Enter your exact legal name printed on your Aadhaar Card so Tehsil verification matches without rejection.',
        hi: 'सरल शब्दों में: अपने आधार कार्ड पर छपा हुआ बिल्कुल सही नाम लिखें ताकि तहसील सत्यापन में कोई अंतर न आए।',
      },
    },
    {
      id: 'fatherHusbandName',
      type: 'text',
      label: { en: "2. Father's / Husband's Name", hi: '2. पिता / पति का नाम' },
      placeholder: { en: 'e.g., Suresh Kumar', hi: 'उदा., सुरेश कुमार' },
      explanation: {
        en: 'In simple words: Caste status is verified through paternal/family lineage in revenue records.',
        hi: 'सरल शब्दों में: जाति का सत्यापन पारिवारिक/पैतृक रिकॉर्ड से होता है।',
      },
    },
    {
      id: 'motherName',
      type: 'text',
      label: { en: "3. Mother's Name", hi: '3. माता का नाम' },
      placeholder: { en: 'e.g., Sunita Devi', hi: 'उदा., सुनीता देवी' },
      explanation: {
        en: 'In simple words: Printed on your e-District Caste Certificate and matched with Parivar Register.',
        hi: 'सरल शब्दों में: माता का नाम प्रमाण पत्र पर छपता है और परिवार रजिस्टर से मिलाया जाता है।',
      },
    },
    {
      id: 'dob',
      type: 'date',
      label: { en: '4. Date of Birth', hi: '4. जन्म तिथि' },
      placeholder: { en: '', hi: '' },
      explanation: {
        en: 'In simple words: Select your birth date matching Aadhaar or Class 10 Marksheet.',
        hi: 'सरल शब्दों में: आधार या 10वीं मार्कशीट के अनुसार सही जन्म तिथि चुनें।',
      },
    },
    {
      id: 'gender',
      type: 'select',
      label: { en: '5. Gender', hi: '5. लिंग' },
      options: [
        { value: 'Male', label: { en: 'Male', hi: 'पुरुष' } },
        { value: 'Female', label: { en: 'Female', hi: 'महिला' } },
        { value: 'Other', label: { en: 'Other', hi: 'अन्य' } },
      ],
      explanation: {
        en: 'In simple words: Required by the portal to format applicant prefixes accurately.',
        hi: 'सरल शब्दों में: पोर्टल पर सही संबोधन और रिकॉर्ड दर्ज करने के लिए आवश्यक है।',
      },
    },
    {
      id: 'casteCategory',
      type: 'select',
      section: { en: 'Page 2 of 4 · Caste & Sub-Category', hi: 'पेज 2 / 4 · जाति और उप-वर्ग' },
      label: { en: '6. Caste Category (OBC / SC / ST)', hi: '6. जाति वर्ग (OBC / SC / ST)' },
      options: [
        { value: 'OBC', label: { en: 'OBC (Other Backward Class)', hi: 'OBC (अन्य पिछड़ा वर्ग)' } },
        { value: 'SC', label: { en: 'SC (Scheduled Caste)', hi: 'SC (अनुसूचित जाति)' } },
        { value: 'ST', label: { en: 'ST (Scheduled Tribe)', hi: 'ST (अनुसूचित जनजाति)' } },
      ],
      explanation: {
        en: 'In simple words: Choose whether you are applying for OBC, SC, or ST certificate.',
        hi: 'सरल शब्दों में: चुनें कि आप OBC, SC या ST किस वर्ग का प्रमाण पत्र बनवा रहे हैं।',
      },
    },
    {
      id: 'subCaste',
      type: 'text',
      label: {
        en: '7. Sub-Caste Name (as per Uttarakhand State List)',
        hi: '7. उप-जाति का नाम (उत्तराखंड राज्य सूची के अनुसार)',
      },
      placeholder: { en: 'e.g., Saini / Shilpkar / Jaunsari', hi: 'उदा., सैनी / शिल्पकार / जौनसारी' },
      explanation: {
        en: 'In simple words: Specific community name recognized in the official State Gazette list.',
        hi: 'सरल शब्दों में: राज्य की आधिकारिक सूची में दर्ज आपके विशेष समुदाय का नाम।',
      },
    },
    {
      id: 'ancestralCertNo',
      type: 'text',
      optional: true,
      label: {
        en: "8. Father's / Ancestral Caste Certificate Number (if available)",
        hi: '8. पिता / पैतृक जाति प्रमाण पत्र संख्या (यदि उपलब्ध हो)',
      },
      placeholder: {
        en: 'e.g., UK-CC-2004-08192 (or leave blank)',
        hi: 'उदा., UK-CC-2004-08192 (या खाली छोड़ें)',
      },
      explanation: {
        en: 'In simple words: Speeds up Patwari verification significantly, optional if unavailable.',
        hi: 'सरल शब्दों में: पुराना नंबर देने से जाँच तेज़ होती है, उपलब्ध न हो तो खाली छोड़ें।',
      },
    },
    {
      id: 'permanentAddress',
      type: 'text',
      section: { en: 'Page 3 of 4 · Permanent Address & Domicile', hi: 'पेज 3 / 4 · स्थायी पता और निवास' },
      label: {
        en: '9. Complete Village / Mohalla & Tehsil Address',
        hi: '9. पूरा ग्राम / मोहल्ला और तहसील का पता',
      },
      placeholder: {
        en: 'e.g., Ward 12, Shyampur, Tehsil Rishikesh, Dehradun',
        hi: 'उदा., वार्ड 12, श्यामपुर, तहसील ऋषिकेश, देहरादून',
      },
      explanation: {
        en: 'In simple words: Routes your application to the Patwari of your Tehsil & Ward.',
        hi: 'सरल शब्दों में: यहाँ लिखे तहसील और ग्राम/वार्ड से सही पटवारी को आवेदन भेजा जाता है।',
      },
    },
    {
      id: 'domicileYears',
      type: 'text',
      label: {
        en: '10. Uttarakhand Domicile Duration (Years)',
        hi: '10. उत्तराखंड में स्थायी निवास की अवधि (वर्षों में)',
      },
      placeholder: { en: 'e.g., 22 Years (Since Birth)', hi: 'उदा., 22 वर्ष (जन्म से)' },
      explanation: {
        en: 'In simple words: State caste certificates require permanent residence proof.',
        hi: 'सरल शब्दों में: राज्य जाति प्रमाण पत्र स्थायी निवासियों को जारी होता है।',
      },
    },
    {
      id: 'annualIncome',
      type: 'text',
      section: { en: 'Page 4 of 4 · Income & Verification', hi: 'पेज 4 / 4 · आय और सत्यापन' },
      label: {
        en: '11. Annual Family Income (₹) (for OBC Non-Creamy Layer check)',
        hi: '11. वार्षिक पारिवारिक आय (₹) (OBC नॉन-क्रीमी लेयर जाँच हेतु)',
      },
      placeholder: { en: 'e.g., ₹ 2,40,000 per year', hi: 'उदा., ₹ 2,40,000 प्रति वर्ष' },
      explanation: {
        en: 'In simple words: Families earning below ₹8 Lakh/year qualify for OBC Non-Creamy Layer benefits.',
        hi: 'सरल शब्दों में: ₹8 लाख से कम वार्षिक आय वाले परिवार OBC नॉन-क्रीमी लेयर के पात्र हैं।',
      },
    },
    {
      id: 'aadhaarMobile',
      type: 'tel',
      label: { en: '12. Aadhaar-Linked Mobile Number', hi: '12. आधार से जुड़ा मोबाइल नंबर' },
      placeholder: { en: 'e.g., 9876543210', hi: 'उदा., 9876543210' },
      explanation: {
        en: 'In simple words: Used for e-KYC OTP and certificate approval SMS alerts.',
        hi: 'सरल शब्दों में: e-KYC OTP और प्रमाण पत्र स्वीकृति SMS के लिए उपयोग होता है।',
      },
    },
  ],
  documents: [
    {
      id: 'aadhaar',
      linkedField: 'fullName',
      title: { en: 'Aadhaar Card', hi: 'आधार कार्ड' },
      desc: {
        en: "Applicant's Aadhaar Card matching name, DOB, and active OTP mobile number.",
        hi: 'नाम, जन्मतिथि और सक्रिय OTP मोबाइल नंबर से मेल खाता आधार कार्ड।',
      },
    },
    {
      id: 'parivar',
      linkedField: 'permanentAddress',
      title: {
        en: 'Parivar Register / Ration Card Copy',
        hi: 'परिवार रजिस्टर / राशन कार्ड की प्रति',
      },
      desc: {
        en: 'Gram Panchayat Parivar Register Nakal or Urban Ration Card verifying family lineage.',
        hi: 'पारिवारिक वंशावली की पुष्टि हेतु परिवार रजिस्टर या राशन कार्ड।',
      },
    },
    {
      id: 'patwari',
      linkedField: 'subCaste',
      title: { en: 'Patwari / Revenue Caste Report', hi: 'पटवारी / राजस्व जाति जाँच रिपोर्ट' },
      desc: {
        en: 'Signed local Patwari/Lekhpal verification confirming sub-caste & ancestral record.',
        hi: 'उप-जाति की पुष्टि करती हुई पटवारी/लेखपाल की सत्यापन रिपोर्ट।',
      },
    },
    {
      id: 'obc_income',
      linkedField: 'annualIncome',
      title: { en: 'Income Certificate for OBC', hi: 'OBC हेतु आय प्रमाण पत्र' },
      desc: {
        en: 'Valid Tehsil Income Certificate verifying Non-Creamy Layer eligibility (below ₹8L/yr).',
        hi: 'नॉन-क्रीमी लेयर पात्रता (₹8 लाख/वर्ष से कम) सिद्ध करने हेतु आय प्रमाण पत्र।',
      },
    },
  ],
};
