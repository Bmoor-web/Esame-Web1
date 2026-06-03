// thread-comments.js - rendering ricorsivo commenti

import { sanitizeHTML, stripHtml } from "../core/errors.js";
import { getCommentChildren } from "../services/api.js";

function createCommentNode(comment, depth = 0) {
    const wrapper = document.createElement("article");
    wrapper.className = `comment-card comment-card--depth-${Math.min(depth, 5)}`;

    const author = sanitizeHTML(comment.by || "anon");
    const text = sanitizeHTML(stripHtml(comment.text || "")).trim() || "[commento vuoto]";
    const authorLink = comment.by && comment.by !== "anon"
        ? `<a class="comment-author-link" href="profile.html?user=${encodeURIComponent(comment.by)}">${author}</a>`
        : author;

    wrapper.innerHTML = `
        <div class="comment-card__meta">
            <span class="comment-card__author">${authorLink}</span>
            <span class="comment-card__time">${sanitizeHTML(comment.timeLabel || "N/D")}</span>
            <span class="comment-card__badge">Profondità ${depth}</span>
        </div>
        <div class="comment-card__body"><p>${text}</p></div>
        <div class="comment-card__actions"></div>
        <div class="comment-children hidden"></div>
    `;

    const childrenContainer = wrapper.querySelector(".comment-children");
    const actions = wrapper.querySelector(".comment-card__actions");

    if (Array.isArray(comment.kids) && comment.kids.length > 0) {
        const lazyButton = document.createElement("button");
        lazyButton.type = "button";
        lazyButton.className = "btn btn-secondary";
        lazyButton.textContent = `Apri risposte (${comment.kids.length})`;

        let loaded = false;

        lazyButton.addEventListener("click", async () => {
            if (loaded) {
                const hidden = childrenContainer.classList.toggle("hidden");
                lazyButton.textContent = hidden ? `Apri risposte (${comment.kids.length})` : "Chiudi risposte";
                return;
            }

            lazyButton.disabled = true;
            lazyButton.textContent = "Carico risposte...";

            const children = await getCommentChildren(comment);
            renderCommentsTree(childrenContainer, children, depth + 1);
            childrenContainer.classList.remove("hidden");

            loaded = true;
            lazyButton.disabled = false;
            lazyButton.textContent = "Chiudi risposte";
        });

        actions.appendChild(lazyButton);
    }

    return wrapper;
}

/**
 * Renderizza ricorsivamente un array di commenti.
 *
 * @param {HTMLElement} container - Container di destinazione
 * @param {Array<object>} comments - Commenti da renderizzare
 * @param {number} [depth=0] - Profondità corrente
 * @returns {void}
 */
export function renderCommentsTree(container, comments, depth = 0) {
    if (!container) {
        return;
    }

    const fragment = document.createDocumentFragment();

    comments
        .filter((comment) => comment && comment.type === "comment")
        .forEach((comment) => {
            fragment.appendChild(createCommentNode(comment, depth));
        });

    if (depth === 0) {
        container.classList.add("thread-container");
    }

    container.appendChild(fragment);
}
