
//SHARE TARGET HANDLER


window.addEventListener('DOMContentLoaded', () => {
    // Check for "Share Target" data (GET params)
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const text = params.get('text');
    const url = params.get('url');

    // Combine shared data
    let sharedContent = [];
    if (title) sharedContent.push(title);
    if (text) sharedContent.push(text);
    if (url) sharedContent.push(url);

    const finalMessage = sharedContent.join('\n\n').trim();

    if (finalMessage) {
        const input = document.getElementById('messageInput');
        if (input) {
            input.value = finalMessage;
            // Optional: Visually highlight that data arrived
            input.style.borderColor = "var(--primary)";
            setTimeout(() => input.style.borderColor = "", 2000);
        }
    }
});
