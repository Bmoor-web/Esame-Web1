# Hacker News Tech Feed — Esame-Web1

Applicazione web sviluppata in Vanilla JavaScript, HTML5 e CSS3 per l'aggregazione di notizie tech da Hacker News. Il progetto consuma la REST API pubblica di Hacker News (https://hacker-news.firebaseio.com/v0/) per recuperare articoli top, thread commenti e profili utente.

## Architettura e Struttura Directory

L'app è modulare e basata su ES6 Modules. La separazione dei file segue il principio di *Separation of Concerns* per disaccoppiare accesso ai dati, logica di pagina e componenti UI.

```text
Esame-Web1/
├── public/                # Viste HTML e CSS
│   ├── style.css          # Foglio di stile globale
│   ├── index.html         # Entry point
│   ├── radar.html         # Feed articoli più votati
│   ├── focus.html         # Visualizzazione thread/commenti
│   ├── profile.html       # Profilo utente
│   └── archive.html       # Lista articoli salvati
├── scripts/               # Logica applicativa
│   ├── components/        # Componenti UI
│   ├── core/              # Infrastruttura, header/footer, stato
│   ├── pages/             # Controller per singole view
│   └── services/          # Accesso ai dati e persistenza
├── LICENSE
└── README.md
```

## Funzionalità Core

- **Top Stories Feed (`scripts/pages/radar.js`, `scripts/services/api.js`)**: fetching concorrente di storie top da Hacker News con rendering dinamico delle card.
- **Thread e Commenti (`scripts/pages/focus.js`, `scripts/components/thread-comments.js`)**: visualizzazione ricorsiva dell'albero commenti con lazy loading per rami profondi.
- **Profilo Utente (`scripts/pages/profile.js`)**: recupero dati profilo e attività tramite query string `?user=<id>`.
- **Read It Later (`scripts/pages/archive.js`, `scripts/services/storage.js`)**: persistenza client-side degli ID articolo via `localStorage` con re-idratazione asincrona.
- **Dynamic UI (`scripts/components/story-card.js`, `scripts/components/records-table.js`)**: aggiornamento asincrono del DOM, gestione eventi e stati di loading.

## Setup ed Esecuzione

Trattandosi di un'architettura puramente front-end (statica) priva di build step, non è richiesta l'installazione di pacchetti npm. È sufficiente servire i file statici tramite un local web server (es. estensione `Live Server` per VS Code o Node `http-server`) puntando alla directory root del progetto. L'entry point di navigazione è `public/index.html`.

A quel punto l'applicazione sarà accessibile all'indirizzo locale e potete esplorare il feed di storie top, navigare tra thread e commenti, consultare profili utente e gestire la lista personale di articoli da leggere.

## Esercizi da Svolgere

Gli esercizi totali sono suddivisi in 3 macro-aree di intervento, ognuna con un peso specifico in termini di punteggio finale.
I primi due avranno anche dei commenti `TODO` all'interno del codice per guidarvi nei punti esatti in cui intervenire.
Il terzo esercizio richiede invece un'attività di debugging logico, per cui dovrete esplorare autonomamente i file per trovare e risolvere il problema.

Nel caso può essere utile, usare il numero storia: `48195009` per testare le funzionalità di recupero dati e visualizzazione. Poi per vedere la pagina Profilo, cliccare sull'autore `andreww591` così da essere reindirizzati alla pagina `profile.html?user=andreww591` e verificare che i dati siano corretti.

### 1. INTEGRAZIONI DATI (60p)

**Obiettivo:** Ripristinare il sistema di recupero e visualizzazione delle storie nella pagina principale. Il sito per ora da errore o mostra dati incompleti.

**Task richiesti:**

1. **Data Fetching in [scripts/services/api.js](scripts/services/api.js)**\
   Completa la logica della funzione `requestJson` per effettuare una fetch. Questo metodo è il cuore del sito e viene usato da tutte le funzioni di accesso ai dati. Dovrai, dato un url in input, effettuare correttamente la fetch e restituire i dati come oggetto, senza trasformarli o manipolarli.

2. **Data Binding & UI Rendering in [scripts/components/story-card.js](scripts/components/story-card.js)**\
   Una volta recuperati i dati, completa la funzione `createStoryCard` per popolare correttamente la card di ogni storia. Dovrai sanificare i dati dinamici con `sanitizeHTML` (se necessario e richiesto) e assicurarti che tutte le informazioni richieste (titolo, meta info, link...) siano visualizzate in modo chiaro e ordinato.


### 2. CORREZIONE LAYOUT

**Obiettivo:** Ripristinare la visualizzazione di alcune sezioni del sito che presentano anomalie strutturali ed estetiche.

**Task richiesti:**

1. **Classi mancanti in [public/radar.html](public/radar.html)**\
   Nel file `public/radar.html` mancano alcune classi CSS che causano la visione dei componenti non formattati correttamente. Controlla la pagina e la struttura degli altri file HTML per identificare quali classi sono necessarie e applicale agli elementi corretti.

2. **Stili CSS in [public/style.css](public/style.css)**\
   Completa le regole CSS per gli stati `hover` e `active` dei link di navigazione. Assicurati che i link reagiscano visivamente al passaggio del mouse e quando sono attivi, migliorando l'usabilità e l'estetica del sito.

3. **CSS per la tabella dei record [public/style.css](public/style.css)**\
   Completa le regole CSS per la tabella dei record della pagina `profile.html`, aggiungendo padding alle celle e mettendo a posto le intestazioni e le righe in modo che siano più leggibili e visivamente distinte.


### 3. DEBUGGING LOGICO

**Obiettivo:** Individuare e risolvere un'anomalia logica del codice che impedisce il corretto funzionamento di una funzionalità del sito.

**Problema riscontrato:** Nella pagina `radar.html`, quando le storie vengono caricate, appare sempre il pulsante "Salvata" attivo, come se tutte le storie fossero già state salvate nell'archivio. Inoltre se si preme sul tasto "Salvata" il pulsante diventa "Salva" correttamente, ma se si cerca di cliccarci sopra di nuovo, invece di riattivarsi come "Salvata" rimane "Salva".\
Il pulsante dovrebbe comportarsi diversamente: "Salva" permette di salvare la storia nell'archivio se non presente, mentre "Salvata" indica che la storia è già presente nell'archivio e permette di rimuoverla se cliccato.

**Task richiesti:**
1. Individua la causa di questo comportamento anomalo, esplorando il codice della pagina `radar.html` e dei relativi componenti e/o servizi coinvolti.
2. Risolvi il problema in modo che il pulsante "Salva"/"Salvata" si comporti correttamente in base alla presenza o meno della storia nell'archivio, e che cambi stato ogni volta che viene cliccato.
