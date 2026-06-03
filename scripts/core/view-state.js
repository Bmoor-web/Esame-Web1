// view-state.js - helper per sezioni asincrone

import { clearContainer, showLoading } from "./errors.js";

/**
 * Esegue una richiesta asincrona con stato di caricamento e callback di successo.
 *
 * @param {object} options - Opzioni dell'operazione
 * @param {HTMLElement} options.loadingContainer - Container dove mostrare il loading
 * @param {string} [options.loadingMessage="Caricamento..."] - Messaggio di loading
 * @param {Function} options.request - Funzione che restituisce una Promise
 * @param {Function} options.onSuccess - Callback eseguita al successo
 * @param {Function} [options.onError] - Callback eseguita in caso di errore
 * @param {Array<HTMLElement>} [options.clearContainers=[]] - Container da svuotare prima del caricamento
 * @returns {Promise<any>|void}
 */
export async function runAsyncSection({
    loadingContainer,
    loadingMessage = "Caricamento...",
    request,
    onSuccess,
    onError,
    clearContainers = [],
}) {
    if (!loadingContainer || typeof request !== "function" || typeof onSuccess !== "function") {
        return;
    }

    showLoading(loadingContainer, loadingMessage);

    clearContainers.forEach((container) => {
        clearContainer(container);
    });

    try {
        const data = await request();
        return onSuccess(data);
    } catch (error) {
        if (typeof onError === "function") {
            return onError(error);
        }

        throw error;
    }
}
