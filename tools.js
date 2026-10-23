/**
 * OmniTools - Interactive Client-Side Utilities Engine
 * Fully functional, zero-dependency, instantaneous client-side processing
 */

document.addEventListener('DOMContentLoaded', () => {
    initJsonFormatter();
    initBase64Converter();
    initPasswordGenerator();
    initWordCounter();
    initQuickUtilities();
    initToolSearch();
});

// Toast notification helper
function showToast(message) {
    if (window.omniAdsManager && window.omniAdsManager.showToastNotification) {
        window.omniAdsManager.showToastNotification(message);
    } else {
        let toast = document.getElementById('omni-ad-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'omni-ad-toast';
            toast.className = 'omni-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 2800);
    }
}

// Clipboard copy helper
function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (!text || text.trim() === '') {
        showToast('Nothing to copy!');
        return;
    }
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => showToast(successMsg)).catch(() => fallbackCopy(text, successMsg));
    } else {
        fallbackCopy(text, successMsg);
    }
}

function fallbackCopy(text, successMsg) {
    const tempArea = document.createElement('textarea');
    tempArea.value = text;
    tempArea.style.position = 'fixed';
    tempArea.style.left = '-9999px';
    document.body.appendChild(tempArea);
    tempArea.select();
    try {
        document.execCommand('copy');
        showToast(successMsg);
    } catch (err) {
        showToast('Failed to copy');
    }
    document.body.removeChild(tempArea);
}

// Download file helper
function downloadFile(content, fileName, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/* ==========================================================================
   1. JSON Formatter & Validator
   ========================================================================== */
function initJsonFormatter() {
    const inputArea = document.getElementById('json-input');
    const outputArea = document.getElementById('json-output');
    const statusBadge = document.getElementById('json-status');
    const indentSelect = document.getElementById('json-indent-select');
    const btnFormat = document.getElementById('btn-json-format');
    const btnMinify = document.getElementById('btn-json-minify');
    const btnClear = document.getElementById('btn-json-clear');
    const btnSample = document.getElementById('btn-json-sample');
    const btnCopy = document.getElementById('btn-json-copy');
    const btnDownload = document.getElementById('btn-download-results');
    const statsEl = document.getElementById('json-stats');

    if (!inputArea) return;

    const sampleJSON = {
        "project": "OmniTools Web Utilities",
        "version": "2.4.0",
        "status": "production",
        "author": {
            "name": "OmniTools Dev Team",
            "verified": true,
            "roles": ["developer", "architect"]
        },
        "features": [
            "JSON Beautifier & Validator",
            "Base64 Encoder / Decoder",
            "Entropy Password Generator",
            "Real-time Text Metrics"
        ],
        "configuration": {
            "encryption": "AES-256-GCM",
            "maxPayloadBytes": 10485760,
            "performanceScore": 99.8
        }
    };

    function getIndentValue() {
        const val = indentSelect.value;
        if (val === 'tab') return '\t';
        return parseInt(val, 10);
    }

    function formatJSON(minify = false) {
        const raw = inputArea.value.trim();
        if (!raw) {
            outputArea.value = '';
            statusBadge.className = 'status-badge neutral';
            statusBadge.textContent = 'Awaiting JSON input...';
            if (statsEl) statsEl.textContent = 'Lines: 0 | Size: 0 B';
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            const indent = minify ? null : getIndentValue();
            const formatted = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
            outputArea.value = formatted;

            statusBadge.className = 'status-badge valid';
            statusBadge.innerHTML = '&#10004; Valid JSON';

            const lineCount = formatted.split('\n').length;
            const byteSize = new Blob([formatted]).size;
            if (statsEl) statsEl.textContent = `Lines: ${lineCount} | Size: ${formatBytes(byteSize)}`;
        } catch (err) {
            statusBadge.className = 'status-badge error';
            statusBadge.innerHTML = `&#10006; ${err.message}`;
        }
    }

    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
    }

    btnFormat.addEventListener('click', () => formatJSON(false));
    btnMinify.addEventListener('click', () => formatJSON(true));
    indentSelect.addEventListener('change', () => formatJSON(false));

    btnClear.addEventListener('click', () => {
        inputArea.value = '';
        outputArea.value = '';
        statusBadge.className = 'status-badge neutral';
        statusBadge.textContent = 'Cleared';
        if (statsEl) statsEl.textContent = 'Lines: 0 | Size: 0 B';
    });

    btnSample.addEventListener('click', () => {
        inputArea.value = JSON.stringify(sampleJSON);
        formatJSON(false);
        showToast('Sample JSON loaded');
    });

    btnCopy.addEventListener('click', () => {
        copyToClipboard(outputArea.value, 'Formatted JSON copied!');
    });

    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            const content = outputArea.value || inputArea.value;
            if (!content) {
                showToast('Nothing to download! Please enter JSON.');
                return;
            }
            downloadFile(content, 'formatted-omnitools.json', 'application/json');
            showToast('JSON file downloaded!');
        });
    }

    // Auto validate on input paste/type with debounce
    let debounceTimer;
    inputArea.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => formatJSON(false), 300);
    });

    // Keyboard shortcut: Ctrl+Enter to format
    inputArea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            formatJSON(false);
        }
    });

    // Preload with sample
    inputArea.value = JSON.stringify(sampleJSON);
    formatJSON(false);
}

/* ==========================================================================
   2. Base64 Encoder / Decoder
   ========================================================================== */
function initBase64Converter() {
    const inputArea = document.getElementById('b64-input');
    const outputArea = document.getElementById('b64-output');
    const btnEncode = document.getElementById('btn-b64-encode');
    const btnDecode = document.getElementById('btn-b64-decode');
    const btnSwap = document.getElementById('btn-b64-swap');
    const btnClear = document.getElementById('btn-b64-clear');
    const btnCopy = document.getElementById('btn-b64-copy');
    const chkUrlSafe = document.getElementById('b64-urlsafe');
    const b64Stats = document.getElementById('b64-stats');

    if (!inputArea) return;

    function encodeBase64(str, isUrlSafe) {
        // UTF-8 friendly encoding
        const bytes = new TextEncoder().encode(str);
        let binString = '';
        for (let i = 0; i < bytes.length; i++) {
            binString += String.fromCharCode(bytes[i]);
        }
        let b64 = btoa(binString);
        if (isUrlSafe) {
            b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        return b64;
    }

    function decodeBase64(b64, isUrlSafe) {
        let clean = b64.trim();
        if (isUrlSafe) {
            clean = clean.replace(/-/g, '+').replace(/_/g, '/');
            while (clean.length % 4) {
                clean += '=';
            }
        }
        const binString = atob(clean);
        const bytes = new Uint8Array(binString.length);
        for (let i = 0; i < binString.length; i++) {
            bytes[i] = binString.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    }

    function handleEncode() {
        try {
            const raw = inputArea.value;
            const res = encodeBase64(raw, chkUrlSafe.checked);
            outputArea.value = res;
            updateStats(raw.length, res.length);
        } catch (e) {
            outputArea.value = `Encoding Error: ${e.message}`;
        }
    }

    function handleDecode() {
        try {
            const raw = inputArea.value;
            const res = decodeBase64(raw, chkUrlSafe.checked);
            outputArea.value = res;
            updateStats(raw.length, res.length);
        } catch (e) {
            outputArea.value = `Decoding Error: Invalid Base64 string (${e.message})`;
        }
    }

    function updateStats(inLen, outLen) {
        if (b64Stats) {
            b64Stats.textContent = `Input: ${inLen} chars | Output: ${outLen} chars`;
        }
    }

    btnEncode.addEventListener('click', handleEncode);
    btnDecode.addEventListener('click', handleDecode);
    chkUrlSafe.addEventListener('change', handleEncode);

    btnSwap.addEventListener('click', () => {
        const temp = inputArea.value;
        inputArea.value = outputArea.value;
        outputArea.value = temp;
        showToast('Swapped input & output');
    });

    btnClear.addEventListener('click', () => {
        inputArea.value = '';
        outputArea.value = '';
        updateStats(0, 0);
    });

    btnCopy.addEventListener('click', () => {
        copyToClipboard(outputArea.value, 'Base64 result copied!');
    });

    // Default sample text
    inputArea.value = 'OmniTools: High-performance cloud & developer web utilities.';
    handleEncode();
}

/* ==========================================================================
   3. Random Password & Entropy Generator
   ========================================================================== */
function initPasswordGenerator() {
    const display = document.getElementById('pwd-display');
    const lengthSlider = document.getElementById('pwd-length');
    const lengthVal = document.getElementById('pwd-length-val');
    const chkUpper = document.getElementById('pwd-upper');
    const chkLower = document.getElementById('pwd-lower');
    const chkNumbers = document.getElementById('pwd-numbers');
    const chkSymbols = document.getElementById('pwd-symbols');
    const chkNoAmbiguous = document.getElementById('pwd-ambiguous');
    const btnGenerate = document.getElementById('btn-pwd-generate');
    const btnCopy = document.getElementById('btn-pwd-copy');
    const meterFill = document.getElementById('pwd-meter-fill');
    const meterLabel = document.getElementById('pwd-meter-label');
    const batchList = document.getElementById('pwd-batch-list');

    if (!display) return;

    const CHAR_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const CHAR_LOWER = 'abcdefghijklmnopqrstuvwxyz';
    const CHAR_NUMS = '0123456789';
    const CHAR_SYMS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const AMBIGUOUS = /[l1IO0o]/g;

    function generatePassword() {
        const len = parseInt(lengthSlider.value, 10);
        lengthVal.textContent = len;

        let charPool = '';
        if (chkUpper.checked) charPool += CHAR_UPPER;
        if (chkLower.checked) charPool += CHAR_LOWER;
        if (chkNumbers.checked) charPool += CHAR_NUMS;
        if (chkSymbols.checked) charPool += CHAR_SYMS;

        if (chkNoAmbiguous.checked) {
            charPool = charPool.replace(AMBIGUOUS, '');
        }

        if (charPool.length === 0) {
            display.textContent = 'Select at least one set';
            meterFill.style.width = '0%';
            meterLabel.textContent = 'None';
            return;
        }

        // Crypto secure random generation
        const array = new Uint32Array(len);
        window.crypto.getRandomValues(array);
        let password = '';
        for (let i = 0; i < len; i++) {
            password += charPool[array[i] % charPool.length];
        }

        display.textContent = password;
        assessStrength(password, charPool.length);
        generateBatch(charPool, len);
    }

    function assessStrength(pwd, poolSize) {
        // Entropy: E = L * log2(poolSize)
        const entropy = Math.round(pwd.length * (Math.log(poolSize) / Math.LN2));
        let pct = Math.min(100, Math.round((entropy / 128) * 100));
        meterFill.style.width = `${pct}%`;

        if (entropy < 40) {
            meterFill.style.backgroundColor = '#f43f5e';
            meterLabel.textContent = `Weak (${entropy} bits entropy)`;
        } else if (entropy < 65) {
            meterFill.style.backgroundColor = '#f59e0b';
            meterLabel.textContent = `Good (${entropy} bits entropy)`;
        } else if (entropy < 90) {
            meterFill.style.backgroundColor = '#10b981';
            meterLabel.textContent = `Strong (${entropy} bits entropy)`;
        } else {
            meterFill.style.backgroundColor = '#38bdf8';
            meterLabel.textContent = `Fortress Grade (${entropy} bits entropy)`;
        }
    }

    function generateBatch(charPool, len) {
        if (!batchList) return;
        batchList.innerHTML = '';
        for (let b = 0; b < 3; b++) {
            const arr = new Uint32Array(len);
            window.crypto.getRandomValues(arr);
            let p = '';
            for (let i = 0; i < len; i++) {
                p += charPool[arr[i] % charPool.length];
            }
            const item = document.createElement('div');
            item.className = 'batch-pwd-item';
            item.innerHTML = `<code>${p}</code> <button class="btn-copy-chip" title="Copy">Copy</button>`;
            item.querySelector('button').addEventListener('click', () => copyToClipboard(p));
            batchList.appendChild(item);
        }
    }

    lengthSlider.addEventListener('input', generatePassword);
    [chkUpper, chkLower, chkNumbers, chkSymbols, chkNoAmbiguous].forEach(el => {
        el.addEventListener('change', generatePassword);
    });

    btnGenerate.addEventListener('click', generatePassword);
    btnCopy.addEventListener('click', () => copyToClipboard(display.textContent, 'Password copied!'));

    generatePassword();
}

/* ==========================================================================
   4. Word & Character Counter / Case Converter
   ========================================================================== */
function initWordCounter() {
    const textInput = document.getElementById('wc-input');
    const statWords = document.getElementById('stat-words');
    const statChars = document.getElementById('stat-chars');
    const statCharsNoSpaces = document.getElementById('stat-chars-nospace');
    const statSentences = document.getElementById('stat-sentences');
    const statParagraphs = document.getElementById('stat-paragraphs');
    const statReadingTime = document.getElementById('stat-read-time');
    const btnClear = document.getElementById('btn-wc-clear');
    const btnCopy = document.getElementById('btn-wc-copy');

    if (!textInput) return;

    function updateStats() {
        const text = textInput.value;

        // Words
        const words = text.trim() ? text.trim().match(/\S+/g) || [] : [];
        const wordCount = words.length;

        // Chars
        const charCount = text.length;
        const charNoSpaces = text.replace(/\s/g, '').length;

        // Sentences
        const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean) : [];
        const sentenceCount = sentences.length;

        // Paragraphs
        const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0) : [];
        const paragraphCount = paragraphs.length;

        // Reading time: ~200 words/min
        const readMin = Math.ceil(wordCount / 200);

        statWords.textContent = wordCount.toLocaleString();
        statChars.textContent = charCount.toLocaleString();
        statCharsNoSpaces.textContent = charNoSpaces.toLocaleString();
        if (statSentences) statSentences.textContent = sentenceCount.toLocaleString();
        if (statParagraphs) statParagraphs.textContent = paragraphCount.toLocaleString();
        if (statReadingTime) statReadingTime.textContent = `${readMin} min`;
    }

    textInput.addEventListener('input', updateStats);

    // Case converters
    const caseActions = {
        'case-upper': (t) => t.toUpperCase(),
        'case-lower': (t) => t.toLowerCase(),
        'case-title': (t) => t.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
        'case-camel': (t) => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()),
        'case-kebab': (t) => t.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        'case-snake': (t) => t.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, ''),
        'case-clean': (t) => t.replace(/[ \t]+/g, ' ').replace(/^\s+|\s+$/gm, '')
    };

    Object.keys(caseActions).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                textInput.value = caseActions[btnId](textInput.value);
                updateStats();
                showToast(`Converted to ${btn.textContent}`);
            });
        }
    });

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            textInput.value = '';
            updateStats();
        });
    }

    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            copyToClipboard(textInput.value, 'Text copied!');
        });
    }

    // Default sample text
    textInput.value = "OmniTools delivers zero-latency web tools directly in your browser. All processing is 100% client-side, ensuring your confidential data never touches external servers.";
    updateStats();
}

/* ==========================================================================
   5. Quick Utilities: UUID, URL Encode, Epoch Converter
   ========================================================================== */
function initQuickUtilities() {
    // UUID v4
    const uuidDisplay = document.getElementById('quick-uuid-val');
    const btnGenUuid = document.getElementById('btn-gen-uuid');
    const btnCopyUuid = document.getElementById('btn-copy-uuid');

    function generateUUID() {
        if (window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    if (uuidDisplay && btnGenUuid) {
        btnGenUuid.addEventListener('click', () => {
            uuidDisplay.value = generateUUID();
        });
        btnCopyUuid.addEventListener('click', () => {
            copyToClipboard(uuidDisplay.value, 'UUID copied!');
        });
        uuidDisplay.value = generateUUID();
    }

    // URL Encoder / Decoder
    const urlInput = document.getElementById('quick-url-input');
    const btnUrlEnc = document.getElementById('btn-quick-url-enc');
    const btnUrlDec = document.getElementById('btn-quick-url-dec');

    if (urlInput && btnUrlEnc) {
        btnUrlEnc.addEventListener('click', () => {
            try {
                urlInput.value = encodeURIComponent(urlInput.value);
                showToast('URL Encoded');
            } catch (e) {
                showToast('Error encoding URL');
            }
        });
        btnUrlDec.addEventListener('click', () => {
            try {
                urlInput.value = decodeURIComponent(urlInput.value);
                showToast('URL Decoded');
            } catch (e) {
                showToast('Invalid encoded URL');
            }
        });
    }

    // Epoch Timestamp Converter
    const epochDisplay = document.getElementById('quick-epoch-val');
    const epochHuman = document.getElementById('quick-epoch-human');
    const btnRefreshEpoch = document.getElementById('btn-refresh-epoch');

    function updateEpoch() {
        const nowSec = Math.floor(Date.now() / 1000);
        if (epochDisplay) epochDisplay.value = nowSec;
        if (epochHuman) epochHuman.textContent = new Date().toUTCString();
    }

    if (epochDisplay && btnRefreshEpoch) {
        btnRefreshEpoch.addEventListener('click', updateEpoch);
        updateEpoch();
        setInterval(updateEpoch, 1000);
    }
}

/* ==========================================================================
   6. Search / Filter Bar
   ========================================================================== */
function initToolSearch() {
    const searchInput = document.getElementById('tool-search-input');
    const toolCards = document.querySelectorAll('.tool-card, .quick-tool-card');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        toolCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (query === '' || text.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
