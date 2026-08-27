import type { TranslationKey } from './en';

/**
 * Hindi.
 *
 * Typed as `Record<TranslationKey, string>` against the English key set, so a
 * key added to `en.ts` and missed here fails the type check.
 *
 * TRANSLATION STATUS: these are working translations written during
 * implementation, not reviewed by a native Hindi speaker. Register is
 * deliberately plain modern Hindi (the everyday spoken register), not
 * Sanskritised formal Hindi, because the product speaks to the user directly.
 * Fitness vocabulary that Indian gym-goers actually use in English —
 * "cardio", "HIIT", "gym", "BMI" — is intentionally left in Devanagari
 * transliteration or English rather than translated to unfamiliar coinages.
 * Flag for review before launch.
 */
export const hi: Record<TranslationKey, string> = {
  /* ── brand / shell ───────────────────────────────────────────── */
  'brand.name': 'गुरुकुल',
  'common.continue': 'आगे बढ़ें',
  'common.back': 'पीछे',
  'common.skip': 'छोड़ें',
  'common.startOver': 'फिर से शुरू करें',
  'common.step': 'चरण {current} / {total}',
  'common.selectAllThatApply': 'जो लागू हों सब चुनें',
  'common.loading': 'लोड हो रहा है…',
  'common.or': 'या',
  'common.optional': 'वैकल्पिक',

  /* ── language ────────────────────────────────────────────────── */
  'language.label': 'भाषा',
  'language.en': 'English',
  'language.hi': 'हिन्दी',

  /* ── landing ─────────────────────────────────────────────────── */
  'landing.eyebrow': 'व्यक्तिगत कोचिंग',
  'landing.headline.line1': 'हम देखते हैं।',
  'landing.headline.line2': 'हम राह दिखाते हैं।',
  'landing.headline.line3': 'आप बदलते हैं।',
  'landing.body':
    'अपने बेहतर रूप की ओर आपकी यात्रा यहीं से शुरू होती है। हम आपके लक्ष्यों के अनुसार एक व्यक्तिगत अनुभव बना रहे हैं — शुरुआत कुछ सवालों से होती है, और खाता बनाने की ज़रूरत नहीं।',
  'landing.cta': 'अपनी यात्रा शुरू करें',
  'landing.reassurance.noCard': 'कार्ड की ज़रूरत नहीं',
  'landing.reassurance.quick': 'दो मिनट में सेटअप',
  'landing.reassurance.leave': 'कभी भी छोड़ सकते हैं',
  'landing.footer': 'यह एक शुरुआती संस्करण है — पूरा गुरुकुल अनुभव अभी बन रहा है।',

  /* ── sections ────────────────────────────────────────────────── */
  'section.profile': 'आपके बारे में',
  'section.goal': 'आपका लक्ष्य',
  'section.experience': 'आपका अनुभव',
  'section.environment': 'आप कहाँ ट्रेनिंग करते हैं',
  'section.equipment': 'आपके पास क्या है',
  'section.time': 'आपका समय',
  'section.preference': 'आपको कैसी ट्रेनिंग पसंद है',
  'section.motivation': 'सफलता का अर्थ',
  'section.lifestyle': 'आपका दिन',
  'section.measurements': 'आपके माप',

  /* ── Q1 gender ───────────────────────────────────────────────── */
  'q.gender.title': 'आप इनमें से क्या हैं?',
  'q.gender.helper': 'इससे हम ट्रेनिंग की मात्रा और रिकवरी तय करते हैं।',
  'q.gender.male': 'पुरुष',
  'q.gender.female': 'महिला',

  /* ── Q2 primary goal ─────────────────────────────────────────── */
  'q.goal.title': 'आप क्या हासिल करना चाहते हैं?',
  'q.goal.helper': 'जो सबसे ज़रूरी है वही चुनें। आगे सब कुछ इसी के अनुसार बनेगा।',
  'q.goal.buildMuscle': 'मसल बनाना',
  'q.goal.buildMuscle.desc': 'व्यवस्थित ट्रेनिंग से आकार और मज़बूती',
  'q.goal.loseFat': 'फैट कम करना',
  'q.goal.loseFat.desc': 'हल्का और फिट, बिना किसी अति के',
  'q.goal.getStronger': 'ताक़त बढ़ाना',
  'q.goal.getStronger.desc': 'हर हफ़्ते बढ़ती असली क्षमता',
  'q.goal.improveFitness': 'फिटनेस सुधारना',
  'q.goal.improveFitness.desc': 'संपूर्ण सेहत और ऊर्जा',
  'q.goal.buildStamina': 'स्टैमिना बढ़ाना',
  'q.goal.buildStamina.desc': 'सांस, सहनशक्ति और टिकाव',

  /* ── Q3 fitness level ────────────────────────────────────────── */
  'q.level.title': 'आपकी ट्रेनिंग आज कहाँ है?',
  'q.level.helper': 'सच बताइए — योजना दोनों तरह से ढल जाएगी।',
  'q.level.beginner': 'अभी शुरुआत',
  'q.level.beginner.desc': 'ट्रेनिंग नई है, या लंबे अंतराल के बाद वापसी',
  'q.level.some': 'थोड़ा अनुभव',
  'q.level.some.desc': 'कभी-कभी ट्रेनिंग की है, बुनियादी बातें पता हैं',
  'q.level.intermediate': 'मध्यम',
  'q.level.intermediate.desc': 'छह महीने या उससे अधिक नियमित ट्रेनिंग',
  'q.level.advanced': 'उन्नत',
  'q.level.advanced.desc': 'वर्षों का अभ्यास, ख़ुद योजना बना लेते हैं',

  /* ── Q4 training location ────────────────────────────────────── */
  'q.location.title': 'आप कहाँ ट्रेनिंग करना पसंद करते हैं?',
  'q.location.helper': 'जो जगह असल में उपलब्ध है, उसी के अनुसार योजना बनेगी।',
  'q.location.gym': 'जिम में',
  'q.location.gym.desc': 'पूरी सुविधा, सभी उपकरण',
  'q.location.home': 'घर पर',
  'q.location.home.desc': 'अपनी जगह, अपने समय पर',
  'q.location.outdoors': 'बाहर',
  'q.location.outdoors.desc': 'खुली हवा, पार्क और मैदान',
  'q.location.mixed': 'कई जगह',
  'q.location.mixed.desc': 'जैसा दिन अनुमति दे',

  /* ── Q5 equipment ────────────────────────────────────────────── */
  'q.equipment.title': 'आपके पास कौन-कौन से उपकरण हैं?',
  'q.equipment.helper': 'जो लागू हों सब चुनें।',
  'q.equipment.fullGym': 'पूरा जिम',
  'q.equipment.fullGym.desc': 'रैक, मशीनें, सभी वज़न',
  'q.equipment.dumbbells': 'डम्बल',
  'q.equipment.dumbbells.desc': 'एडजस्टेबल या फ़िक्स्ड वज़न की जोड़ी',
  'q.equipment.basic': 'बुनियादी उपकरण',
  'q.equipment.basic.desc': 'केटलबेल, मैट, बेंच या ऐसा कुछ',
  'q.equipment.none': 'कोई उपकरण नहीं',
  'q.equipment.none.desc': 'केवल बॉडीवेट — यह भी पूरी तरह कारगर है',
  'q.equipment.mixed': 'बदलता रहता है',
  'q.equipment.mixed.desc': 'अलग दिन अलग उपकरण',

  /* ── Q6 session duration ─────────────────────────────────────── */
  'q.duration.title': 'एक सत्र वास्तव में कितना लंबा हो सकता है?',
  'q.duration.helper': 'लंबाई से ज़्यादा नियमितता मायने रखती है।',
  'q.duration.short': '15–20 मिनट',
  'q.duration.short.desc': 'छोटे, केंद्रित सत्र',
  'q.duration.medium': '30 मिनट',
  'q.duration.medium.desc': 'स्थिर और टिकाऊ अवधि',
  'q.duration.long': '45 मिनट',
  'q.duration.long.desc': 'पूरे सत्र के लिए पर्याप्त',
  'q.duration.extended': '60+ मिनट',
  'q.duration.extended.desc': 'बिना जल्दबाज़ी, पूरा अभ्यास',
  'q.duration.varies': 'बदलता रहता है',
  'q.duration.varies.desc': 'अलग दिन अलग समय',

  /* ── Q7 training days ────────────────────────────────────────── */
  'q.days.title': 'हफ़्ते में कितने दिन आप वास्तव में ट्रेनिंग कर सकते हैं?',
  'q.days.helper': 'अपने सबसे अच्छे हफ़्ते का नहीं, आम हफ़्ते का जवाब दें।',
  'q.days.two': '2 दिन',
  'q.days.two.desc': 'असली प्रगति के लिए पर्याप्त',
  'q.days.three': '3 दिन',
  'q.days.three.desc': 'सबसे आम और टिकाऊ लय',
  'q.days.four': '4 दिन',
  'q.days.four.desc': 'काम को बाँटने की गुंजाइश',
  'q.days.five': '5 दिन',
  'q.days.five.desc': 'एक प्रतिबद्ध साप्ताहिक ढाँचा',
  'q.days.sixPlus': '6+ दिन',
  'q.days.sixPlus.desc': 'ट्रेनिंग पहले से आपके दिन का हिस्सा है',

  /* ── Q8 workout preference ───────────────────────────────────── */
  'q.preference.title': 'आपको कैसी ट्रेनिंग पसंद है?',
  'q.preference.helper': 'जो पसंद हों सब चुनें। योजना उसी ओर झुकेगी जो आप असल में करेंगे।',
  'q.preference.strength': 'ताक़त',
  'q.preference.strength.desc': 'भारी वज़न, कम दोहराव',
  'q.preference.muscle': 'मसल बिल्डिंग',
  'q.preference.muscle.desc': 'मध्यम वज़न, अधिक मात्रा',
  'q.preference.cardio': 'कार्डियो',
  'q.preference.cardio.desc': 'दौड़, साइकिल, रोइंग',
  'q.preference.hiit': 'HIIT',
  'q.preference.hiit.desc': 'छोटे तेज़ दौर, थोड़ा आराम',
  'q.preference.mobility': 'लचीलापन',
  'q.preference.mobility.desc': 'गति की सीमा, स्ट्रेचिंग, नियंत्रण',
  'q.preference.mixed': 'मिला-जुला',
  'q.preference.mixed.desc': 'विविधता दिलचस्प बनाए रखती है',

  /* ── Q9 motivation ───────────────────────────────────────────── */
  'q.motivation.title': 'किस बात से आपको सफलता महसूस होगी?',
  'q.motivation.helper': 'यहाँ कोई ग़लत जवाब नहीं है।',
  'q.motivation.look': 'बेहतर दिखना',
  'q.motivation.look.desc': 'आईने में दिखने वाला बदलाव',
  'q.motivation.strong': 'मज़बूत महसूस करना',
  'q.motivation.strong.desc': 'रोज़मर्रा के जीवन में सक्षम',
  'q.motivation.health': 'सेहत सुधारना',
  'q.motivation.health.desc': 'ऊर्जा, नींद और दीर्घकालिक सेहत',
  'q.motivation.confidence': 'आत्मविश्वास बढ़ाना',
  'q.motivation.confidence.desc': 'आपके व्यक्तित्व में झलक',
  'q.motivation.consistency': 'नियमित बनना',
  'q.motivation.consistency.desc': 'लगातार आना ही जीत है',
  'q.motivation.stress': "तनाव कम करना",
  'q.motivation.stress.desc': "दिन का दबाव कहीं निकालने की जगह",
  'q.motivation.calm': "शांत महसूस करना",
  'q.motivation.calm.desc': "स्थिर मन और बेहतर नींद",
  'q.motivation.wellbeingNote': "ट्रेनिंग आपके मन को सहारा दे सकती है, पर यह पेशेवर मानसिक स्वास्थ्य देखभाल का विकल्प नहीं है। परेशानी हो तो कृपया किसी विशेषज्ञ से बात करें।",
  'q.motivation.performance': 'प्रदर्शन सुधारना',
  'q.motivation.performance.desc': 'खेल या कोई ख़ास क्षमता',

  /* ── Q10 activity level ──────────────────────────────────────── */
  'q.activity.title': 'आपका आम दिन कितना सक्रिय रहता है?',
  'q.activity.helper': 'ट्रेनिंग के अलावा। इससे तय होता है कि कितनी रिकवरी चाहिए।',
  'q.activity.sedentary': 'ज़्यादातर बैठे',
  'q.activity.sedentary.desc': 'डेस्क का काम, कम चलना',
  'q.activity.light': 'थोड़ा सक्रिय',
  'q.activity.light.desc': 'दिन में कुछ चलना-फिरना',
  'q.activity.moderate': 'मध्यम सक्रिय',
  'q.activity.moderate.desc': 'नियमित रूप से पैरों पर',
  'q.activity.veryActive': 'बहुत सक्रिय',
  'q.activity.veryActive.desc': 'शारीरिक काम या लगातार गतिविधि',

  /* ── Q11–13 measurements ─────────────────────────────────────── */
  'q.age.title': 'आपकी उम्र क्या है?',
  'q.age.helper': 'उम्र के साथ रिकवरी बदलती है — इससे योजना यथार्थ रहती है।',
  'q.height.title': 'आपकी लंबाई कितनी है?',
  'q.height.helper': 'वज़न के साथ BMI निकालने और गति की सीमा तय करने के लिए।',
  'q.weight.title': 'आपका वर्तमान वज़न क्या है?',
  'q.weight.helper': 'यह शुरुआत है, कोई फ़ैसला नहीं। इससे वज़न का आधार तय होता है।',

  'measure.range': '{min} और {max} {unit} के बीच',
  'measure.outOfRange': '{min} और {max} {unit} के बीच का मान डालें',
  'measure.heightHint': 'फुट और इंच। इकाई बदलने पर आपका माप बना रहता है।',
  'validation.inchesRange': 'इंच 0 और {max} के बीच होना चाहिए',
  'measure.unit': 'इकाई',
  'measure.unit.years': 'वर्ष',
  'measure.unit.cm': 'सेमी',
  'measure.unit.ftin': 'फुट/इंच',
  'measure.unit.kg': 'कि.ग्रा.',
  'measure.unit.lb': 'पाउंड',
  'measure.feet': 'फुट',
  'measure.inches': 'इंच',

  /* ── validation ──────────────────────────────────────────────── */
  'validation.required': 'आगे बढ़ने के लिए एक विकल्प चुनें',
  'validation.chooseAtLeast': 'आगे बढ़ने के लिए कम से कम {count} चुनें',
  'validation.chooseAtLeastOne': 'आगे बढ़ने के लिए कम से कम एक विकल्प चुनें',
  'validation.integerOnly': 'कृपया पूर्ण संख्या डालें',
  'validation.invalidNumber': 'कृपया एक संख्या डालें',

  /* ── analysis ────────────────────────────────────────────────── */
  'analysis.preparing.title': 'आपके जवाब समझ रहे हैं…',
  'analysis.preparing.body': 'हम आपकी शुरुआती दिशा तैयार कर रहे हैं।',
  'analysis.eyebrow': 'आपका विश्लेषण',
  'analysis.title': 'हम आपके बारे में यह समझते हैं',
  'analysis.summary.goal': 'लक्ष्य',
  'analysis.summary.level': 'अनुभव',
  'analysis.summary.location': 'जगह',
  'analysis.summary.equipment': 'उपकरण',
  'analysis.summary.time': 'सत्र की लंबाई',
  'analysis.summary.days': 'हफ़्ते में दिन',
  'analysis.summary.activity': 'दैनिक सक्रियता',
  'analysis.summary.age': 'उम्र',
  'analysis.summary.height': 'लंबाई',
  'analysis.summary.weight': 'वज़न',

  'bmi.title': 'आपका BMI',
  'bmi.calculated': 'आपका गणना किया गया BMI {value} है',
  'bmi.range.label': 'आम तौर पर स्वस्थ माना जाने वाला दायरा',
  'bmi.range.value': '18.5 – 24.9',
  'bmi.category.under': 'आपका परिणाम आम तौर पर स्वस्थ माने जाने वाले BMI दायरे से नीचे है।',
  'bmi.category.healthy': 'आपका परिणाम आम तौर पर स्वस्थ माने जाने वाले BMI दायरे में है।',
  'bmi.category.over': 'आपका परिणाम आम तौर पर स्वस्थ माने जाने वाले BMI दायरे से ऊपर है।',
  'bmi.category.high': 'आपका परिणाम आम तौर पर स्वस्थ माने जाने वाले BMI दायरे से काफ़ी ऊपर है।',
  'bmi.disclaimer':
    'BMI एक सामान्य स्क्रीनिंग माप है। यह मसल, शरीर की संरचना, ढाँचे के आकार या वितरण को नहीं गिनता, इसलिए यह व्यक्तियों से ज़्यादा समूहों का वर्णन करता है। यह कोई निदान नहीं है — अपनी सेहत के बारे में डॉक्टर से बात करें।',

  'plan.eyebrow': 'आपकी शुरुआती दिशा',
  'plan.title': '{focus}',
  'plan.rationale':
    'आपके लक्ष्य, अनुभव और उपलब्ध समय के आधार पर, हमने आपकी शुरुआती दिशा {focusLower} के इर्द-गिर्द बनाई है।',
  'plan.focus': 'फ़ोकस',
  'plan.frequency': 'नियमितता',
  'plan.frequency.value': '{days} दिन / हफ़्ता',
  'plan.session': 'सत्र की लंबाई',
  'plan.session.value': '{minutes} मिनट',
  'plan.difficulty': 'शुरुआती कठिनाई',
  'plan.environment': 'जगह',
  'plan.equipment': 'उपकरण',
  'plan.adjusted.frequency':
    'आपने {asked} दिन बताए थे। हमने योजना {given} दिन की रखी है ताकि इस चरण पर रिकवरी का समय बचे — जब काम आसान लगने लगे तो इसे बढ़ा सकते हैं।',
  'plan.notMedical': 'ये ट्रेनिंग सुझाव हैं, चिकित्सकीय सलाह नहीं।',
  'plan.previewNote':
    'यह आपकी शुरुआती दिशा है। सत्र-दर-सत्र कार्यक्रम हम अभी बना रहे हैं — वह तैयार नहीं है, और हम उसे गढ़ने के बजाय कुछ न दिखाना बेहतर मानते हैं।',
  'plan.cta': 'मेरी योजना सहेजें',
  'plan.ctaHelper': 'खाता बनाएँ ताकि आपके जवाब और योजना सुरक्षित रहें।',

  /* ── focus labels ────────────────────────────────────────────── */
  'focus.beginnerFoundation': 'शुरुआती आधार',
  'focus.strengthMuscle': 'ताक़त और मसल बिल्डिंग',
  'focus.hypertrophy': 'हाइपरट्रॉफ़ी',
  'focus.strength': 'ताक़त',
  'focus.leanConditioning': 'लीन कंडीशनिंग',
  'focus.enduranceBase': 'सहनशक्ति का आधार',
  'focus.generalFitness': 'सामान्य फिटनेस',
  'focus.mobilityFoundation': 'लचीलापन और आधार',

  'difficulty.gentle': 'हल्का',
  'difficulty.beginner': 'शुरुआती',
  'difficulty.moderate': 'मध्यम',
  'difficulty.challenging': 'चुनौतीपूर्ण',

  /* ── auth ────────────────────────────────────────────────────── */
  'auth.signup.title': 'अपना खाता बनाएँ',
  'auth.signup.subtitle': 'ताकि आपके जवाब और योजना सहेजी जा सकें।',
  'auth.login.title': 'वापस स्वागत है',
  'auth.login.subtitle': 'जहाँ छोड़ा था वहीं से जारी रखने के लिए लॉग इन करें।',
  'auth.email': 'ईमेल',
  'auth.password': 'पासवर्ड',
  'auth.confirmPassword': 'पासवर्ड दोहराएँ',
  'auth.createAccount': 'खाता बनाएँ',
  'auth.logIn': 'लॉग इन',
  'auth.logOut': 'लॉग आउट',
  'auth.forgotPassword': 'पासवर्ड भूल गए?',
  'auth.haveAccount': 'पहले से खाता है?',
  'auth.noAccount': 'खाता नहीं है?',
  'auth.continueWithGoogle': 'Google से जारी रखें',
  'auth.passwordHint': 'कम से कम 8 अक्षर',
  'auth.error.emailRequired': 'कृपया अपना ईमेल डालें',
  'auth.error.emailInvalid': 'कृपया सही ईमेल पता डालें',
  'auth.error.passwordRequired': 'कृपया पासवर्ड डालें',
  'auth.error.passwordTooShort': 'पासवर्ड कम से कम 8 अक्षर का हो',
  'auth.error.passwordMismatch': 'पासवर्ड मेल नहीं खा रहे',
  'auth.error.emailTaken': 'इस ईमेल से खाता पहले से मौजूद है',
  'auth.error.invalidCredentials': 'यह ईमेल और पासवर्ड मेल नहीं खाए',
  'auth.error.network': 'सर्वर से संपर्क नहीं हो सका। कनेक्शन जाँचें और फिर कोशिश करें।',
  'auth.error.sessionExpired': 'आपका सत्र समाप्त हो गया। कृपया फिर लॉग इन करें।',
  'auth.error.unknown': 'हमारी तरफ़ कुछ ग़लत हुआ। कृपया फिर कोशिश करें।',
  'auth.error.notConfigured':
    'इस संस्करण में खाते अभी उपलब्ध नहीं हैं — प्रमाणीकरण बैकएंड अभी बन रहा है। तब तक आपके जवाब इसी डिवाइस पर सुरक्षित हैं।',
  'auth.notConfigured.badge': 'अभी उपलब्ध नहीं',

  'auth.signUp': 'साइन अप',
  'auth.name': 'नाम',
  'auth.backToLogIn': 'लॉग इन पर वापस',
  'auth.error.nameTooLong': 'कृपया 80 अक्षर या उससे कम रखें',
  'auth.error.confirmRequired': 'कृपया पासवर्ड की पुष्टि करें',
  'auth.signup.carryAnswers':
    'अब तक के आपके {count} जवाब आपके खाते में सुरक्षित हो जाएँगे। कुछ नहीं खोएगा।',
  'auth.reset.title': 'पासवर्ड फिर से सेट करें',
  'auth.reset.subtitle': 'नया पासवर्ड चुनने का लिंक हम आपको ईमेल कर देंगे।',
  'auth.reset.action': 'लिंक भेजें',
  'auth.reset.hint': 'वही ईमेल जिससे आपने खाता बनाया था',
  'auth.reset.sentTitle': 'अपना ईमेल देखें',
  'auth.reset.sentBody':
    'अगर {email} के लिए कोई खाता है, तो लिंक भेजा जा चुका है। यह लिंक एक घंटे में समाप्त हो जाएगा।',

  /* ── खाता मेनू ────────────────────────────────────────────────── */
  'account.menuLabel': 'खाता',
  'account.profile': 'मेरी प्रोफ़ाइल',
  'account.plan': 'मेरा प्लान',
  'account.settings': 'सेटिंग्स',
  'account.memberSince': 'सदस्य बने',
  'account.answersSaved': 'सुरक्षित जवाब',
  'account.viewResults': 'मेरे नतीजे देखें',
  'account.inDevelopment.badge': 'बन रहा है',
  'account.plan.inDevelopment':
    'आपका ट्रेनिंग प्लान अभी तैयार नहीं हुआ है। सवाल और आपके नतीजे पहला कदम हैं; प्लान आगे के रिलीज़ में आएगा।',
  'account.settings.inDevelopment':
    'खाता सेटिंग्स अभी बन रही हैं। तब तक भाषा किसी भी स्क्रीन के हेडर से बदली जा सकती है।',

  /* ── प्रीव्यू मोड (जब तक बैकएंड जुड़ा नहीं है) ──────────────────── */
  'preview.enter': 'लॉग-इन वाली स्क्रीन देखें',
  'preview.badge': 'प्रीव्यू',
  'preview.explain': 'यह असली खाता नहीं है। कुछ भी सर्वर पर सेव नहीं होता।',
  'preview.exit': 'प्रीव्यू से बाहर',
  'preview.notice':
    'यह लॉग-इन वाली स्क्रीन का प्रीव्यू है। कोई खाता मौजूद नहीं है और कुछ भी सर्वर पर सेव नहीं होता — नीचे के आँकड़े इसी डिवाइस पर सेव जवाबों से आए हैं।',
};
