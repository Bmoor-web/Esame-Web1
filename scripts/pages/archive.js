// read-later.js - archivio locale delle story salvate

import { renderStoryCards } from "../components/story-card.js";
import { showEmpty, showError, showLoading } from "../core/errors.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { getItemsByIds } from "../services/api.js";
import { clearReadLater, getReadLaterIds, isReadLater, toggleReadLater } from "../services/storage.js";

const archiveSummary = document.querySelector("#archive-summary");
const archiveRoot = document.querySelector("#archive-root");
const sortSelect = document.querySelector("#archive-sort-select");
const clearButton = document.querySelector("#clear-archive-button");

function sortItems(items, mode) {
    const sorted = [...items];

    switch (mode) {
        case "saved-asc":
            sorted.sort((left, right) => (left.score || 0) - (right.score || 0));
            break;
        case "time-desc":
            sorted.sort((left, right) => (right.time || 0) - (left.time || 0));
            break;
        case "time-asc":
            sorted.sort((left, right) => (left.time || 0) - (right.time || 0));
            break;
        default:
            sorted.sort((left, right) => (right.score || 0) - (left.score || 0));
            break;
    }

    return sorted;
}

function renderSummary(items) {
    if (!archiveSummary) {
        return;
    }

    const totalScore = items.reduce((sum, item) => sum + (item.score || 0), 0);
    const totalComments = items.reduce((sum, item) => sum + (item.descendants || 0), 0);
    const newest = [...items].sort((left, right) => (right.time || 0) - (left.time || 0))[0];

    archiveSummary.innerHTML = `
        <div class="stat-card">
            <span class="stat-label">Nella tua lista</span>
            <strong class="stat-value">${items.length}</strong>
            <p class="stat-note">Le storie che hai scelto di conservare.</p>
        </div>
        <div class="stat-card">
            <span class="stat-label">Totale score</span>
            <strong class="stat-value">${totalScore}</strong>
            <p class="stat-note">Una misura rapida di quanto pesa la selezione.</p>
        </div>
        <div class="stat-card">
            <span class="stat-label">Commenti</span>
            <strong class="stat-value">${totalComments}</strong>
            <p class="stat-note">Ti aiuta a capire quanto è viva la discussione.</p>
        </div>
        <div class="stat-card">
            <span class="stat-label">Ultima aggiunta</span>
            <strong class="stat-value">${newest ? newest.timeLabel : "N/D"}</strong>
            <p class="stat-note">${newest ? newest.title : "Nessun elemento disponibile"}</p>
        </div>
    `;
}

async function hydrateReadLater() {
    const ids = getReadLaterIds();

    if (ids.length === 0) {
        showEmpty(archiveSummary, "Non hai ancora salvato nulla.");
        showEmpty(archiveRoot, "Quando salvi una story, la ritrovi qui.");
        return;
    }

    showLoading(archiveSummary, "Rileggo l'archivio...");
    showLoading(archiveRoot, "Ricarico le story salvate...");

    try {
        const stories = await getItemsByIds(ids);
        const filtered = stories.filter((item) => item && (item.type === "story" || item.type === "job"));
        const sorted = sortItems(filtered, sortSelect?.value || "saved-desc");

        if (sorted.length === 0) {
            showEmpty(archiveSummary, "Le storie salvate non sono più disponibili.");
            showEmpty(archiveRoot, "Le storie salvate non sono più disponibili.");
            return;
        }

        renderSummary(sorted);
        renderStoryCards({
            container: archiveRoot,
            stories: sorted,
            showActions: true,
            showThreadButton: false,
            feedVariant: "list",
            isSaved: (story) => isReadLater(story.id),
            onToggleSave: async () => {
                await hydrateReadLater();
            },
        });
        archiveRoot.querySelectorAll(".story-card").forEach((card) => {
            const href = card.dataset.threadHref;

            if (!href) {
                return;
            }

            card.tabIndex = 0;
            card.setAttribute("role", "link");

            const navigate = () => {
                window.location.href = href;
            };

            card.addEventListener("click", (event) => {
                if (event.target.closest("a, button")) {
                    return;
                }

                navigate();
            });

            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate();
                }
            });
        });
    } catch (error) {
        showError(archiveSummary, "Errore", error.message || "Impossibile recuperare la lista salvata.");
        showError(archiveRoot, "Errore", error.message || "Impossibile recuperare la lista salvata.");
    }
}

async function handleClearArchive() {
    clearReadLater();
    await hydrateReadLater();
}

function init() {
    mountHeader("archive");
    mountFooter();

    sortSelect?.addEventListener("change", hydrateReadLater);
    clearButton?.addEventListener("click", handleClearArchive);

    hydrateReadLater();
}

init();
