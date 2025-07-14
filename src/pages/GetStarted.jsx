// src/pages/GetStarted.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const languages = {
  en: { languageLabel: "English", title: "Let’s Get You Started", subtitle: "Begin your personalized cancer care journey with ByOnco.", name: "Full Name", phone: "Phone Number", city: "City", language: "Preferred Language", disease: "Disease Type", stage: "Cancer Stage", insurance: "Insurance Provider", book: "Book Consultation", next: "Next", back: "Back" },
  hi: { languageLabel: "हिन्दी (Hindi)", title: "चलिए शुरुआत करें", subtitle: "ByOnco के साथ अपने कैंसर उपचार की व्यक्तिगत यात्रा शुरू करें।", name: "पूरा नाम", phone: "फोन नंबर", city: "शहर", language: "भाषा चुनें", disease: "रोग का प्रकार", stage: "कैंसर की अवस्था", insurance: "बीमा प्रदाता", book: "परामर्श बुक करें", next: "आगे", back: "पीछे" },
  mr: { languageLabel: "मराठी (Marathi)", title: "चला सुरुवात करूया", subtitle: "ByOnco सोबत तुमच्या कॅन्सर उपचाराची वैयक्तिक यात्रा सुरू करा.", name: "पूर्ण नाव", phone: "फोन नंबर", city: "शहर", language: "भाषा निवडा", disease: "रोग प्रकार", stage: "कॅन्सर टप्पा", insurance: "विमा प्रदाता", book: "सल्लामसलत बुक करा", next: "पुढे", back: "मागे" },
  ta: { languageLabel: "தமிழ் (Tamil)", title: "வாருங்கள் ஆரம்பிக்கலாம்", subtitle: "ByOnco உடன் உங்கள் தனிப்பட்ட புற்றுநோய் பயணத்தை தொடங்குங்கள்.", name: "முழு பெயர்", phone: "தொலைபேசி எண்", city: "நகரம்", language: "மொழியைத் தேர்வுசெய்க", disease: "நோயின் வகை", stage: "புற்றுநோய் கட்டம்", insurance: "காப்பீடு வழங்குநர்", book: "ஆலோசனையை முன்பதிவு செய்க", next: "அடுத்து", back: "பின்செல்" },
  te: { languageLabel: "తెలుగు (Telugu)", title: "ప్రారంభిద్దాం", subtitle: "ByOncoతో మీ వ్యక్తిగత క్యాన్సర్ సంరక్షణ ప్రయాణాన్ని ప్రారంభించండి.", name: "పూర్తి పేరు", phone: "ఫోన్ నంబర్", city: "నగరం", language: "భాషను ఎంచుకోండి", disease: "రోగం రకం", stage: "క్యాన్సర్ దశ", insurance: "ఇన్సూరెన్స్ ప్రొవైడర్", book: "సలహా బుక్ చేయండి", next: "తర్వాత", back: "వెనక్కి" },
  bn: { languageLabel: "বাংলা (Bengali)", title: "চলুন শুরু করি", subtitle: "ByOnco-এর সাথে আপনার ব্যক্তিগত ক্যান্সার যত্নের যাত্রা শুরু করুন।", name: "পূর্ণ নাম", phone: "ফোন নম্বর", city: "শহর", language: "ভাষা পছন্দ করুন", disease: "রোগের ধরন", stage: "ক্যান্সারের স্তর", insurance: "বীমা প্রদানকারী", book: "পরামর্শ বুক করুন", next: "পরবর্তী", back: "পেছনে" },
  kn: { languageLabel: "ಕನ್ನಡ (Kannada)", title: "ನೀವು ಪ್ರಾರಂಭಿಸೋಣ", subtitle: "ByOnco ನೊಂದಿಗೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕ್ಯಾನ್ಸರ್ ಪರಿಚಾರ ಸೇವೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ.", name: "ಪೂರ್ಣ ಹೆಸರು", phone: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ", city: "ನಗರ", language: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ", disease: "ರೋಗದ ಪ್ರಕಾರ", stage: "ಕ್ಯಾನ್ಸರ್ ಹಂತ", insurance: "ವಿಮೆ ಪೂರೈಕೆದಾರ", book: "ಸಲಹೆ ಬುಕ್ ಮಾಡಿ", next: "ಮುಂದೆ", back: "ಹಿಂದೆ" },
  gu: { languageLabel: "ગુજરાતી (Gujarati)", title: "ચાલો શરૂઆત કરીએ", subtitle: "ByOnco સાથે તમારી વ્યક્તિગત કેન્સર સંભાળ યાત્રા શરૂ કરો.", name: "પૂર્ણ નામ", phone: "ફોન નંબર", city: "શહેર", language: "ભાષા પસંદ કરો", disease: "રોગનો પ્રકાર", stage: "કૅન્સરનો તબક્કો", insurance: "વિમો પ્રદાતા", book: "કન્સલ્ટેશન બુક કરો", next: "આગળ", back: "પાછળ" },
  ml: { languageLabel: "മലയാളം (Malayalam)", title: "നമുക്ക് ആരംഭിക്കാം", subtitle: "ByOnco യുമായി നിങ്ങളുടെ വ്യക്തിഗത കാൻസർ പരിചരണ യാത്ര ആരംഭിക്കുക.", name: "പൂർണ്ണ നാമം", phone: "ഫോൺ നമ്പർ", city: "നഗരം", language: "ഭാഷ തിരഞ്ഞെടുക്കുക", disease: "രോഗത്തിന്റെ തരം", stage: "കാൻസർ ഘട്ടം", insurance: "ഇൻഷുറൻസ് ദാതാവ്", book: "കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക", next: "അടുത്തത്", back: "പുറത്ത്" },
  or: { languageLabel: "ଓଡ଼ିଆ (Odia)", title: "ଆରମ୍ଭ କରିବା", subtitle: "ByOnco ସହିତ ଆପଣଙ୍କର ବ୍ୟକ୍ତିଗତ କ୍ୟାନ୍ସର ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ।", name: "ପୁରା ନାମ", phone: "ଫୋନ୍ ନମ୍ବର", city: "ସହର", language: "ଭାଷା ଚୟନ କରନ୍ତୁ", disease: "ରୋଗ ପ୍ରକାର", stage: "କ୍ୟାନ୍ସର ଅବସ୍ଥା", insurance: "ବୀମା ପ୍ରଦାନକାରୀ", book: "ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ", next: "ଆଗକୁ", back: "ପଛକୁ" },
  pa: { languageLabel: "ਪੰਜਾਬੀ (Punjabi)", title: "ਆਓ ਸ਼ੁਰੂ ਕਰੀਏ", subtitle: "ByOnco ਨਾਲ ਆਪਣੀ ਨਿੱਜੀ ਕੈਂਸਰ ਸੰਭਾਲ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ।", name: "ਪੂਰਾ ਨਾਂ", phone: "ਫੋਨ ਨੰਬਰ", city: "ਸ਼ਹਿਰ", language: "ਭਾਸ਼ਾ ਚੁਣੋ", disease: "ਬਿਮਾਰੀ ਦੀ ਕਿਸਮ", stage: "ਕੈਂਸਰ ਦਾ ਪੜਾਅ", insurance: "ਬੀਮਾ ਪ੍ਰਦਾਤਾ", book: "ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ", next: "ਅਗਲਾ", back: "ਪਿੱਛੇ" },
  ur: { languageLabel: "اردو (Urdu)", title: "آئیے شروع کریں", subtitle: "ByOnco کے ساتھ اپنی ذاتی کینسر کی دیکھ بھال کا سفر شروع کریں۔", name: "پورا نام", phone: "فون نمبر", city: "شہر", language: "زبان منتخب کریں", disease: "بیماری کی قسم", stage: "کینسر کا مرحلہ", insurance: "انشورنس فراہم کنندہ", book: "مشورہ بُک کریں", next: "اگلا", back: "پیچھے" },
  as: { languageLabel: "অসমীয়া (Assamese)", title: "আহক আৰম্ভ কৰোঁ", subtitle: "ByOnco ৰ সৈতে আপোনাৰ ব্যক্তিগত কেঞ্চাৰ যত্ন যাত্ৰা আৰম্ভ কৰক।", name: "সম্পূৰ্ণ নাম", phone: "ফোন নম্বৰ", city: "চহৰ", language: "ভাষা বাচনি কৰক", disease: "ৰোগৰ প্ৰকাৰ", stage: "কেঞ্চাৰৰ পৰ্যায়", insurance: "বীমা প্ৰদানকাৰী", book: "পৰামৰ্শ বুক কৰক", next: "পিছলৈ", back: "আগলৈ" },
  ks: { languageLabel: "کٲشُر (Kashmiri)", title: "شروعات کریو", subtitle: "ByOnco سیتھ اپنا شخصی کینسر علاج شروع کریو۔", name: "پورا ناو", phone: "فون نمبر", city: "شہر", language: "زبان چنو", disease: "مرض کی قسم", stage: "کینسر مرحلہ", insurance: "انشورنس فراہم کنندہ", book: "مشورہ بُک کریو", next: "اگلا", back: "پیچھے" },
  kok: { languageLabel: "कोंकणी (Konkani)", title: "सुरवात करूया", subtitle: "ByOnco सोबत तुमका वैयक्तिक कॅन्सर उपचार यात्रा सुरू करात.", name: "पूर नाव", phone: "फोन नंबर", city: "शहर", language: "भाषा निवडात", disease: "रोग प्रकार", stage: "कॅन्सर टप्पो", insurance: "विमा पुरवणारा", book: "सल्ला बुक करा", next: "पुढे", back: "मागे" },
  doi: { languageLabel: "डोगरी (Dogri)", title: "शुरू करां", subtitle: "ByOnco दे नाल अपन कैंसर इलाज दी यात्रा शुरू करो।", name: "पूरा नांव", phone: "फोन नंबर", city: "शहर", language: "भाषा चुनो", disease: "बीमारी दी किस्म", stage: "कैंसर दा स्टेज", insurance: "बीमा कंपनी", book: "कंसल्टेशन बुक करो", next: "आगे", back: "पीछे" },
  ne: { languageLabel: "नेपाली (Nepali)", title: "सुरु गरौं", subtitle: "ByOnco सँग तपाईको व्यक्तिगत क्यान्सर उपचार यात्रा सुरु गर्नुहोस्।", name: "पूरा नाम", phone: "फोन नम्बर", city: "शहर", language: "भाषा छान्नुहोस्", disease: "रोग प्रकार", stage: "क्यान्सरको चरण", insurance: "बीमा प्रदायक", book: "परामर्श बुक गर्नुहोस्", next: "अर्को", back: "पछाडि" },
  sa: { languageLabel: "संस्कृतम् (Sanskrit)", title: "आरभामः", subtitle: "ByOnco सह आत्मनः कर्करोगचिकित्सायाः यात्रा आरभाम।", name: "पूर्णं नाम", phone: "दूरवाणी संख्या", city: "नगरं", language: "भाषा चयनं कुर्वन्तु", disease: "रोगप्रकारः", stage: "कर्करोगः चरणः", insurance: "बीमा प्रदाता", book: "परामर्शं बुक कुरुत", next: "अन्यतमः", back: "पृष्ठतः" },
  brx: { languageLabel: "बोडो (Bodo)", title: "आओ सुरू करा", subtitle: "ByOnco निफ्राय बायोबाखाय आरो सारथि आरो लाजाय सुरू करा।", name: "फुल नाय", phone: "फोन नम्बर", city: "नगर", language: "बोली बाइ", disease: "बायोबाखाय प्रजाती", stage: "बायोबाखाय फेज", insurance: "बीमा प्राभाइडर", book: "सलाह बुक करा", next: "फिराइ", back: "घोराइ" },
  mai: { languageLabel: "मैथिली (Maithili)", title: "चलू शुरू करी", subtitle: "ByOnco सँग अपन व्यक्तिगत कैंसर देखभाल यात्रा शुरू करी।", name: "पूरा नाम", phone: "फोन नंबर", city: "नगर", language: "भाषा चुनू", disease: "रोग प्रकार", stage: "कैंसर अवस्था", insurance: "बीमा प्रदाता", book: "परामर्श बुक करू", next: "आगू", back: "पाछाँ" }
};


export default function GetStarted() {
  const [lang, setLang] = useState("en");
  const [form, setForm] = useState({ name: "", phone: "", city: "", disease: "", stage: "", insurance: "" });
  const [step, setStep] = useState(0);
  const recognitionRef = useRef(null);

  const t = languages[lang];
  const fields = ["name", "phone", "city", "disease", "stage", "insurance"];
  const currentField = fields[step];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert(t.book + " ✅");
  };

  const startListening = (field) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang + "-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setForm((prev) => ({ ...prev, [field]: transcript }));
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9fafc] to-[#eef2f7] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="mb-5">
          <label htmlFor="lang" className="block text-sm font-medium text-gray-700 mb-1">
            {t.language}
          </label>
          <select
            id="lang"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm overflow-y-auto"
          >
            {Object.entries(languages).map(([key, val]) => (
              <option key={key} value={key}>{val.languageLabel}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              name={currentField}
              type="text"
              required={currentField !== "insurance"}
              placeholder={t[currentField]}
              value={form[currentField]}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
            <button
              type="button"
              onClick={() => startListening(currentField)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
              title="Voice input"
            >
              🎙️
            </button>
          </div>

          <div className="flex justify-between items-center">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 text-sm text-blue-600 hover:underline"
              >
                ⬅ {t.back}
              </button>
            )}
            {step < fields.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="ml-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-md"
              >
                {t.next} ➡
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors duration-200"
>
                {t.book}
              </button>

            )}
          </div>
        </form>
      </motion.div>
    </main>
  );
}
