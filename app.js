// Initial State
let currentLanguage = localStorage.getItem('appLanguage') || 'en';
document.getElementById('language-selector').value = currentLanguage;

//CONFIGURATION & DATASETS


const WEIGHTS = { threat: 4, photo: 5, money: 3, scam: 2 };

// State to hold analysis results across steps
let currentAnalysis = {
    score: 0,
    riskLevel: "LOW",
    riskType: "General",
    flags: {},
    message: "",
    userConfirmedThreat: false
};

//INTERNATIONALIZATION (I18N)


function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('appLanguage', lang);
    applyTranslations();

    // If we have any analysis data, re-render the dynamic results immediately.
    // This ensures that if the user is on the Guidance or Report step, those update too.
    if (currentAnalysis.message) {
        renderResults();
    }
}

function applyTranslations() {
    const t = TRANSLATIONS[currentLanguage];
    if (!t) return;

    // 1. Static Text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.innerText = t[key];
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });
}

// Apply on load
applyTranslations();

//WIZARD NAVIGATION


function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none'; // Ensure hidden elements don't take space
    });

    // Show target step
    const target = document.getElementById(stepId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'flex'; // Restore flex layout
    }
}

function nextStep(stepId) {
    showStep(stepId);
}

function prevStep(stepId) {
    showStep(stepId);
}

function resetWizard() {
    document.getElementById('messageInput').value = '';
    currentAnalysis = { score: 0, riskLevel: "LOW", riskType: "General", flags: {}, message: "", userConfirmedThreat: false };
    showStep('step-input');
}

//CORE ANALYSIS LOGIC


function startAnalysis() {
    const message = document.getElementById("messageInput").value.trim();
    if (!message) {
        alert(TRANSLATIONS[currentLanguage].alerts.emptyMessage);
        return;
    }

    currentAnalysis.message = message;
    const text = message.toLowerCase();

    // Reset flags
    currentAnalysis.flags = { threat: false, photo: false, money: false, scam: false };
    currentAnalysis.score = 0;

    // Calculate score using MULTILINGUAL keywords
    // We check ALL languages to ensure safety even if UI language doesn't match message language
    const keywords = MULTILINGUAL_KEYWORDS;

    keywords.threat.forEach(w => { if (text.includes(w)) { currentAnalysis.score += WEIGHTS.threat; currentAnalysis.flags.threat = true; } });
    keywords.photo.forEach(w => { if (text.includes(w)) { currentAnalysis.score += WEIGHTS.photo; currentAnalysis.flags.photo = true; } });
    keywords.money.forEach(w => { if (text.includes(w)) { currentAnalysis.score += WEIGHTS.money; currentAnalysis.flags.money = true; } });
    keywords.scam.forEach(w => { if (text.includes(w)) { currentAnalysis.score += WEIGHTS.scam; currentAnalysis.flags.scam = true; } });

    // Decide Route
    // If "photo" or "threat" words are found, we ask the sensitive question
    if (currentAnalysis.flags.photo || currentAnalysis.flags.threat) {
        showStep('step-threat-check');
    } else {
        finalizeAnalysis();
    }
}

function confirmThreat(isConfirmed) {
    currentAnalysis.userConfirmedThreat = isConfirmed;

    // Adjust score based on confirmation
    if (isConfirmed) {
        currentAnalysis.score += 10; // Massive boost to ensure HIGH risk
        currentAnalysis.flags.threat = true;
        currentAnalysis.flags.photo = true;
    }

    finalizeAnalysis();
}

function finalizeAnalysis() {
    // Determine Risk Level (Logic remains same, labels change in render)
    if (currentAnalysis.score >= 8) currentAnalysis.riskLevel = "HIGH";
    else if (currentAnalysis.score >= 4) currentAnalysis.riskLevel = "MEDIUM";
    else currentAnalysis.riskLevel = "LOW";

    // Determine Risk Type (Logic remains same)
    if (currentAnalysis.userConfirmedThreat || (currentAnalysis.flags.photo && currentAnalysis.score > 5)) {
        currentAnalysis.riskType = "sextortion"; // Use keys for translation
    } else if (currentAnalysis.flags.money) {
        currentAnalysis.riskType = "scam";
    } else if (currentAnalysis.flags.threat) {
        currentAnalysis.riskType = "intimidation";
    } else {
        currentAnalysis.riskType = "spam";
    }

    renderResults();
    nextStep('step-result-overview');
}

//RENDERING RESULTS

//RENDERING RESULTS


function renderResults() {
    const t = TRANSLATIONS[currentLanguage];

    // 1. Overview Screen
    let riskDisplay = currentAnalysis.riskLevel;
    let riskClass = "risk-" + currentAnalysis.riskLevel.toLowerCase();

    let localizedRisk = t.riskLow;
    if (currentAnalysis.riskLevel === "HIGH") localizedRisk = t.riskHigh;
    if (currentAnalysis.riskLevel === "MEDIUM") localizedRisk = t.riskMedium;

    const riskValEl = document.getElementById('risk-level-value');
    riskValEl.innerText = localizedRisk;
    riskValEl.className = "value " + riskClass;

    let typeKey = "typeSpam";
    if (currentAnalysis.riskType === "sextortion") typeKey = "typeSextortion";
    if (currentAnalysis.riskType === "scam") typeKey = "typeScam";
    if (currentAnalysis.riskType === "intimidation") typeKey = "typeIntimidation";

    document.getElementById('risk-type-value').innerText = t[typeKey];

    const reasonsDiv = document.getElementById('risk-reasons');
    reasonsDiv.innerHTML = '';

    let reasons = [];
    if (currentAnalysis.flags.money) reasons.push(t.reasons.money);
    if (currentAnalysis.flags.photo) reasons.push(t.reasons.photo);
    if (currentAnalysis.flags.threat) reasons.push(t.reasons.threat);
    if (currentAnalysis.flags.scam) reasons.push(t.reasons.scam);

    if (reasons.length === 0) reasons.push(t.reasons.none);

    reasons.forEach(r => {
        const p = document.createElement('p');
        p.textContent = "• " + r;
        reasonsDiv.appendChild(p);
    });

    let summaryText = t.summaryLow;
    if (currentAnalysis.riskLevel === "HIGH") summaryText = t.summaryHigh;
    if (currentAnalysis.riskLevel === "MEDIUM") summaryText = t.summaryMedium;

    document.getElementById('risk-summary').innerText = summaryText;

    // 2. Guidance Screen
    const guidanceList = document.getElementById('guidance-list');
    guidanceList.innerHTML = '';

    const steps = getGuidanceSteps();
    steps.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${step.title}</strong>: ${step.desc}`;
        guidanceList.appendChild(li);
    });

    // 2.1 Helpline Section
    const helplineContainer = document.getElementById('helpline-container');
    const helplines = t.helplines;
    let helpData = helplines.general;

    if (currentAnalysis.riskType === "sextortion") {
        helpData = helplines.sextortion;
    } else if (currentAnalysis.riskType === "scam") {
        helpData = helplines.scam;
    }

    helplineContainer.innerHTML = `
        <div class="helpline-card">
            <div class="helpline-header">
                <span>🏛️</span> ${helplines.title}
            </div>
            <div class="helpline-content">
                <div class="helpline-number">
                    <span class="label">${helpData.numberLabel}</span>
                    <a href="tel:${helpData.number}" class="number">${helpData.number}</a>
                </div>
                <div class="helpline-link">
                    <a href="${helpData.link}" target="_blank">
                        ${helpData.linkLabel} ↗
                    </a>
                </div>
            </div>
        </div>
    `;

    // 3. Report Screen
    const reportText = generateReportText();
    document.getElementById('report-text').value = reportText;
}

function getGuidanceSteps() {
    const t = TRANSLATIONS[currentLanguage];

    if (currentAnalysis.riskType === "sextortion") {
        return t.guidance.sextortion;
    } else if (currentAnalysis.riskType === "scam") {
        return t.guidance.scam;
    } else {
        return t.guidance.general;
    }
}

function generateReportText() {
    const t = TRANSLATIONS[currentLanguage];
    const tr = t.report; // Translation Report Object
    const date = new Date().toLocaleDateString();

    // Get localized values
    let riskLoc = currentAnalysis.riskLevel; // Fallback
    if (currentAnalysis.riskLevel === "HIGH") riskLoc = t.riskHigh;
    else if (currentAnalysis.riskLevel === "MEDIUM") riskLoc = t.riskMedium;
    else riskLoc = t.riskLow;

    let typeLoc = t["type" + currentAnalysis.riskType.charAt(0).toUpperCase() + currentAnalysis.riskType.slice(1)];
    if (!typeLoc) typeLoc = currentAnalysis.riskType;

    // Build "Reasons" list with bullet points
    let reasonsList = "";
    const reasonsMap = t.reasons;

    if (currentAnalysis.flags.money) reasonsList += `\n- ${reasonsMap.money}`;
    if (currentAnalysis.flags.photo) reasonsList += `\n- ${reasonsMap.photo}`;
    if (currentAnalysis.flags.threat) reasonsList += `\n- ${reasonsMap.threat}`;
    if (currentAnalysis.flags.scam) reasonsList += `\n- ${reasonsMap.scam}`;

    // Fallback if no specific flags
    if (!reasonsList) reasonsList = `\n- ${reasonsMap.none}`;

    // Construct the Report
    let text = "";
    text += `${tr.dateLabel}: ${date}\n`;
    text += `${tr.typeLabel}: ${typeLoc}\n`;
    text += `${tr.riskLabel}: ${riskLoc}\n\n`;

    text += `${tr.descHeader}\n`;
    text += `${tr.descBody}\n\n`;

    text += `${tr.evidenceHeader}\n`;
    text += `"${currentAnalysis.message}"\n\n`;

    text += `${tr.reasonHeader}`;
    text += `${reasonsList}\n\n`;

    text += `${tr.actionHeader}\n`;
    text += `${tr.actionBody}\n\n`;

    text += `${tr.submittedHeader}\n`;
    text += `${tr.submittedBody}`;

    return text;
}

//UTILITIES


function copyReport() {
    const copyText = document.getElementById("report-text");
    copyText.select();
    document.execCommand("copy"); // Fallback
    // navigator.clipboard.writeText(copyText.value);
    alert(TRANSLATIONS[currentLanguage].alerts.copied);
}

function downloadSummary() {
    const text = document.getElementById("report-text").value;
    const blob = new Blob([text], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.download = "Safe_Report_Summary_" + currentLanguage + ".txt";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = "_blank";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

//LINK SCANNER LOGIC


function scanLink() {
    const linkInput = document.getElementById('linkInput');
    const resultContainer = document.getElementById('link-result-container');
    const url = linkInput.value.trim();
    const t = TRANSLATIONS[currentLanguage];

    if (!url) return alert(t.alerts.enterLink);

    // clear previous
    resultContainer.innerHTML = '';

    // Analysis
    let result = analyzeLink(url);

    // Render Result
    const card = document.createElement('div');
    card.className = `link-result-card ${result.status}`;

    let titleText = "", descText = "";

    if (result.status === 'safe') {
        titleText = t.alerts.linkSafeHead;
        descText = t.alerts.linkSafeDesc;
    } else if (result.status === 'suspicious') {
        titleText = t.alerts.linkSuspiciousHead;
        descText = t.alerts.linkSuspiciousDesc;
    } else if (result.status === 'caution') {
        titleText = t.alerts.linkCautionHead;
        descText = t.alerts.linkCautionDesc;
    } else {
        // Invalid or error
        titleText = t.alerts.linkInvalid;
        descText = "";
    }

    card.innerHTML = `
        <div class="link-title">${titleText}</div>
        <div class="link-desc">${descText}</div>
    `;

    resultContainer.appendChild(card);
}

function analyzeLink(urlStr) {
    try {
        // Basic protocol check
        if (!urlStr.startsWith('http')) {
            urlStr = 'https://' + urlStr;
        }

        const url = new URL(urlStr);
        const domain = url.hostname.toLowerCase().replace('www.', '');

        // Official Social Domains
        const OFFICIAL_DOMAINS = [
            'facebook.com', 'fb.com',
            'instagram.com',
            'twitter.com', 'x.com',
            'linkedin.com',
            'whatsapp.com', 'wa.me',
            't.me', 'telegram.org',
            'snapchat.com',
            'youtube.com', 'youtu.be',
            'tiktok.com'
        ];

        // Suspicious keywords in domain (if not official)
        const SUSPICIOUS_KEYWORDS = [
            'instagram', 'facebook', 'whatsapp', 'support', 'verify',
            'login', 'secure', 'account', 'update', 'service'
        ];

        // 1. Check if it's an official domain
        if (OFFICIAL_DOMAINS.includes(domain)) {
            // It's a real social platform
            return { status: 'safe' };
        }

        // 2. Check for phishing attempts (keywords in non-official domain)
        // e.g. "instagram-verify-account.com"
        const isPhishing = SUSPICIOUS_KEYWORDS.some(keyword => domain.includes(keyword));
        if (isPhishing) {
            return { status: 'suspicious' };
        }

        // 3. Unknown domain
        return { status: 'caution' };

    } catch (e) {
        return { status: 'invalid' };
    }
}

function continueAsGuest() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signupPage").style.display = "none";
    document.getElementById("homePage").style.display = "flex";
}

function showLogin() {
    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("signupPage").style.display = "none";
    document.getElementById("homePage").style.display = "none";
}

function showSignup() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signupPage").style.display = "flex";
    document.getElementById("homePage").style.display = "none";
}

// AUTHENTICATION LOGIC
function handleSignup() {
    const nameInput = document.getElementById("signupName");
    const name = nameInput.value.trim();

    if (name) {
        loginUser(name);
    } else {
        alert("Please enter your name.");
    }
}

function handleLoginAction() {
    const emailInput = document.getElementById("loginEmail");
    const email = emailInput.value.trim();

    if (email) {
        // Extract name from email (e.g., "john" from "john@example.com")
        const name = email.split('@')[0];
        // Capitalize first letter
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        loginUser(formattedName);
    } else {
        alert("Please enter your email.");
    }
}

function loginUser(name) {
    // 1. Update Header
    const headerBtn = document.getElementById("headerLoginBtn");
    headerBtn.innerText = name;
    headerBtn.onclick = null;
    document.getElementById("headerLogoutBtn").style.display = "block";

    // 2. Hide Login/Signup, Show Home
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signupPage").style.display = "none";
    document.getElementById("homePage").style.display = "flex";
}

function logoutUser() {
    // 1. Reset Header
    const headerBtn = document.getElementById("headerLoginBtn");
    headerBtn.innerText = "Login";
    headerBtn.onclick = showLogin;

    // 2. Hide Logout Button
    document.getElementById("headerLogoutBtn").style.display = "none";

    // 3. Return to Login Page
    showLogin();
}

// GOOGLE API CONFIGURATION
const CLIENT_ID = '349148392724-pc3dgakslp9hbcq0st34f2tn0b01l0c1.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA-_d9UVONFVW6I23n_H5T2ar7NYAYrUnA'; // User provided API Key
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize Google API Client
window.gapiLoaded = function () {
    gapi.load('client', intializeGapiClient);
}

async function intializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
}

// Initialize Google Identity Services (GIS)
window.gisLoaded = function () {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Defined at request time
    });
    gisInited = true;
}

// Auth & Scan Trigger
window.handleAuthClick = function () {
    console.log("Auth Clicked");
    if (!gapiInited || !gisInited) {
        // Try initializing again if scripts loaded late
        if (typeof gapi !== 'undefined' && !gapiInited) gapiLoaded();
        if (typeof google !== 'undefined' && !gisInited) gisLoaded();

        // Give it a split second or alert
        if (!gapiInited || !gisInited) return alert("Google APIs not fully loaded. Please check your internet or tokens.");
    }

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        await checkSpamStats();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

async function checkSpamStats() {
    const resultDiv = document.getElementById("email-stats-result");
    resultDiv.style.display = 'block';
    resultDiv.innerText = "Scanning Gmail...";
    resultDiv.style.color = "#666";

    try {
        // Get today's date in YYYY/MM/DD format
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateQuery = `${yyyy}/${mm}/${dd}`;

        const query = `label:SPAM after:${dateQuery}`;

        const response = await gapi.client.gmail.users.messages.list({
            'userId': 'me',
            'q': query
        });

        const messages = response.result.messages || [];
        const count = messages.length;

        resultDiv.innerText = `You received ${count} spam emails today.`;

        if (count > 0) {
            resultDiv.style.color = "#FF4757"; // Danger color
        } else {
            resultDiv.style.color = "#2ED573"; // Success color
        }

    } catch (err) {
        console.error(err);
        resultDiv.innerText = "Error scanning email: " + err.message;
        resultDiv.style.color = "red";
    }
}

// Auto-initialize if scripts are loaded
window.onload = function () {
    if (typeof gapi !== 'undefined') gapiLoaded();
    if (typeof google !== 'undefined') gisLoaded();
};
