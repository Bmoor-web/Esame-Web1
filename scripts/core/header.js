// header.js - header riusabile

/**
 * Crea l'header della piattaforma.
 *
 * @param {string} [currentPage="home"] - ID della pagina attiva
 * @returns {HTMLElement}
 */
export function createHeader(currentPage = "home") {
    const header = document.createElement("header");
    header.className = "header";

    const pages = [
        { id: "home", label: "Home", path: "index.html" },
        { id: "radar", label: "Radar", path: "radar.html" },
        { id: "focus", label: "Focus", path: "focus.html" },
        { id: "profile", label: "Autori", path: "profile.html" },
        { id: "archive", label: "Archivio", path: "archive.html" },
    ];

    const navItems = pages
        .map((page) => {
            const activeClass = page.id === currentPage ? " active" : "";
            return `<li><a class="nav-link${activeClass}" href="${page.path}">${page.label}</a></li>`;
        })
        .join("");

    header.innerHTML = `
        <div class="header-shell">
            <a class="brand" href="index.html">
                <span class="brand-mark">S</span>
                <span class="brand-copy">
                    <strong>Signal Atlas</strong>
                    <small>Hacker News re-immaginato</small>
                </span>
            </a>
            <nav class="header-nav" aria-label="Navigazione principale">
                <ul>${navItems}</ul>
            </nav>
        </div>
    `;

    return header;
}

/**
 * Inserisce l'header nel contenitore indicato.
 *
 * @param {string} [currentPage="home"] - ID della pagina attiva
 * @param {HTMLElement} [container=document.body] - Container di destinazione
 * @returns {void}
 */
export function mountHeader(currentPage = "home", container = document.body) {
    container.prepend(createHeader(currentPage));
}
