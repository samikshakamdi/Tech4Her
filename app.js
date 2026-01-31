/************************************
 * CONFIGURATION & DATASETS
 ************************************/

const THREAT_WORDS = ["kill", "leak", "expose", "destroy", "ruin", "blackmail", "threat", "police", "arrest"];
const PHOTO_WORDS = ["photo", "image", "video", "private", "nude", "pics", "gallery", "cam"];
const MONEY_WORDS = ["pay", "money", "transfer", "upi", "urgent", "crypto", "bank", "account", "wallet", "fee", "tax"];
const SCAM_WORDS = ["free", "click", "offer", "verify", "winner", "limited", "login", "password", "prize", "lottery"];

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

/************************************
 * WIZARD NAVIGATION
 ************************************/

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

/************************************
 * CORE ANALYSIS LOGIC
 ************************************/

function startAnalysis() {
    const message = document.getElementById("messageInput").value.trim();
    if (!message) {
        alert("Please paste a message first.");
        return;
    }

    currentAnalysis.message = message;
    const text = message.toLowerCase();

    // Reset flags
    currentAnalysis.flags = { threat: false, photo: false, money: false, scam: false };
    currentAnalysis.score = 0;

    // Calculate score
    THREAT_WORDS.forEach(w => { if (text.includes(w)) { currentAnalysis.score += WEIGHTS.threat; currentAnalysis.flags.threat = true; } });
    PHOTO_WORDS.forEach(w => { if (text.includes(w)) { currentAnalysis.score += WEIGHTS.photo; currentAnalysis.flags.photo = true; } });
    MONEY_WORDS.forEach(w => { if (text.includes(w)) { currentAnalysis.score += WEIGHTS.money; currentAnalysis.flags.money = true; } });
    SCAM_WORDS.forEach(w => { if (text.includes(w)) { currentAnalysis.score += WEIGHTS.scam; currentAnalysis.flags.scam = true; } });

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
    // Determine Risk Level
    if (currentAnalysis.score >= 8) currentAnalysis.riskLevel = "HIGH";
    else if (currentAnalysis.score >= 4) currentAnalysis.riskLevel = "MEDIUM";
    else currentAnalysis.riskLevel = "LOW";

    // Determine Risk Type
    if (currentAnalysis.userConfirmedThreat || (currentAnalysis.flags.photo && currentAnalysis.score > 5)) {
        currentAnalysis.riskType = "Sextortion / Harassment";
    } else if (currentAnalysis.flags.money) {
        currentAnalysis.riskType = "Financial Scam";
    } else if (currentAnalysis.flags.threat) {
        currentAnalysis.riskType = "Intimidation";
    } else {
        currentAnalysis.riskType = "Spam / Phishing";
    }

    renderResults();
    nextStep('step-result-overview');
}

/************************************
 * RENDERING RESULTS
 ************************************/

function renderResults() {
    // 1. Overview Screen
    document.getElementById('risk-level-value').innerText = currentAnalysis.riskLevel;
    document.getElementById('risk-level-value').className = "value risk-" + currentAnalysis.riskLevel.toLowerCase();

    document.getElementById('risk-type-value').innerText = currentAnalysis.riskType;

    const reasonsDiv = document.getElementById('risk-reasons');
    reasonsDiv.innerHTML = '';

    let reasons = [];
    if (currentAnalysis.flags.money) reasons.push("Requests for money or transfer");
    if (currentAnalysis.flags.photo) reasons.push("Mentions private images/videos");
    if (currentAnalysis.flags.threat) reasons.push("Threatening language detected");
    if (currentAnalysis.flags.scam) reasons.push("Common scam keywords used");

    if (reasons.length === 0) reasons.push("No specific keywords found, but stay alert.");

    reasons.forEach(r => {
        const p = document.createElement('p');
        p.textContent = "• " + r;
        reasonsDiv.appendChild(p);
    });

    document.getElementById('risk-summary').innerText =
        currentAnalysis.riskLevel === "HIGH" ? "Immediate Action Recommended" :
            currentAnalysis.riskLevel === "MEDIUM" ? "Proceed with Caution" : "Appears Safe";

    // 2. Guidance Screen
    const guidanceList = document.getElementById('guidance-list');
    guidanceList.innerHTML = '';

    const steps = getGuidanceSteps();
    steps.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${step.title}</strong>: ${step.desc}`;
        guidanceList.appendChild(li);
    });

    // 3. Report Screen
    const reportText = generateReportText();
    document.getElementById('report-text').value = reportText;
}

function getGuidanceSteps() {
    if (currentAnalysis.riskType === "Sextortion / Harassment") {
        return [
            { title: "Do NOT Pay", desc: "Paying never makes it stop. They will ask for more." },
            { title: "Block & Report", desc: "Block the sender immediately on all platforms." },
            { title: "Save Evidence", desc: "Take screenshots of everything before blocking." },
            { title: "Deactivate Temporarily", desc: "Consider deactivating your social accounts for a few days." }
        ];
    } else if (currentAnalysis.riskType === "Financial Scam") {
        return [
            { title: "Stop Communication", desc: "Do not reply or negotiate." },
            { title: "Protect Funds", desc: "Do not transfer any money or approve UPI requests." },
            { title: "Verify Source", desc: "Contact the official company/person through a trusted channel." }
        ];
    } else {
        return [
            { title: "Ignore", desc: "Do not click links or reply." },
            { title: "Delete", desc: "Remove the message from your device." },
            { title: "Stay Alert", desc: "Watch out for similar follow-up messages." }
        ];
    }
}

function generateReportText() {
    const date = new Date().toLocaleDateString();
    return `[CYBERCRIME REPORT DRAFT]
Date: ${date}
Incident Type: ${currentAnalysis.riskType}
Risk Level: ${currentAnalysis.riskLevel}

Description:
I received a suspicious message that was flagged as ${currentAnalysis.riskLevel} risk (${currentAnalysis.riskType}).
The message contained threats or requests associated with: ${Object.keys(currentAnalysis.flags).filter(k => currentAnalysis.flags[k]).join(', ')}.

Evidence Content:
"${currentAnalysis.message}"

Request:
Please investigate this sender and take appropriate action.
`;
}

/************************************
 * UTILITIES
 ************************************/

function copyReport() {
    const copyText = document.getElementById("report-text");
    copyText.select();
    document.execCommand("copy"); // Fallback for older browsers
    // Modern way: navigator.clipboard.writeText(copyText.value);
    alert("Report copied to clipboard!");
}

function downloadSummary() {
    const text = document.getElementById("report-text").value;
    const blob = new Blob([text], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.download = "Safe_Report_Summary.txt";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = "_blank";
    anchor.style.display = "none"; // just to be safe
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function scanLink() {
    const link = document.getElementById('linkInput').value;
    if (!link) return alert("Please enter a link");
    alert("Safety scan functionality for links is coming soon! For now, please verify URLs manually.");
}

// Initialize
resetWizard();
