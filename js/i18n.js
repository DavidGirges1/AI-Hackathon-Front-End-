/**
 * ============================================================================
 * AuraMed AI - Internationalization (EN/AR), Dark Mode & Accessibility Suite
 * ============================================================================
 */

// ============================================================================
// 1. Translation Dictionary (English & Arabic)
// ============================================================================

const I18N_TRANSLATIONS = {
  en: {
    // Brand & Global
    "brand.name": "AuraMed",
    "brand.suffix": "AI",
    "brand.tagline": "Clinical Assistant",
    "nav.security": "256-Bit Encrypted Clinical Session",
    "nav.lang": "العربية",
    "nav.theme.toggle": "Toggle Dark Mode",
    "nav.signin": "Sign In",
    "nav.get_started": "Get Started",
    "nav.logout": "Sign Out",
    "nav.print": "Print Summary",
    "nav.clear": "Reset Conversation",
    "footer.disclaimer": "AuraMed AI provides clinical information, not formal diagnoses. In emergencies, call 911 immediately.",
    "footer.security": "Your clinical intake data is encrypted per session and never shared with third parties.",

    // Landing Page
    "landing.badge": "Next-Generation Clinical AI & Medication Safety",
    "landing.hero.title": "Safe, Personalized Medical AI for Your Prescriptions",
    "landing.hero.sub": "Real-time drug interaction checks, maternal health contraindication screening, and 24/7 personalized clinical guidance grounded in medical evidence.",
    "landing.cta.signup": "Create Patient Account",
    "landing.cta.signin": "Sign In to Portal",
    "landing.cta.demo": "Explore Clinical Demo",
    "landing.preview.pill": "Active Clinical Session",
    "landing.preview.alert_title": "Interaction Screen Active",
    "landing.preview.alert_desc": "Checking Lisinopril against OTC NSAIDs & pregnancy safety...",
    "landing.feat.title": "Clinical-Grade Safety at Every Step",
    "landing.feat.sub": "Designed to protect patients through intelligent health context calibration.",
    "landing.feat1.title": "Active Medication Screening",
    "landing.feat1.desc": "Cross-checks multiple prescriptions, dosages, and timings to prevent adverse drug interactions.",
    "landing.feat2.title": "Maternal Health & Trimester Calibration",
    "landing.feat2.desc": "Dynamic gestational calculation that automatically filters high-risk contraindications during pregnancy.",
    "landing.feat3.title": "Grounded RAG Clinical Intelligence",
    "landing.feat3.desc": "Answers symptoms and lab queries with citations from verified clinical guidelines.",
    "landing.feat4.title": "Encrypted & Privacy-First",
    "landing.feat4.desc": "256-bit encrypted sessions with strict Row Level Security. Your medical data stays private.",
    "landing.how.title": "How AuraMed AI Works",
    "landing.how.step1.title": "1. Quick Health Intake",
    "landing.how.step1.desc": "Provide baseline vitals, diagnosed conditions, and known drug allergies in under 2 minutes.",
    "landing.how.step2.title": "2. Load Prescriptions",
    "landing.how.step2.desc": "Add your active medications with dosage and frequency to create your clinical context.",
    "landing.how.step3.title": "3. Ask AI with Confidence",
    "landing.how.step3.desc": "Ask about symptoms, missed doses, interactions, or lifestyle tips tailored to your exact profile.",
    "landing.bottom.title": "Ready to Experience Safer Healthcare Guidance?",
    "landing.bottom.sub": "Join AuraMed AI today and take control of your medication safety.",

    // Login Page
    "login.title": "Sign In | AuraMed AI",
    "login.heading": "Patient Portal Sign In",
    "login.subheading": "Access your personalized clinical assistant and active medication context.",
    "login.email.label": "Email Address or Patient ID",
    "login.email.placeholder": "e.g. sarah.jenkins@example.com",
    "login.password.label": "Password",
    "login.password.placeholder": "••••••••••••",
    "login.remember": "Remember my secure session",
    "login.forgot": "Forgot password?",
    "login.btn": "Sign In",
    "login.demo.btn": "Fill Demo Credentials (Sarah Jenkins)",
    "login.no_account": "Don't have an account yet?",
    "login.signup_link": "Create a Patient Account",

    // Signup Page
    "signup.title": "Create Patient Account | AuraMed AI",
    "signup.heading": "Create Patient Account",
    "signup.subheading": "Register to receive continuous AI clinical guidance for your prescriptions.",
    "signup.fullname.label": "Full Legal Name",
    "signup.fullname.placeholder": "e.g. Sarah Jenkins",
    "signup.email.label": "Email Address",
    "signup.email.placeholder": "e.g. sarah.jenkins@example.com",
    "signup.password.label": "Secure Password",
    "signup.password.placeholder": "Minimum 8 characters with upper, numbers & symbols",
    "signup.strength.label": "Security Strength:",
    "signup.req.length": "8+ characters",
    "signup.req.upper": "Uppercase letter",
    "signup.req.number": "Number",
    "signup.req.special": "Special symbol",
    "signup.terms": "I agree to the Health Data Privacy Notice & Terms of Clinical AI Consultation.",
    "signup.btn": "Create Account & Start Intake",
    "signup.has_account": "Already have a patient account?",
    "signup.signin_link": "Sign in to your account",

    // Patient Form
    "form.title": "Patient Clinical Intake | AuraMed AI",
    "form.heading": "Patient Clinical Intake",
    "form.subheading": "Provide your health context to calibrate interaction alerts, dosage schedules, and clinical guidance.",
    "form.demo_prefill": "Fill Sample Clinical Data",
    "form.sec1.title": "1. Demographics & Vitals",
    "form.sec1.subtitle": "Baseline Context",
    "form.fullname.label": "Full Legal Name",
    "form.dob.label": "Date of Birth",
    "form.gender.label": "Gender",
    "form.gender.male": "Male",
    "form.gender.female": "Female",
    "form.maternal.title": "Maternal Health Context",
    "form.maternal.pregnant.label": "Are you currently pregnant?",
    "form.maternal.no": "No",
    "form.maternal.yes": "Yes, currently pregnant",
    "form.maternal.weeks.label": "Pregnancy Week (1–42)",
    "form.maternal.trimester.label": "Estimated Trimester",
    "form.blood.label": "Blood Type",
    "form.height.label": "Height (cm)",
    "form.weight.label": "Weight (kg)",
    "form.sec2.title": "2. Medical History & Sensitivities",
    "form.sec2.subtitle": "Clinical Risk Screening",
    "form.conditions.label": "Diagnosed Chronic Conditions",
    "form.cond.hypertension": "+ Hypertension",
    "form.cond.diabetes": "+ Type 2 Diabetes",
    "form.cond.asthma": "+ Mild Asthma",
    "form.cond.lipid": "+ Hyperlipidemia",
    "form.cond.gerd": "+ GERD / Acid Reflux",
    "form.cond.none": "None",
    "form.conditions.custom.placeholder": "Type custom condition & press Add",
    "form.allergies.label": "Known Drug Allergies & Adverse Reactions",
    "form.allergy.penicillin": "+ Penicillin",
    "form.allergy.sulfa": "+ Sulfa Drugs",
    "form.allergy.aspirin": "+ Aspirin / NSAIDs",
    "form.allergy.none": "No Known Allergies (NKDA)",
    "form.allergies.custom.placeholder": "Type allergen (e.g. Sulfa) & press Add",
    "form.add_btn": "Add",
    "form.history.label": "Major Surgeries or Past Hospitalizations",
    "form.history.placeholder": "e.g. Appendectomy (2018), Knee Arthroscopy (2021)...",
    "form.skip": "Skip for now & continue to Assistant →",
    "form.submit": "Save & Continue to AI Assistant",

    // Assistant Page
    "assistant.title": "Medical AI Assistant | AuraMed AI",
    "assistant.active_meds": "Active Medications",
    "assistant.add_med_btn": "Add Medicine",
    "assistant.no_meds": "No active medications loaded. Click '+ Add Medicine' to inform AI.",
    "assistant.evaluating": "Evaluating clinical profile & active medication interactions...",
    "assistant.suggestions_label": "Suggestions:",
    "assistant.sugg1": "🔍 Check NSAID / Ibuprofen Interaction",
    "assistant.sugg2": "⏰ Missed Morning Dose Guidance",
    "assistant.sugg3": "🩺 Symptom & Side Effect Check",
    "assistant.sugg4": "🥗 Dietary Tips for Hypertension",
    "assistant.prompt.placeholder": "Ask your medical assistant about your symptoms, medications, or lab results...",
    "assistant.meds_in_context": "Meds in Context",
    "assistant.no_meds_in_context": "No Meds in Context",
    "assistant.press_enter": "Press Enter ↵ to send",

    // Modal: Add Medicine
    "modal.add_med.title": "Add Medication to AI Context",
    "modal.add_med.subtitle": "Informs drug interactions and schedule alerts.",
    "modal.add_med.name.label": "Medicine Name",
    "modal.add_med.name.placeholder": "e.g. Lisinopril or Paracetamol",
    "modal.add_med.dose.label": "Dosage / Strength",
    "modal.add_med.dose.placeholder": "e.g. 500 mg or 10 ml",
    "modal.add_med.freq.label": "Frequency",
    "modal.add_med.freq.placeholder": "e.g. Twice daily with meals",
    "modal.add_med.cancel": "Cancel",
    "modal.add_med.submit": "Add to Active Context",

    // Accessibility Suite
    "a11y.title": "Accessibility Options",
    "a11y.subtitle": "Customize your visual & reading preferences",
    "a11y.btn.label": "Accessibility Settings",
    "a11y.font_size": "Text Size",
    "a11y.font_normal": "Default",
    "a11y.font_large": "Large (+15%)",
    "a11y.font_xlarge": "Extra Large (+30%)",
    "a11y.contrast": "Visual Contrast",
    "a11y.contrast_normal": "Normal",
    "a11y.contrast_high": "High Contrast",
    "a11y.contrast_mono": "Monochrome",
    "a11y.dyslexia": "Dyslexia Friendly Font",
    "a11y.line_spacing": "Enhanced Line Spacing",
    "a11y.highlight_links": "Highlight Interactive Elements",
    "a11y.reading_guide": "Reading Ruler Line",
    "a11y.reset": "Reset All Preferences",
    "a11y.close": "Close"
  },

  ar: {
    // Brand & Global
    "brand.name": "أورا ميد",
    "brand.suffix": "للذكاء الاصطناعي",
    "brand.tagline": "المساعد السريري الذكي",
    "nav.security": "جلسة سريرية مشفرة بـ 256 بت",
    "nav.lang": "English",
    "nav.theme.toggle": "تبديل الوضع الليلي",
    "nav.signin": "تسجيل الدخول",
    "nav.get_started": "ابدأ الآن",
    "nav.logout": "تسجيل الخروج",
    "nav.print": "طباعة التقرير",
    "nav.clear": "إعادة تعيين المحادثة",
    "footer.disclaimer": "يقدم المساعد معلومات سريرية استرشادية ولا يقدم تشخيصات طبية نهائية. في حالات الطوارئ اتصل بالطوارئ فورا.",
    "footer.security": "بياناتك الصحية مشفرة لكل جلسة ولا تتم مشاركتها مع أي طرف ثالث.",

    // Landing Page
    "landing.badge": "الجيل القادم من الذكاء الاصطناعي السريري وسلامة الأدوية",
    "landing.hero.title": "مساعد طبي ذكي وآمن لإدارة أدويتك وصحتك",
    "landing.hero.sub": "فحص فوري للتعارضات الدوائية، تدقيق موانع الاستعمال أثناء الحمل، وإرشادات سريرية دقيقة على مدار الساعة مبنية على المراجع الطبية.",
    "landing.cta.signup": "إنشاء حساب مريض جديد",
    "landing.cta.signin": "تسجيل الدخول إلى البوابة",
    "landing.cta.demo": "تجربة العرض السريري",
    "landing.preview.pill": "جلسة سريرية نشطة",
    "landing.preview.alert_title": "فحص التعارضات نشط",
    "landing.preview.alert_desc": "فحص ليزينوبريل مع المسكنات وسلامة الحمل...",
    "landing.feat.title": "أمان سريري موثوق في كل خطوة",
    "landing.feat.sub": "مصمم لحماية المرضى من خلال معايرة ذكية للبيانات الصحية.",
    "landing.feat1.title": "فحص وتدقيق الأدوية النشطة",
    "landing.feat1.desc": "مطابقة الوصفات الطبية المتعددة والجرعات لتفادي التفاعلات الدوائية الخطرة.",
    "landing.feat2.title": "صحة الأم ومعايرة فترات الحمل",
    "landing.feat2.desc": "حساب تلقائي لأسابيع وأثلاث الحمل مع فلترة الأدوية المحظورة في كل مرحلة.",
    "landing.feat3.title": "ذكاء سريري مدعوم بالمراجع الطبية (RAG)",
    "landing.feat3.desc": "إجابات دقيقة للأعراض والتحاليل مستندة إلى إرشادات طبية معتمدة.",
    "landing.feat4.title": "أمان مشفر وخصوصية مطلقة",
    "landing.feat4.desc": "تشفير 256 بت مع حماية على مستوى الصفوف. بياناتك الصحية خاصة تماماً.",
    "landing.how.title": "كيف يعمل نظام أورا ميد؟"
  ,
    "landing.how.step1.title": "1. إدخال البيانات السريرية",
    "landing.how.step1.desc": "سجل مؤشراتك الحيوية والأمراض المزمنة والحساسيات في أقل من دقيقتين.",
    "landing.how.step2.title": "2. إضافة أدويتك الحالية",
    "landing.how.step2.desc": "أدخل أسماء وجرعات أدويتك اليومية لبناء سياقك العلاجي النشط.",
    "landing.how.step3.title": "3. استشر المساعد الذكي بثقة",
    "landing.how.step3.desc": "اطرح أسئلتك حول التفاعلات، تفويت الجرعات، أو الأعراض ليرد عليك بدقة تناسب حالتك.",
    "landing.bottom.title": "هل أنت مستعد لتجربة رعاية صحية أكثر أماناً؟",
    "landing.bottom.sub": "انضم إلى أورا ميد اليوم وتحكم في سلامة أدويتك وصحتك بكل ثقة.",

    // Login Page
    "login.title": "تسجيل الدخول | أورا ميد للذكاء الاصطناعي",
    "login.heading": "تسجيل دخول المريض",
    "login.subheading": "الوصول إلى مساعدك الطبي المخصص وسياق أدويتك النشطة.",
    "login.email.label": "البريد الإلكتروني أو معرّف المريض",
    "login.email.placeholder": "مثال: sarah.jenkins@example.com",
    "login.password.label": "كلمة المرور",
    "login.password.placeholder": "••••••••••••",
    "login.remember": "تذكر جلستي الآمنة",
    "login.forgot": "نسيت كلمة المرور؟",
    "login.btn": "تسجيل الدخول",
    "login.demo.btn": "ملء بيانات تجريبية (سارة جنكينز)",
    "login.no_account": "ليس لديك حساب مريض بعد؟",
    "login.signup_link": "إنشاء حساب مريض جديد",

    // Signup Page
    "signup.title": "إنشاء حساب مريض | أورا ميد",
    "signup.heading": "إنشاء حساب مريض جديد",
    "signup.subheading": "سجل للحصول على إرشادات سريرية ذكية ومستمرة لأدويتك وصحتك.",
    "signup.fullname.label": "الاسم الكامل",
    "signup.fullname.placeholder": "مثال: سارة جنكينز",
    "signup.email.label": "البريد الإلكتروني",
    "signup.email.placeholder": "مثال: sarah.jenkins@example.com",
    "signup.password.label": "كلمة المرور الآمنة",
    "signup.password.placeholder": "8 أحرف على الأقل تحتوي أحرفاً كبيرة وأرقاماً ورموزاً",
    "signup.strength.label": "قوة الأمان:",
    "signup.req.length": "8+ أحرف",
    "signup.req.upper": "حرف كبير",
    "signup.req.number": "رقم",
    "signup.req.special": "رمز خاص",
    "signup.terms": "أوافق على سياسة خصوصية البيانات الصحية وشروط الاستشارة السريرية الذكية.",
    "signup.btn": "إنشاء الحساب وبدء البيانات الطبية",
    "signup.has_account": "هل لديك حساب مريض بالفعل؟",
    "signup.signin_link": "تسجيل الدخول إلى حسابك",

    // Patient Form
    "form.title": "نموذج البيانات السريرية للمريض | أورا ميد",
    "form.heading": "البيانات السريرية للمريض",
    "form.subheading": "يرجى تقديم بياناتك الصحية لضبط تنبيهات التفاعلات الدوائية ومواعيد الجرعات.",
    "form.demo_prefill": "تعبئة بيانات سريرية تجريبية",
    "form.sec1.title": "1. البيانات الشخصية والمؤشرات الحيوية",
    "form.sec1.subtitle": "السياق الأساسي",
    "form.fullname.label": "الاسم القانوني الكامل",
    "form.dob.label": "تاريخ الميلاد",
    "form.gender.label": "الجنس",
    "form.gender.male": "ذكر",
    "form.gender.female": "أنثى",
    "form.maternal.title": "سياق صحة الأم والحمل",
    "form.maternal.pregnant.label": "هل أنتِ حامل حالياً؟",
    "form.maternal.no": "لا",
    "form.maternal.yes": "نعم، حامل حالياً",
    "form.maternal.weeks.label": "أسبوع الحمل (1–42)",
    "form.maternal.trimester.label": "الثلث التقديري للحمل",
    "form.blood.label": "فصيلة الدم",
    "form.height.label": "الطول (سم)",
    "form.weight.label": "الوزن (كجم)",
    "form.sec2.title": "2. السجل المرضي والحساسيات",
    "form.sec2.subtitle": "فحص المخاطر السريرية",
    "form.conditions.label": "الأمراض المزمنة المشخصة",
    "form.cond.hypertension": "+ ارتفاع ضغط الدم",
    "form.cond.diabetes": "+ السكري (النوع 2)",
    "form.cond.asthma": "+ ربو خفيف",
    "form.cond.lipid": "+ كوليسترول / دهون الدم",
    "form.cond.gerd": "+ ارتجاع المريء / حموضة",
    "form.cond.none": "لا يوجد",
    "form.conditions.custom.placeholder": "اكتب حالة أخرى واضغط إضافة",
    "form.allergies.label": "حساسيات الأدوية والتفاعلات المعروفة",
    "form.allergy.penicillin": "+ بنسلين",
    "form.allergy.sulfa": "+ مركبات السلفا",
    "form.allergy.aspirin": "+ أسبرين / مسكنات NSAID",
    "form.allergy.none": "لا توجد حساسية دوائية معروفة (NKDA)",
    "form.allergies.custom.placeholder": "اكتب اسم الدواء (مثل بنسلين) واضغط إضافة",
    "form.add_btn": "إضافة",
    "form.history.label": "العمليات الجراحية السابقة أو التنويم بالمستشفى",
    "form.history.placeholder": "مثال: استئصال الزائدة الدودية (2018)...",
    "form.skip": "تخطي الآن والمتابعة إلى المساعد ←",
    "form.submit": "حفظ ومتابعة إلى المساعد الذكي",

    // Assistant Page
    "assistant.title": "المساعد السريري الذكي | أورا ميد",
    "assistant.active_meds": "الأدوية النشطة",
    "assistant.add_med_btn": "إضافة دواء",
    "assistant.no_meds": "لا توجد أدوية مسجلة حالياً. اضغط '+ إضافة دواء' لتنبيه المساعد الذكي.",
    "assistant.evaluating": "جاري تحليل الملف السريري وفحص التفاعلات الدوائية...",
    "assistant.suggestions_label": "اقتراحات سريعة:",
    "assistant.sugg1": "🔍 فحص تعارض مضادات الالتهاب / الإيبوبروفين",
    "assistant.sugg2": "⏰ إرشادات نسيان جرعة الدواء الصباحية",
    "assistant.sugg3": "🩺 فحص الأعراض والآثار الجانبية للأدوية",
    "assistant.sugg4": "🥗 نصائح غذائية للتحكم في ضغط الدم",
    "assistant.prompt.placeholder": "اسأل المساعد الطبي عن أعراضك، جرعات أدويتك، أو الفحوصات...",
    "assistant.meds_in_context": "أدوية بالسياق",
    "assistant.no_meds_in_context": "لا توجد أدوية بالسياق",
    "assistant.press_enter": "اضغط Enter ↵ للإرسال",

    // Modal: Add Medicine
    "modal.add_med.title": "إضافة دواء إلى سياق المساعد الذكي",
    "modal.add_med.subtitle": "يُساعد في التحذير من التعارضات الدوائية ومواعيد الجرعات.",
    "modal.add_med.name.label": "اسم الدواء",
    "modal.add_med.name.placeholder": "مثال: ليزينوبريل أو باراسيتامول",
    "modal.add_med.dose.label": "الجرعة / القوة",
    "modal.add_med.dose.placeholder": "مثال: 500 ملجم أو 10 مل",
    "modal.add_med.freq.label": "تكرار الجرعة",
    "modal.add_med.freq.placeholder": "مثال: مرتين يومياً مع الوجبات",
    "modal.add_med.cancel": "إلغاء",
    "modal.add_med.submit": "إضافة إلى السياق النشط",

    // Accessibility Suite
    "a11y.title": "خيارات إمكانية الوصول والتيسير",
    "a11y.subtitle": "تخصيص العرض بما يناسب راحتك البصرية والقراءة",
    "a11y.btn.label": "إعدادات إمكانية الوصول",
    "a11y.font_size": "حجم النص",
    "a11y.font_normal": "افتراضي",
    "a11y.font_large": "كبير (+15%)",
    "a11y.font_xlarge": "كبير جداً (+30%)",
    "a11y.contrast": "تباين الألوان",
    "a11y.contrast_normal": "طبيعي",
    "a11y.contrast_high": "عالي التباين",
    "a11y.contrast_mono": "أحادي اللون (رمادي)",
    "a11y.dyslexia": "خط مريح لعسر القراءة",
    "a11y.line_spacing": "تباعد أسطر مريح",
    "a11y.highlight_links": "تمييز الروابط والعناصر التفاعلية",
    "a11y.reading_guide": "مسطرة تتبع القراءة",
    "a11y.reset": "استعادة الإعدادات الافتراضية",
    "a11y.close": "إغلاق"
  }
};

// ============================================================================
// 2. Internationalization & Theme Manager
// ============================================================================

const AppSettings = {
  currentLang: localStorage.getItem('auramed_lang') || 'en',
  currentTheme: localStorage.getItem('auramed_theme') || 'light',
  a11y: JSON.parse(localStorage.getItem('auramed_a11y') || '{"fontSize":"normal","contrast":"normal","dyslexia":false,"spacing":false,"highlightLinks":false,"readingGuide":false}'),

  init() {
    this.applyTheme(this.currentTheme);
    this.applyLanguage(this.currentLang);
    this.applyAccessibility();
    this.injectAccessibilityWidget();
    this.bindGlobalControls();
  },

  // --------------------------------------------------------------------------
  // Theme Controls (Dark Mode)
  // --------------------------------------------------------------------------
  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  },

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('auramed_theme', theme);
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      const icon = btn.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      }
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', theme === 'dark' ? 'Light Mode' : 'Dark Mode');
    });

    if (window.lucide) window.lucide.createIcons();
  },

  // --------------------------------------------------------------------------
  // Language Controls (i18n & RTL)
  // --------------------------------------------------------------------------
  toggleLanguage() {
    const nextLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.applyLanguage(nextLang);
  },

  applyLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('auramed_lang', lang);
    const root = document.documentElement;
    const isAr = lang === 'ar';

    root.setAttribute('lang', lang);
    root.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    
    if (isAr) {
      root.classList.add('lang-ar');
    } else {
      root.classList.remove('lang-ar');
    }

    // Translate all elements with data-i18n
    const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Translate titles & aria-labels
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
        el.setAttribute('aria-label', dict[key]);
      }
    });

    // Update language toggle buttons text
    document.querySelectorAll('[data-action="toggle-lang"]').forEach(btn => {
      const textSpan = btn.querySelector('.lang-label');
      if (textSpan) {
        textSpan.textContent = isAr ? 'English' : 'العربية';
      }
    });

    if (window.lucide) window.lucide.createIcons();
  },

  // --------------------------------------------------------------------------
  // Accessibility Suite Engine
  // --------------------------------------------------------------------------
  applyAccessibility() {
    localStorage.setItem('auramed_a11y', JSON.stringify(this.a11y));
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('a11y-text-large', 'a11y-text-xlarge');
    if (this.a11y.fontSize === 'large') root.classList.add('a11y-text-large');
    if (this.a11y.fontSize === 'xlarge') root.classList.add('a11y-text-xlarge');

    root.classList.remove('a11y-high-contrast', 'a11y-monochrome');
    if (this.a11y.contrast === 'high') root.classList.add('a11y-high-contrast');
    if (this.a11y.contrast === 'mono') root.classList.add('a11y-monochrome');

    if (this.a11y.dyslexia) {
      body.classList.add('a11y-dyslexic');
    } else {
      body.classList.remove('a11y-dyslexic');
    }

    if (this.a11y.spacing) {
      body.classList.add('a11y-enhanced-spacing');
    } else {
      body.classList.remove('a11y-enhanced-spacing');
    }

    if (this.a11y.highlightLinks) {
      body.classList.add('a11y-highlight-links');
    } else {
      body.classList.remove('a11y-highlight-links');
    }

    this.updateReadingGuide(this.a11y.readingGuide);
  },

  updateReadingGuide(enable) {
    let guide = document.getElementById('a11y-reading-ruler');
    if (enable) {
      if (!guide) {
        guide = document.createElement('div');
        guide.id = 'a11y-reading-ruler';
        guide.className = 'fixed left-0 right-0 h-8 bg-teal-500/15 border-y-2 border-teal-500/40 pointer-events-none z-50 transition-transform duration-75';
        document.body.appendChild(guide);
        window.addEventListener('mousemove', (e) => {
          if (guide) guide.style.top = `${e.clientY - 16}px`;
        });
      }
      guide.style.display = 'block';
    } else if (guide) {
      guide.style.display = 'none';
    }
  },

  // --------------------------------------------------------------------------
  // Inject Universal Accessibility Floating Widget & Modal
  // --------------------------------------------------------------------------
  injectAccessibilityWidget() {
    if (document.getElementById('a11yModalTrigger')) return;

    const trigger = document.createElement('button');
    trigger.id = 'a11yModalTrigger';
    trigger.type = 'button';
    trigger.className = 'fixed bottom-5 left-5 z-40 w-11 h-11 rounded-full bg-[#5B65DC] hover:bg-[#4A54CA] text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#8F9AF0] dark:bg-[#5B65DC] dark:hover:bg-[#6B75E6]';
    trigger.setAttribute('aria-label', 'Accessibility Options');
    trigger.setAttribute('title', 'Accessibility Toolbar');
    trigger.innerHTML = `<i data-lucide="accessibility" class="w-5 h-5"></i>`;

    const modal = document.createElement('div');
    modal.id = 'a11yModal';
    modal.className = 'hidden fixed inset-0 z-50 bg-[#122056]/50 backdrop-blur-xs flex items-center justify-center p-4 modal-overlay-enter';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'a11yModalTitle');

    modal.innerHTML = `
      <div class="bg-white dark:bg-[#111736] text-[#122056] dark:text-[#FAFAFD] rounded-2xl border border-[#E3E5F8] dark:border-[#1E285C] shadow-2xl max-w-md w-full p-5 sm:p-6 modal-card-enter">
        <div class="flex items-center justify-between pb-3 border-b border-[#E3E5F8] dark:border-[#1E285C]">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-[#EEEFFD] dark:bg-[#1C2555] text-[#5B65DC] dark:text-[#8F9AF0] flex items-center justify-center">
              <i data-lucide="accessibility" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 id="a11yModalTitle" class="text-sm font-bold font-sans" data-i18n="a11y.title">Accessibility Options</h3>
              <p class="text-[11px] text-[#47547E] dark:text-[#BAC4E6]" data-i18n="a11y.subtitle">Customize your visual & reading preferences</p>
            </div>
          </div>
          <button type="button" id="closeA11yBtn" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1C2555]" aria-label="Close">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="space-y-4 py-4 text-xs">
          <div>
            <span class="font-semibold block mb-1.5" data-i18n="a11y.font_size">Text Size</span>
            <div class="grid grid-cols-3 gap-1.5">
              <button type="button" data-a11y-action="font-normal" class="py-2 px-2.5 rounded-xl border border-[#E3E5F8] dark:border-[#1E285C] font-medium hover:border-[#5B65DC] transition-colors text-center text-xs">
                A (Default)
              </button>
              <button type="button" data-a11y-action="font-large" class="py-2 px-2.5 rounded-xl border border-[#E3E5F8] dark:border-[#1E285C] font-medium hover:border-[#5B65DC] transition-colors text-center text-sm font-bold">
                A+ (+15%)
              </button>
              <button type="button" data-a11y-action="font-xlarge" class="py-2 px-2.5 rounded-xl border border-[#E3E5F8] dark:border-[#1E285C] font-medium hover:border-[#5B65DC] transition-colors text-center text-base font-extrabold">
                A++ (+30%)
              </button>
            </div>
          </div>

          <div>
            <span class="font-semibold block mb-1.5" data-i18n="a11y.contrast">Visual Contrast</span>
            <div class="grid grid-cols-3 gap-1.5">
              <button type="button" data-a11y-action="contrast-normal" class="py-2 px-2 rounded-xl border border-[#E3E5F8] dark:border-[#1E285C] hover:border-[#5B65DC] transition-colors text-center">
                Standard
              </button>
              <button type="button" data-a11y-action="contrast-high" class="py-2 px-2 rounded-xl border border-[#E3E5F8] dark:border-[#1E285C] hover:border-[#5B65DC] transition-colors text-center font-bold">
                High Contrast
              </button>
              <button type="button" data-a11y-action="contrast-mono" class="py-2 px-2 rounded-xl border border-[#E3E5F8] dark:border-[#1E285C] hover:border-[#5B65DC] transition-colors text-center">
                Monochrome
              </button>
            </div>
          </div>

          <div class="space-y-2 pt-1 border-t border-[#E3E5F8] dark:border-[#1E285C]">
            <label class="flex items-center justify-between p-2 rounded-xl hover:bg-[#EEEFFD]/50 dark:hover:bg-[#1C2555]/50 cursor-pointer">
              <span class="font-medium" data-i18n="a11y.dyslexia">Dyslexia Friendly Font</span>
              <input type="checkbox" id="a11yDyslexiaToggle" class="rounded text-[#5B65DC] focus:ring-[#5B65DC] w-4 h-4" />
            </label>

            <label class="flex items-center justify-between p-2 rounded-xl hover:bg-[#EEEFFD]/50 dark:hover:bg-[#1C2555]/50 cursor-pointer">
              <span class="font-medium" data-i18n="a11y.line_spacing">Enhanced Line Spacing</span>
              <input type="checkbox" id="a11ySpacingToggle" class="rounded text-[#5B65DC] focus:ring-[#5B65DC] w-4 h-4" />
            </label>

            <label class="flex items-center justify-between p-2 rounded-xl hover:bg-[#EEEFFD]/50 dark:hover:bg-[#1C2555]/50 cursor-pointer">
              <span class="font-medium" data-i18n="a11y.highlight_links">Highlight Interactive Elements</span>
              <input type="checkbox" id="a11yLinksToggle" class="rounded text-[#5B65DC] focus:ring-[#5B65DC] w-4 h-4" />
            </label>

            <label class="flex items-center justify-between p-2 rounded-xl hover:bg-[#EEEFFD]/50 dark:hover:bg-[#1C2555]/50 cursor-pointer">
              <span class="font-medium" data-i18n="a11y.reading_guide">Reading Ruler Line</span>
              <input type="checkbox" id="a11yGuideToggle" class="rounded text-[#5B65DC] focus:ring-[#5B65DC] w-4 h-4" />
            </label>
          </div>
        </div>

        <div class="pt-3 border-t border-[#E3E5F8] dark:border-[#1E285C] flex items-center justify-between">
          <button type="button" id="a11yResetBtn" class="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium" data-i18n="a11y.reset">
            Reset Preferences
          </button>
          <button type="button" id="closeA11yBtnBottom" class="px-4 py-2 rounded-xl bg-[#5B65DC] hover:bg-[#4A54CA] text-white text-xs font-semibold shadow-sm" data-i18n="a11y.close">
            Done
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(modal);

    trigger.addEventListener('click', () => {
      modal.classList.remove('hidden');
      this.syncA11yModalUI();
    });

    const hideModal = () => modal.classList.add('hidden');
    document.getElementById('closeA11yBtn')?.addEventListener('click', hideModal);
    document.getElementById('closeA11yBtnBottom')?.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

    modal.querySelector('[data-a11y-action="font-normal"]')?.addEventListener('click', () => { this.a11y.fontSize = 'normal'; this.applyAccessibility(); this.syncA11yModalUI(); });
    modal.querySelector('[data-a11y-action="font-large"]')?.addEventListener('click', () => { this.a11y.fontSize = 'large'; this.applyAccessibility(); this.syncA11yModalUI(); });
    modal.querySelector('[data-a11y-action="font-xlarge"]')?.addEventListener('click', () => { this.a11y.fontSize = 'xlarge'; this.applyAccessibility(); this.syncA11yModalUI(); });

    modal.querySelector('[data-a11y-action="contrast-normal"]')?.addEventListener('click', () => { this.a11y.contrast = 'normal'; this.applyAccessibility(); this.syncA11yModalUI(); });
    modal.querySelector('[data-a11y-action="contrast-high"]')?.addEventListener('click', () => { this.a11y.contrast = 'high'; this.applyAccessibility(); this.syncA11yModalUI(); });
    modal.querySelector('[data-a11y-action="contrast-mono"]')?.addEventListener('click', () => { this.a11y.contrast = 'mono'; this.applyAccessibility(); this.syncA11yModalUI(); });

    document.getElementById('a11yDyslexiaToggle')?.addEventListener('change', (e) => { this.a11y.dyslexia = e.target.checked; this.applyAccessibility(); });
    document.getElementById('a11ySpacingToggle')?.addEventListener('change', (e) => { this.a11y.spacing = e.target.checked; this.applyAccessibility(); });
    document.getElementById('a11yLinksToggle')?.addEventListener('change', (e) => { this.a11y.highlightLinks = e.target.checked; this.applyAccessibility(); });
    document.getElementById('a11yGuideToggle')?.addEventListener('change', (e) => { this.a11y.readingGuide = e.target.checked; this.applyAccessibility(); });

    document.getElementById('a11yResetBtn')?.addEventListener('click', () => {
      this.a11y = { fontSize: 'normal', contrast: 'normal', dyslexia: false, spacing: false, highlightLinks: false, readingGuide: false };
      this.applyAccessibility();
      this.syncA11yModalUI();
    });

    if (window.lucide) window.lucide.createIcons();
  },

  syncA11yModalUI() {
    const modal = document.getElementById('a11yModal');
    if (!modal) return;

    ['font-normal', 'font-large', 'font-xlarge'].forEach(action => {
      const btn = modal.querySelector(`[data-a11y-action="${action}"]`);
      if (btn) {
        const isActive = (action === 'font-normal' && this.a11y.fontSize === 'normal') ||
                         (action === 'font-large' && this.a11y.fontSize === 'large') ||
                         (action === 'font-xlarge' && this.a11y.fontSize === 'xlarge');
        btn.classList.toggle('bg-teal-50', isActive);
        btn.classList.toggle('dark:bg-teal-950/60', isActive);
        btn.classList.toggle('border-teal-600', isActive);
        btn.classList.toggle('text-teal-800', isActive);
        btn.classList.toggle('dark:text-teal-300', isActive);
      }
    });

    ['contrast-normal', 'contrast-high', 'contrast-mono'].forEach(action => {
      const btn = modal.querySelector(`[data-a11y-action="${action}"]`);
      if (btn) {
        const isActive = (action === 'contrast-normal' && this.a11y.contrast === 'normal') ||
                         (action === 'contrast-high' && this.a11y.contrast === 'high') ||
                         (action === 'contrast-mono' && this.a11y.contrast === 'mono');
        btn.classList.toggle('bg-teal-50', isActive);
        btn.classList.toggle('dark:bg-teal-950/60', isActive);
        btn.classList.toggle('border-teal-600', isActive);
        btn.classList.toggle('text-teal-800', isActive);
        btn.classList.toggle('dark:text-teal-300', isActive);
      }
    });

    const dCheck = document.getElementById('a11yDyslexiaToggle');
    if (dCheck) dCheck.checked = !!this.a11y.dyslexia;

    const sCheck = document.getElementById('a11ySpacingToggle');
    if (sCheck) sCheck.checked = !!this.a11y.spacing;

    const lCheck = document.getElementById('a11yLinksToggle');
    if (lCheck) lCheck.checked = !!this.a11y.highlightLinks;

    const gCheck = document.getElementById('a11yGuideToggle');
    if (gCheck) gCheck.checked = !!this.a11y.readingGuide;
  },

  // --------------------------------------------------------------------------
  // Global Navbar Buttons Binding
  // --------------------------------------------------------------------------
  bindGlobalControls() {
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    });

    document.querySelectorAll('[data-action="toggle-lang"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleLanguage();
      });
    });
  }
};

// Initialize globally as early as possible
document.addEventListener('DOMContentLoaded', () => {
  AppSettings.init();
  window.AppSettings = AppSettings;
});
