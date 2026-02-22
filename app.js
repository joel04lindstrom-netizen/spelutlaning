let qrScanner;

// ======== PERSONER ========
const cardsData = [
  { cardId: "LK-01", name: "Adam", activeLoan: false },
  { cardId: "LK-02", name: "Aditya", activeLoan: false },
  { cardId: "LK-03", name: "Aleksandar", activeLoan: false },
  { cardId: "LK-04", name: "Alice", activeLoan: false },
  { cardId: "LK-05", name: "Alicia-RM", activeLoan: false },
  { cardId: "LK-06", name: "Alicia-P", activeLoan: false },
  { cardId: "LK-07", name: "Anlin", activeLoan: false },
  { cardId: "LK-08", name: "Anton", activeLoan: false },
  { cardId: "LK-09", name: "Arvin", activeLoan: false },
  { cardId: "LK-10", name: "August", activeLoan: false },
  { cardId: "LK-11", name: "Baran", activeLoan: false },
  { cardId: "LK-12", name: "Bella", activeLoan: false },
  { cardId: "LK-13", name: "Danielle", activeLoan: false },
  { cardId: "LK-14", name: "Ellinor", activeLoan: false },
  { cardId: "LK-15", name: "Ema", activeLoan: false },
  { cardId: "LK-16", name: "Emilia", activeLoan: false },
  { cardId: "LK-17", name: "Emilija", activeLoan: false },
  { cardId: "LK-18", name: "Emma", activeLoan: false },
  { cardId: "LK-19", name: "Freja", activeLoan: false },
  { cardId: "LK-20", name: "Greta", activeLoan: false },
  { cardId: "LK-21", name: "Harry", activeLoan: false },
  { cardId: "LK-22", name: "Hildana", activeLoan: false },
  { cardId: "LK-23", name: "Jonathan", activeLoan: false },
  { cardId: "LK-24", name: "Justina", activeLoan: false },
  { cardId: "LK-25", name: "Kai", activeLoan: false },
  { cardId: "LK-26", name: "Leia", activeLoan: false },
  { cardId: "LK-27", name: "Leo", activeLoan: false },
  { cardId: "LK-28", name: "Leonie", activeLoan: false },
  { cardId: "LK-29", name: "Lillian", activeLoan: false },
  { cardId: "LK-30", name: "Lou", activeLoan: false },
  { cardId: "LK-31", name: "Louise", activeLoan: false },
  { cardId: "LK-32", name: "Lovis", activeLoan: false },
  { cardId: "LK-33", name: "Lydia", activeLoan: false },
  { cardId: "LK-34", name: "Mateo", activeLoan: false },
  { cardId: "LK-35", name: "Matvei", activeLoan: false },
  { cardId: "LK-36", name: "Maxine", activeLoan: false },
  { cardId: "LK-37", name: "Minou", activeLoan: false },
  { cardId: "LK-38", name: "Noa", activeLoan: false },
  { cardId: "LK-39", name: "Noah-V", activeLoan: false },
  { cardId: "LK-40", name: "Noelia", activeLoan: false },
  { cardId: "LK-41", name: "Nora", activeLoan: false },
  { cardId: "LK-42", name: "Penny", activeLoan: false },
  { cardId: "LK-43", name: "Mia", activeLoan: false },
  { cardId: "LK-44", name: "Sveva", activeLoan: false },
  { cardId: "LK-45", name: "Tage", activeLoan: false },
  { cardId: "LK-46", name: "Talya", activeLoan: false },
  { cardId: "LK-47", name: "Theo", activeLoan: false },
  { cardId: "LK-48", name: "Vaani", activeLoan: false },
  { cardId: "LK-49", name: "Viggo", activeLoan: false },
  { cardId: "LK-50", name: "Yohan", activeLoan: false }
];

// ======== SPEL ========
const gamesData = [
  { gameId: "kalleha", title: "Kalleha", isLoaned: false },
  { gameId: "tre_i_rad", title: "Tre i rad", isLoaned: false },
  { gameId: "fyra_i_rad", title: "Fyra i rad", isLoaned: false },
  { gameId: "fia_med_knuff", title: "Fia med knuff", isLoaned: false },
  { gameId: "alphaphet", title: "Alphaphet", isLoaned: false },
  { gameId: "skipo", title: "Skipo", isLoaned: false },
  { gameId: "kortlek_1", title: "Kortlek (1)", isLoaned: false },
  { gameId: "kortlek_2", title: "Kortlek (2)", isLoaned: false }
];

// ======== AKTIVA LÅN & HISTORIK ========
const activeLoans = [];
const history = [];

// ======== MENY ========
function showView(view) {
  const container = document.getElementById("view");

  if (view === "scan") {
    container.innerHTML = `
      <h2>Skanna lånekort</h2>
      <div id="reader" style="width:300px"></div>
      <p id="scanResult"></p>
    `;
    startScanner();
  }

  if (view === "active") {
    let html = "<h2>Aktiva lån</h2><ul>";
    activeLoans.forEach(l => {
      html += `<li>${l.name} har lånat ${l.gameTitle} (${l.loanedAt})</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }

  if (view === "cards") {
    let html = "<h2>Lånekort</h2><ul>";
    cardsData.forEach(c => {
      html += `<li>${c.name} (ID: ${c.cardId}) - ${c.activeLoan ? "Har lån" : "Inget lån"}</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }

  if (view === "games") {
    let html = "<h2>Spel</h2><ul>";
    gamesData.forEach(g => {
      html += `<li>${g.title} - ${g.isLoaned ? "Utlånad" : "Tillgänglig"}</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }

  if (view === "history") {
    let html = "<h2>Historik</h2><ul>";
    history.forEach(h => {
      html += `<li>${h.timestamp}: ${h.name} ${h.action === "loan" ? "lånade" : "lämnade tillbaka"} ${h.gameTitle}</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }

  if (view === "stats") {
    let html = "<h2>Statistik</h2><ul>";
    gamesData.forEach(g => {
      const count = history.filter(h => h.gameTitle === g.title && h.action === "loan").length;
      html += `<li>${g.title}: ${count} lån totalt</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }
}

// ======== QR-SCANNER ========
function startScanner() {
  if (qrScanner) qrScanner.stop().catch(() => {});

  qrScanner = new Html5Qrcode("reader");
  qrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      document.getElementById("scanResult").innerText =
        "Skannad QR-kod: " + qrCodeMessage;

      qrScanner.stop();
      handleCardScan(qrCodeMessage);
    },
    errorMessage => {}
  );
}

// ======== HANTERA KORT ========
function handleCardScan(cardId) {
  const container = document.getElementById("view");

  container.innerHTML = `
    <h2>Kort identifierat</h2>
    <p><strong>Kort-ID:</strong> ${cardId}</p>
    <button onclick="showBorrow('${cardId}')">Låna spel</button>
    <button onclick="showReturn('${cardId}')">Lämna tillbaka</button>
  `;
}

// ======== LÅNA SPEL ========
function showBorrow(cardId) {
  const card = cardsData.find(c => c.cardId === cardId);
  const container = document.getElementById("view");

  if (card.activeLoan) {
    container.innerHTML = `<h2>${card.name} har redan ett lån. Måste lämna tillbaka först.</h2>
                           <button onclick="showView('scan')">Tillbaka</button>`;
    return;
  }

  const availableGames = gamesData.filter(g => !g.isLoaned);
  if (availableGames.length === 0) {
    container.innerHTML = `<h2>Inga spel är tillgängliga just nu</h2>
                           <button onclick="showView('scan')">Tillbaka</button>`;
    return;
  }

  let html = `<h2>Välj spel att låna för ${card.name}</h2><ul>`;
  availableGames.forEach(g => {
    html += `<li>${g.title} <button onclick="borrowGame('${cardId}','${g.gameId}')">Låna</button></li>`;
  });
  html += "</ul><button onclick='showView(\"scan\")'>Avbryt</button>";

  container.innerHTML = html;
}

function borrowGame(cardId, gameId) {
  const card = cardsData.find(c => c.cardId === cardId);
  const game = gamesData.find(g => g.gameId === gameId);

  card.activeLoan = true;
  game.isLoaned = true;

  activeLoans.push({
    cardId: card.cardId,
    name: card.name,
    gameId: game.gameId,
    gameTitle: game.title,
    loanedAt: new Date().toLocaleString()
  });

  history.push({
    cardId: card.cardId,
    name: card.name,
    gameTitle: game.title,
    action: "loan",
    timestamp: new Date().toLocaleString()
  });

  alert(`${card.name} har lånat ${game.title}`);
  showView("scan");
}

// ======== ÅTERLÄMNA ========
function showReturn(cardId) {
  const card = cardsData.find(c => c.cardId === cardId);
  const container = document.getElementById("view");

  if (!card.activeLoan) {
    container.innerHTML = `<h2>${card.name} har inga aktiva lån.</h2>
                           <button onclick="showView('scan')">Tillbaka</button>`;
    return;
  }

  const loanIndex = activeLoans.findIndex(l => l.cardId === cardId);
  const loan = activeLoans[loanIndex];

  let html = `<h2>Återlämna ${loan.gameTitle} för ${card.name}?</h2>`;
  html += `<button onclick="returnGame('${cardId}')">Återlämna</button>`;
  html += `<button onclick="showView('scan')">Avbryt</button>`;

  container.innerHTML = html;
}

function returnGame(cardId) {
  const card = cardsData.find(c => c.cardId === cardId);
  const loanIndex = activeLoans.findIndex(l => l.cardId === cardId);
  const loan = activeLoans[loanIndex];

  card.activeLoan = false;
  const game = gamesData.find(g => g.gameId === loan.gameId);
  game.isLoaned = false;

  activeLoans.splice(loanIndex, 1);

  history.push({
    cardId: card.cardId,
    name: card.name,
    gameTitle: game.title,
    action: "return",
    timestamp: new Date().toLocaleString()
  });

  alert(`${card.name} har lämnat tillbaka ${game.title}`);
  showView("scan");
}

// ======== VIKBAR SIDOMENY ========
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');

  sidebar.classList.toggle('hidden');
  content.classList.toggle('sidebar-hidden');
}