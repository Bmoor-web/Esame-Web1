// errors.js - stati UI e sanitizzazione

/**
 * Mostra uno stato di caricamento in un container.
 *
 * @param {HTMLElement} container - Container DOM
 * @param {string} [message="Caricamento..."] - Messaggio da visualizzare
 * @returns {void}
 */
export function showLoading(container, message = "Caricamento...") {
    if (!container) {
        return;
    }

    container.innerHTML = `<div class="state-panel loading">${sanitizeHTML(message)}</div>`;
}

/**
 * Mostra un messaggio di errore in un container.
 *
 * @param {HTMLElement} container - Container DOM
 * @param {string} [title="Errore"] - Titolo dell'errore
 * @param {string} [message=""] - Dettaglio dell'errore
 * @returns {void}
 */
export function showError(container, title = "Errore", message = "") {
    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="state-panel error">
            <strong>${sanitizeHTML(title)}</strong>
            ${message ? `<p>${sanitizeHTML(message)}</p>` : ""}
        </div>
    `;
}

/**
 * Mostra uno stato vuoto.
 *
 * @param {HTMLElement} container - Container DOM
 * @param {string} [message="Nessun dato disponibile."] - Messaggio da visualizzare
 * @returns {void}
 */
export function showEmpty(container, message = "Nessun dato disponibile.") {
    if (!container) {
        return;
    }

    container.innerHTML = `<div class="state-panel empty">${sanitizeHTML(message)}</div>`;
}

/**
 * Svuota il contenuto di un container.
 *
 * @param {HTMLElement} container - Container DOM
 * @returns {void}
 */
export function clearContainer(container) {
    if (!container) {
        return;
    }

    container.innerHTML = "";
}

/**
 * Sanifica una stringa per l'uso in HTML.
 *
 * @param {any} value - Valore da sanificare
 * @returns {string}
 */
export function sanitizeHTML(value) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };

    return String(value ?? "").replace(/[&<>"']/g, (character) => map[character]);
}

/**
 * Rimuove i tag HTML e restituisce il solo testo.
 *
 * @param {string} html - HTML di input
 * @returns {string}
 */
export function stripHtml(html) {
    if (!html) {
        return "";
    }

    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}
