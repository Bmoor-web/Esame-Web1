// records-table.js - tabella riusabile

import { sanitizeHTML } from "../core/errors.js";

/**
 * Renderizza una tabella con colonne configurabili.
 *
 * @param {object} options - Opzioni di rendering
 * @param {HTMLElement} options.container - Container DOM
 * @param {string} options.emptyMessage - Messaggio se non ci sono record
 * @param {Array<object>} options.records - Record da visualizzare
 * @param {Array<object>} options.columns - Colonne ({ header, render })
 * @param {Function} [options.onDelete] - Callback rimozione riga
 * @param {Function} [options.onDeleteAll] - Callback cancellazione totale
 * @param {string} [options.clearAllLabel="Cancella tutti"] - Etichetta pulsante pulizia
 * @param {string} [options.deleteLabel="Rimuovi"] - Etichetta pulsante riga
 * @returns {void}
 */
export function renderRecordsTable({
    container,
    emptyMessage,
    records,
    columns,
    onDelete,
    onDeleteAll,
    clearAllLabel = "Cancella tutti",
    deleteLabel = "Rimuovi",
}) {
    if (!container) {
        return;
    }

    if (!Array.isArray(records) || records.length === 0) {
        container.innerHTML = `<div class="state-panel empty">${sanitizeHTML(emptyMessage)}</div>`;
        return;
    }

    const withActions = typeof onDelete === "function";
    const headers = columns.map((column) => `<th>${sanitizeHTML(column.header)}</th>`).join("");
    const finalHeaders = withActions ? `${headers}<th>Azioni</th>` : headers;

    const rows = records
        .map((record, index) => {
            const cells = columns
                .map((column) => `<td>${sanitizeHTML(String(column.render(record, index)))}</td>`)
                .join("");
            const actionCell = withActions
                ? `<td><button type="button" class="btn btn-danger btn-delete" data-row="${index}">${sanitizeHTML(deleteLabel)}</button></td>`
                : "";

            return `<tr class="records-row">${cells}${actionCell}</tr>`;
        })
        .join("");

    container.innerHTML = `
        <section class="records-panel">
            <div class="records-header">
                ${typeof onDeleteAll === "function" ? `<button id="btn-clear-all" class="btn btn-danger" type="button">${sanitizeHTML(clearAllLabel)}</button>` : ""}
            </div>
            <div class="records-table-wrapper">
                <table class="records-table">
                    <thead><tr>${finalHeaders}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </section>
    `;

    if (withActions) {
        container.querySelectorAll(".btn-delete").forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.row);
                onDelete(records[index]);
            });
        });
    }

    if (typeof onDeleteAll === "function") {
        container.querySelector("#btn-clear-all")?.addEventListener("click", () => {
            const confirmed = confirm("Vuoi svuotare completamente l'archivio?");

            if (confirmed) {
                onDeleteAll();
            }
        });
    }
}
