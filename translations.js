const TRANSLATIONS = {
    en: {
        appTitle: "Assist++",
        tagline: "Digital Safety Companion",
        stepInputHeader: "Analyze Suspicious Message",
        stepInputDesc: "Paste the text below to detect scams & threats.",
        placeholder: "Paste the suspicious message here...",
        analyzeBtn: "Analyze Risk",
        threatHeader: "Potential Sensitive Threat",
        threatDesc: "Does this message threaten to share your private photos or videos?",
        yesBtn: "YES, it does",
        noBtn: "NO, it doesn't",
        riskHeader: "Risk Analysis",
        analyzing: "One moment...",
        riskLabel: "Risk Level",
        typeLabel: "Primary Type",
        nextGuidanceBtn: "Next: What should I do?",
        startOverBtn: "Start Over",
        guidanceHeader: "Recommended Actions",
        guidanceDesc: "Follow these steps to stay safe.",
        nextReportBtn: "Next: Report Template",
        backBtn: "Back",
        reportHeader: "Report Template",
        reportDesc: "Use this generated text to report to authorities or platforms.",
        downloadBtn: "Download Summary PDF",
        analyzeAnotherBtn: "Analyze Another Message",
        miniToolHeader: "Or scan a profile link",
        checkBtn: "Check",
        riskHigh: "HIGH",
        riskMedium: "MEDIUM",
        riskLow: "LOW",
        riskSafe: "SAFE",
        typeSextortion: "Sextortion / Harassment",
        typeScam: "Financial Scam",
        typeIntimidation: "Intimidation",
        typeSpam: "Spam / Phishing",
        summaryHigh: "Immediate Action Recommended",
        summaryMedium: "Proceed with Caution",
        summaryLow: "Appears Safe",
        reasons: {
            money: "Requests for money or transfer",
            photo: "Mentions private images/videos",
            threat: "Threatening language detected",
            scam: "Common scam keywords used",
            none: "No specific keywords found, but stay alert."
        },
        guidance: {
            sextortion: [
                { title: "Do NOT Pay", desc: "Paying never makes it stop. They will ask for more." },
                { title: "Block & Report", desc: "Block the sender immediately on all platforms." },
                { title: "Save Evidence", desc: "Take screenshots of everything before blocking." },
                { title: "Deactivate Temporarily", desc: "Consider deactivating your social accounts for a few days." }
            ],
            scam: [
                { title: "Stop Communication", desc: "Do not reply or negotiate." },
                { title: "Protect Funds", desc: "Do not transfer any money or approve UPI requests." },
                { title: "Verify Source", desc: "Contact the official company/person through a trusted channel." }
            ],
            general: [
                { title: "Delete", desc: "Remove the message from your device." },
                { title: "Stay Alert", desc: "Watch out for similar follow-up messages." }
            ]
        },
        helplines: {
            title: "Official Helplines & Reporting",
            sextortion: {
                number: "112",
                numberLabel: "Emergency / Police",
                link: "https://cybercrime.gov.in",
                linkLabel: "National Cyber Crime Portal"
            },
            scam: {
                number: "1930",
                numberLabel: "Cyber Fraud Helpline",
                link: "https://cybercrime.gov.in",
                linkLabel: "Report Financial Fraud"
            },
            general: {
                number: "112",
                numberLabel: "Police Helpline",
                link: "https://cybercrime.gov.in",
                linkLabel: "Cyber Crime Portal"
            }
        },
        report: {
            dateLabel: "Date of Incident",
            typeLabel: "Type of Incident",
            riskLabel: "Risk Level",

            descHeader: "Incident Description:",
            descBody: "I received a suspicious message that appears to be a financial scam. The message promotes a “work from home” opportunity and requests a registration fee, which is a common indicator of online fraud. The content specifically targets individuals and makes unrealistic income claims to mislead users into sending money.",

            evidenceHeader: "Suspicious Message Content (Evidence):",

            reasonHeader: "Reason for Suspicion:",

            actionHeader: "Action Requested:",
            actionBody: "I request the concerned authority to please investigate the sender/source of this message and take appropriate action to prevent potential financial loss and protect other users from being scammed.",

            submittedHeader: "Submitted By:",
            submittedBody: "Concerned Citizen"
        },
        alerts: {
            emptyMessage: "Please paste a message first.",
            linkComingSoon: "Safety scan functionality for links is coming soon! For now, please verify URLs manually.",
            enterLink: "Please enter a link",
            copied: "Report copied to clipboard!",
            linkSafeHead: "✅ Verified Platform Link",
            linkSafeDesc: "This looks like a valid link to a known platform. Verify the user's badges.",
            linkSuspiciousHead: "⚠️ Suspicious Link Detected",
            linkSuspiciousDesc: "This URL contains a platform name but does not match the official domain. Be very careful!",
            linkCautionHead: "❓ Unknown Domain",
            linkCautionDesc: "This is not a known social platform. It might be a phishing site.",
            linkInvalid: "❌ Invalid URL format"
        }
    },
    hi: {
        appTitle: "असिस्ट++",
        tagline: "डिजital सुरक्षा साथी",
        stepInputHeader: "संदिग्ध संदेश का विश्लेषण करें",
        stepInputDesc: "घोटाले और धमकियों का पता लगाने के लिए नीचे टेक्स्ट पेस्ट करें।",
        placeholder: "यहाँ संदिग्ध संदेश पेस्ट करें...",
        analyzeBtn: "जोखिम जांचें",
        threatHeader: "संभावित संवेदनशील खतरा",
        threatDesc: "क्या यह संदेश आपकी निजी तस्वीरें या वीडियो वायरल करने की धमकी दे रहा है?",
        yesBtn: "हाँ, ऐसा है",
        noBtn: "नहीं, ऐसा नहीं है",
        riskHeader: "जोखिम विश्लेषण",
        analyzing: "कृपया प्रतीक्षा करें...",
        riskLabel: "जोखिम स्तर",
        typeLabel: "मुख्य प्रकार",
        nextGuidanceBtn: "आगे: मुझे क्या करना चाहिए?",
        startOverBtn: "पुनः आरंभ करें",
        guidanceHeader: "सुझाव और उपाय",
        guidanceDesc: "सुरक्षित रहने के लिए इन चरणों का पालन करें।",
        nextReportBtn: "आगे: रिपोर्ट टेम्पलेट",
        backBtn: "पीछे जाएं",
        reportHeader: "रिपोर्ट टेम्पलेट",
        reportDesc: "अधिकारियों या प्लेटफार्मों को रिपोर्ट करने के लिए इस टेक्स्ट का उपयोग करें।",
        downloadBtn: "सारांश PDF डाउनलोड करें",
        analyzeAnotherBtn: "दूसरा संदेश जांचें",
        miniToolHeader: "या प्रोफाइल लिंक स्कैन करें",
        checkBtn: "जांचें",
        riskHigh: "उच्च (HIGH)",
        riskMedium: "मध्यम (MEDIUM)",
        riskLow: "कम (LOW)",
        riskSafe: "सुरक्षित (SAFE)",
        typeSextortion: "ब्लैकमेल / उत्पीड़न",
        typeScam: "वित्तीय घोटाला",
        typeIntimidation: "धमकी / डराना",
        typeSpam: "स्पैम / फ़िशिंग",
        summaryHigh: "तुरुंत कार्रवाई की आवश्यकता है",
        summaryMedium: "सावधानी बरतें",
        summaryLow: "सुरक्षित प्रतीत होता है",
        reasons: {
            money: "पैसे या ट्रांसफर की मांग (Request for upfront payment/registration fee)",
            photo: "निजी छवियों/वीडियो का उल्लेख (Mentions private images/videos)",
            threat: "धमकी भरी भाषा का पता चला (Threatening language detected)",
            scam: "अवास्तविक आय के दावे (Unrealistic income claims)",
            none: "कोई सत्यापित संगठन विवरण नहीं (No verified organization details)"
        },
        guidance: {
            sextortion: [
                { title: "पैसे न दें", desc: "पैसे देने से यह कभी नहीं रुकता। वे और मांगेंगे।" },
                { title: "ब्लॉक और रिपोर्ट करें", desc: "तुरंत सभी प्लेटफार्मों पर भेजने वाले को ब्लॉक करें।" },
                { title: "सबूत सहेजें", desc: "ब्लॉक करने से पहले हर चीज का स्क्रीनशॉट लें।" },
                { title: "अस्थायी रूप से निष्क्रिय करें", desc: "कुछ दिनों के लिए अपने सोशल अकाउंट्स को निष्क्रिय करने पर विचार करें।" }
            ],
            scam: [
                { title: "बातचीत बंद करें", desc: "जवाब न दें और न ही मोलभाव करें।" },
                { title: "फंड सुरक्षित करें", desc: "कोई पैसा ट्रांसफर न करें या यूपीआई अनुरोध स्वीकार न करें।" },
                { title: "स्रोत की पुष्टि करें", desc: "भरोसेमंद चैनल के माध्यम से आधिकारिक कंपनी/व्यक्ति से संपर्क करें।" }
            ],
            general: [
                { title: "हटाएं", desc: "संदेह को अपने डिवाइस से हटा दें।" },
                { title: "सतर्क रहें", desc: "इसी तरह के फॉलो-अप संदेशों से सावधान रहें।" }
            ]
        },
        helplines: {
            title: "सरकारी हेल्पलाइन और रिपोर्टिंग",
            sextortion: {
                number: "112",
                numberLabel: "पुलिस हेल्पलाइन",
                link: "https://cybercrime.gov.in",
                linkLabel: "राष्ट्रीय साइबर अपराध पोर्टल"
            },
            scam: {
                number: "1930",
                numberLabel: "साइबर धोखाधड़ी हेल्पलाइन",
                link: "https://cybercrime.gov.in",
                linkLabel: "वित्तीय धोखाधड़ी रिपोर्ट करें"
            },
            general: {
                number: "112",
                numberLabel: "पुलिस हेल्पलाइन",
                link: "https://cybercrime.gov.in",
                linkLabel: "साइबर अपराध पोर्टल"
            }
        },
        report: {
            dateLabel: "घटना की तारीख (Date of Incident)",
            typeLabel: "घटना का प्रकार (Type of Incident)",
            riskLabel: "जोखिम स्तर (Risk Level)",

            descHeader: "घटना विवरण (Incident Description):",
            descBody: "मुझे एक संदिग्ध संदेश मिला जो एक वित्तीय घोटाला प्रतीत होता है। संदेश 'वर्क फ्रॉम होम' के अवसर को बढ़ावा देता है और पंजीकरण शुल्क का अनुरोध करता है, जो ऑनलाइन धोखाधड़ी का एक सामान्य संकेतक है। सामग्री विशेष रूप से व्यक्तियों को लक्षित करती है और उपयोगकर्ताओं को पैसे भेजने के लिए गुमराह करने के लिए अवास्तविक आय के दावे करती है।",

            evidenceHeader: "संदिग्ध संदेश सामग्री (Evidence):",

            reasonHeader: "संदेह का कारण (Reason for Suspicion):",

            actionHeader: "कार्रवाई का अनुरोध (Action Requested):",
            actionBody: "मैं संबंधित प्राधिकारी से अनुरोध करता हूं कि कृपया इस संदेश के प्रेषक/स्रोत की जांच करें और संभावित वित्तीय नुकसान को रोकने और अन्य उपयोगकर्ताओं को घोटाला होने से बचाने के लिए उचित कार्रवाई करें।",

            submittedHeader: "प्रस्तुतकर्ता (Submitted By):",
            submittedBody: "जागरूक नागरिक (Concerned Citizen)"
        },
        alerts: {
            emptyMessage: "कृपया पहले एक संदेश पेस्ट करें।",
            linkComingSoon: "लिंक स्कैन सुविधा जल्द आ रही है! अभी के लिए, कृपया मैन्युअल रूप से URL सत्यापित करें।",
            enterLink: "कृपया एक लिंक दर्ज करें",
            copied: "रिपोर्ट क्लिपबोर्ड पर कॉपी की गई!",
            linkSafeHead: "✅ सत्यापित प्लेटफार्म लिंक",
            linkSafeDesc: "यह एक ज्ञात प्लेटफार्म का वैध लिंक है। कृपया यूजर के बैज की जांच करें।",
            linkSuspiciousHead: "⚠️ संदिग्ध लिंक पाया गया",
            linkSuspiciousDesc: "इस URL में प्लेटफार्म का नाम है, लेकिन यह आधिकारिक डोमेन नहीं है। सावधान रहें!",
            linkCautionHead: "❓ अज्ञात डोमेन",
            linkCautionDesc: "यह कोई ज्ञात सोशल प्लेटफार्म नहीं है। यह एक फिशिंग साइट हो सकती है।",
            linkInvalid: "❌ अमान्य URL प्रारूप"
        }
    },
    mr: {
        appTitle: "असिस्ट++",
        tagline: "डिजिटल सुरक्षा सोबती",
        stepInputHeader: "संशयास्पद संदेश तपासा",
        stepInputDesc: "फसवणूक आणि धमक्या शोधण्यासाठी खाली मजकूर पेस्ट करा.",
        placeholder: "येथे संशयास्पद संदेश पेस्ट करा...",
        analyzeBtn: "जोखीम तपासा",
        threatHeader: "संभाव्य संवेदनशील धोका",
        threatDesc: "हा संदेश तुमचे खाजगी फोटो किंवा व्हिडिओ व्हायरल करण्याची धमकी देत आहे का?",
        yesBtn: "होय, तसे आहे",
        noBtn: "नाही, तसे नाही",
        riskHeader: "जोखीम विश्लेषण",
        analyzing: "कृपया प्रतीक्षा करा...",
        riskLabel: "जोखीम स्तर",
        typeLabel: "मुख्य प्रकार",
        nextGuidanceBtn: "पुढे: मी काय करावे?",
        startOverBtn: "पुन्हा सुरू करा",
        guidanceHeader: "शिफारस केलेली कृती",
        guidanceDesc: "सुरक्षित राहण्यासाठी या चरणांचे पालन करा.",
        nextReportBtn: "पुढे: रिपोर्ट मसुदा",
        backBtn: "मागे जा",
        reportHeader: "रिपोर्ट मसुदा",
        reportDesc: "अधिकाऱ्यांना किंवा प्लॅटफॉर्मला तक्रार करण्यासाठी हा मजकूर वापरा.",
        downloadBtn: "सारांश PDF डाउनलोड करा",
        analyzeAnotherBtn: "दुसरा संदेश तपासा",
        miniToolHeader: "किंवा प्रोफाइल लिंक स्कॅन करा",
        checkBtn: "तपासा",
        riskHigh: "उच्च (HIGH)",
        riskMedium: "मध्यम (MEDIUM)",
        riskLow: "कमी (LOW)",
        riskSafe: "सुरक्षित (SAFE)",
        typeSextortion: "ब्लॅकमेल / छळ",
        typeScam: "आर्थिक घोटाळा",
        typeIntimidation: "धमकी / भीती",
        typeSpam: "स्पॅम / फिशिंग",
        summaryHigh: "तात्काळ कारवाई आवश्यक",
        summaryMedium: "सावधगिरी बाळगा",
        summaryLow: "सुरक्षित वाटत आहे",
        reasons: {
            money: "पैसे किंवा ट्रान्सफरची मागणी (Request for upfront payment)",
            photo: "खाजगी प्रतिमा/व्हिडिओंचा उल्लेख (Mentions private images)",
            threat: "धमकी देणारी भाषा आढळली (Threatening language detected)",
            scam: "अवास्तविक उत्पन्नाचे दावे (Unrealistic income claims)",
            none: "सत्यापित संस्था तपशील नाहीत (No verified organization details)"
        },
        guidance: {
            sextortion: [
                { title: "पैसे देऊ नका", desc: "पैसे दिल्याने हे कधीही थांबत नाही. ते अधिक मागतील." },
                { title: "ब्लॉक आणि रिपोर्ट करा", desc: "पाठवणाऱ्याला सर्व प्लॅटफॉर्मवर त्वरित ब्लॉक करा." },
                { title: "पुरावा जतन करा", desc: "ब्लॉक करण्यापूर्वी प्रत्येक गोष्टीचा स्क्रीनशॉट घ्या." },
                { title: "तात्पुरते निष्क्रिय करा", desc: "काही दिवसांसाठी तुमचे सोशल अकाउंट्स निष्क्रिय करण्याचा विचार करा." }
            ],
            scam: [
                { title: "संभाषण थांबवा", desc: "उत्तर देऊ नका किंवा बोलणी करू नका." },
                { title: "फंड सुरक्षित करा", desc: "पैसे ट्रान्सफर करू नका किंवा यूपीआई विनंती स्वीकारू नका." },
                { title: "स्रोताची खात्री करा", desc: "अधिकृत कंपनी/व्यक्तीशी विश्वासार्ह चॅनेलद्वारे संपर्क साधा." }
            ],
            general: [
                { title: "हटवा", desc: "तुमच्या डिव्हाइसवरून संदेश काढून टाका." },
                { title: "सतर्क रहा", desc: "अशाच प्रकारच्या फॉलो-अप संदेशांपासून सावध रहा." }
            ]
        },
        helplines: {
            title: "सरकारी हेल्पलाइन आणि रिपोर्टिंग",
            sextortion: {
                number: "112",
                numberLabel: "पोलीस हेल्पलाइन",
                link: "https://cybercrime.gov.in",
                linkLabel: "राष्ट्रीय सायबर क्राइम पोर्टल"
            },
            scam: {
                number: "1930",
                numberLabel: "सायबर फसवणूक हेल्पलाइन",
                link: "https://cybercrime.gov.in",
                linkLabel: "आर्थिक फसवणूक रिपोर्ट करा"
            },
            general: {
                number: "112",
                numberLabel: "पोलीस हेल्पलाइन",
                link: "https://cybercrime.gov.in",
                linkLabel: "सायबर क्राइम पोर्टल"
            }
        },
        report: {
            dateLabel: "घटनेची तारीख (Date of Incident)",
            typeLabel: "घटनेचा प्रकार (Type of Incident)",
            riskLabel: "जोखीम स्तर (Risk Level)",

            descHeader: "घटनेचे वर्णन (Incident Description):",
            descBody: "मला एक संशयास्पद संदेश आला जो आर्थिक घोटाळा असल्याचे दिसते. हा संदेश 'वर्क फ्रॉम होम' संधीचा प्रचार करतो आणि नोंदणी शुल्काची विनंती करतो, जे ऑनलाइन फसवणुकीचे सामान्य लक्षण आहे. यातील मजकूर विशेषतः व्यक्तींना लक्ष्य करतो आणि वापरकर्त्यांची दिशाभूल करून पैसे पाठवण्यासाठी अवास्तव उत्पन्नाचे दावे करतो.",

            evidenceHeader: "संशयास्पद संदेश सामग्री (Evidence):",

            reasonHeader: "संशयाचे कारण (Reason for Suspicion):",

            actionHeader: "विनंती केलेली कारवाई (Action Requested):",
            actionBody: "मी संबंधित प्राधिकाऱ्याला विनंती करतो की कृपया या संदेशाच्या प्रेषकाची/स्रोताची चौकशी करावी आणि संभाव्य आर्थिक नुकसान टाळण्यासाठी आणि इतर वापरकर्त्यांना घोटाळ्यापासून वाचवण्यासाठी योग्य कारवाई करावी.",

            submittedHeader: "सादर करणारा (Submitted By):",
            submittedBody: "जागरूक नागरिक (Concerned Citizen)"
        },
        alerts: {
            emptyMessage: "कृपया आधी संदेश पेस्ट करा.",
            linkComingSoon: "लिंक स्कॅन सुविधा लवकरच येत आहे! सध्यासाठी, कृपया स्वतः URL तपासा.",
            enterLink: "कृपया लिंक एंटर करा",
            copied: "रिपोर्ट क्लिपबोर्डवर कॉपी केला!",
            linkSafeHead: "✅ सत्यापित प्लॅटफॉर्म लिंक",
            linkSafeDesc: "ही एक ज्ञात प्लॅटफॉर्मची वैध लिंक आहे. कृपया यूजरचे बॅज तपासा.",
            linkSuspiciousHead: "⚠️ संशयास्पद लिंक आढळली",
            linkSuspiciousDesc: "या URL मध्ये प्लॅटफॉर्मचे नाव आहे, परंतु हे अधिकृत डोमेन नाही. अत्यंत सावध रहा!",
            linkCautionHead: "❓ अज्ञात डोमेन",
            linkCautionDesc: "हे कोणतेही ज्ञात सोशल प्लॅटफॉर्म नाही. ही एक फिशिंग साइट असू शकते.",
            linkInvalid: "❌ अमान्य URL फॉरमॅट"
        }
    }
};

const MULTILINGUAL_KEYWORDS = {
    threat: [
        "kill", "leak", "expose", "destroy", "ruin", "blackmail", "threat", "police", "arrest", // English
        "मार", "बदनाम", "वायरल", "पुलिस", "गिरफ्तार", "मजबूर", "बर्बाद", // Hindi
        "जीवे", "बदनामी", "विद्रूप", "पोलिस", "अटक", "ब्लॅकमेल" // Marathi
    ],
    photo: [
        "photo", "image", "video", "private", "nude", "pics", "gallery", "cam", // English
        "फोटो", "तस्वीर", "वीडियो", "न्यूड", "गंदी", "प्राइवेट", "गैलरी", // Hindi
        "फोटो", "व्हिडिओ", "खाजगी", "नग्न", "चित्रे", "गॅलरी" // Marathi
    ],
    money: [
        "pay", "money", "transfer", "upi", "urgent", "crypto", "bank", "account", "wallet", "fee", "tax", // English
        "पैसे", "रुपये", "ट्रांसफर", "बैंक", "खाता", "पेमेंट", "फीस", "टैक्स", "अर्जेंट", // Hindi
        "पैसे", "रुपये", "ट्रान्सफर", "बँक", "खाते", "वॉलेट", "फी", "कर" // Marathi
    ],
    scam: [
        "free", "click", "offer", "verify", "winner", "limited", "login", "password", "prize", "lottery", // English
        "मुफ्त", "क्लिक", "ऑफर", "वेरिफाई", "विजेता", "लॉटरी", "पासवर्ड", "लॉगिन", "इनाम", // Hindi
        "मोफत", "क्लिक", "ऑफर", "पडताळणी", "विजेता", "लॉटरी", "पासवर्ड", "बक्षीस" // Marathi
    ]
};
