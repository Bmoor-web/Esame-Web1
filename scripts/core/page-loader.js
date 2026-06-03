// page-loader.js - helper per collezioni

import { showEmpty, showError } from "./errors.js";
import { runAsyncSection } from "./view-state.js";

/**
 * Carica una collezione gestendo gli stati di loading, empty ed errore.
 *
 * @param {object} options - Opzioni del caricamento
 * @param {HTMLElement} options.container - Container del risultato
 * @param {Function} options.request - Funzione che restituisce una Promise con gli elementi
 * @param {string} options.loadingMessage - Messaggio di caricamento
 * @param {string} options.emptyMessage - Messaggio per lista vuota
 * @param {Function} options.render - Funzione di rendering
 * @returns {Promise<any>}
 */
export async function loadCollection({
    container,
    request,
    loadingMessage,
    emptyMessage,
    render,
}) {
    return runAsyncSection({
        loadingContainer: container,
        loadingMessage,
        request,
        onSuccess: (items) => {
            if (!Array.isArray(items) || items.length === 0) {
                showEmpty(container, emptyMessage);
                return;
            }

            render(items);
        },
        onError: (error) => {
            showError(container, "Errore nel caricamento", error.message || "Operazione non riuscita");
        },
    });
}
