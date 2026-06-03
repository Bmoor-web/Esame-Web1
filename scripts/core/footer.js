// footer.js - footer riusabile

/**
 * Crea il footer della piattaforma.
 *
 * @returns {HTMLElement}
 */
export function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "footer";

    footer.innerHTML = `
        <div class="footer-shell">
            <p>Signal Atlas ti accompagna tra le storie più interessanti, i thread e la tua lista personale.</p>
            <p>Un progetto pensato per leggere, aprire e ritrovare contenuti con semplicità.</p>
        </div>
    `;

    return footer;
}

/**
 * Inserisce il footer nel contenitore indicato.
 *
 * @param {HTMLElement} [container=document.body] - Container di destinazione
 * @returns {void}
 */
export function mountFooter(container = document.body) {
    container.appendChild(createFooter());
}
