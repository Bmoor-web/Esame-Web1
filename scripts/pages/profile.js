// profile.js - profilo autore e attività recenti

import { renderRecordsTable } from "../components/records-table.js";
import { showEmpty, showError, showLoading, stripHtml, sanitizeHTML } from "../core/errors.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { getUserSubmittedItems } from "../services/api.js";

const userInput = document.querySelector("#user-id-input");
const loadUserButton = document.querySelector("#load-user-button");
const profileRoot = document.querySelector("#profile-root");
const activityRoot = document.querySelector("#activity-root");

function getInitial(userId) {
    return String(userId || "?").trim().slice(0, 1).toUpperCase() || "?";
}

function formatActivityTitle(item) {
    const titleText = item.title || "";
    const textSnippet = stripHtml(item.text || "").trim();
    const fallback = titleText || textSnippet || (item.url ? item.url : "");
    return fallback ? fallback.slice(0, 96) : "N/D";
}

function renderProfile(user, items) {
    if (!profileRoot) {
        return;
    }

    const about = stripHtml(user.about || "").trim();

    profileRoot.innerHTML = `
        <article class="profile-hero">
            <div class="profile-avatar">${getInitial(user.id)}</div>
            <div class="profile-summary">
                <p class="eyebrow">Profilo autore</p>
                <h2 class="profile-title">${sanitizeHTML(user.id)}</h2>
                <p class="profile-about">${sanitizeHTML(about || "Nessuna bio pubblica disponibile per questo autore.")}</p>
                <div class="profile-meta-grid">
                    <div class="profile-stat">
                        <label>Karma</label>
                        <strong>${user.karma}</strong>
                        <p>Punteggio complessivo del profilo.</p>
                    </div>
                    <div class="profile-stat">
                        <label>Creato il</label>
                        <strong>${sanitizeHTML(user.createdLabel || "N/D")}</strong>
                        <p>Data di registrazione dell'account.</p>
                    </div>
                    <div class="profile-stat">
                        <label>Submission lette</label>
                        <strong>${items.length}</strong>
                        <p>Ultimi contenuti estratti dal feed dell'utente.</p>
                    </div>
                    <div class="profile-stat">
                        <label>Modalità</label>
                        <strong>Editoriale</strong>
                        <p>Una scheda profilo più visiva rispetto alla vista base.</p>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function renderActivity(items) {
    renderRecordsTable({
        container: activityRoot,
        emptyMessage: "Nessuna attività recente disponibile.",
        records: items,
        columns: [
            { header: "Tipo", render: (item) => item.type || "N/D" },
            { header: "Titolo", render: (item) => formatActivityTitle(item) },
            { header: "Score", render: (item) => item.score },
            { header: "Commenti", render: (item) => item.descendants },
            { header: "Data", render: (item) => item.timeLabel },
        ],
    });
}

async function loadProfile() {
    const userId = userInput?.value.trim();

    if (!userId) {
        showError(profileRoot, "Input mancante", "Inserisci uno username Hacker News.");
        showEmpty(activityRoot, "Le ultime attività verranno mostrate qui.");
        return;
    }

    showLoading(profileRoot, "Carico il profilo...");
    showLoading(activityRoot, "Carico l'attività recente...");

    try {
        const { user, items } = await getUserSubmittedItems(userId, 10);
        renderProfile(user, items);
        renderActivity(items);
    } catch (error) {
        showError(profileRoot, "Errore", error.message || "Impossibile recuperare il profilo.");
        showError(activityRoot, "Errore", error.message || "Impossibile recuperare l'attività recente.");
    }
}

function init() {
    mountHeader("profile");
    mountFooter();

    loadUserButton?.addEventListener("click", loadProfile);
    userInput?.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            loadProfile();
        }
    });

    const params = new URLSearchParams(window.location.search);
    const initialUser = params.get("user");

    if (initialUser) {
        userInput.value = initialUser;
        loadProfile();
        return;
    }

    showEmpty(profileRoot, "Inserisci uno username per visualizzare il profilo.");
    showEmpty(activityRoot, "Le ultime attività verranno mostrate qui.");
}

init();
