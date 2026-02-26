// ======== FIREBASE ========
const firebaseConfig = {
  apiKey: "AIzaSyCzeXAjl3OCpwWdjB7WGvtbEM2WPN9fzXQ",
  authDomain: "lanesystem-f6016.firebaseapp.com",
  projectId: "lanesystem-f6016",
  storageBucket: "lanesystem-f6016.appspot.com",
  messagingSenderId: "448843925064",
  appId: "1:448843925064:web:489c79f301772d83cb3a7d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ======== GLOBAL ========
let qrScanner;

// ======== PERSONER ========
const cardsData = [
  { cardId: "LK-01", name: "Adam" },
  { cardId: "LK-02", name: "Aditya" },
  { cardId: "LK-03", name: "Aleksandar" },
  { cardId: "LK-04", name: "Alice" },
  { cardId: "LK-05", name: "Alicia-RM" },
  { cardId: "LK-06", name: "Alicia-P" },
  { cardId: "LK-07", name: "Anlin" },
  { cardId: "LK-08", name: "Anton" },
  { cardId: "LK-09", name: "Arvin" },
  { cardId: "LK-10", name: "August" },
  { cardId: "LK-11", name: "Baran" },
  { cardId: "LK-12", name: "Bella" },
  { cardId: "LK-13", name: "Danielle" },
  { cardId: "LK-14", name: "Ellinor" },
  { cardId: "LK-15", name: "Ema" },
  { cardId: "LK-16", name: "Emilia" },
  { cardId: "LK-17", name: "Emilija" },
  { cardId: "LK-18", name: "Emma" },
  { cardId: "LK-19", name: "Freja" },
  { cardId: "LK-20", name: "Greta" },
  { cardId: "LK-21", name: "Harry" },
  { cardId: "LK-22", name: "Hildana" },
  { cardId: "LK-23", name: "Jonathan" },
  { cardId: "LK-24", name: "Justina" },
  { cardId: "LK-25", name: "Kai" },
  { cardId: "LK-26", name: "Leia" },
  { cardId: "LK-27", name: "Leo" },
  { cardId: "LK-28", name: "Leonie" },
  { cardId: "LK-29", name: "Lillian" },
  { cardId: "LK-30", name: "Lou" },
  { cardId: "LK-31", name: "Louise" },
  { cardId: "LK-32", name: "Lovis" },
  { cardId: "LK-33", name: "Lydia" },
  { cardId: "LK-34", name: "Mateo" },
  { cardId: "LK-35", name: "Matvei" },
  { cardId: "LK-36", name: "Maxine" },
  { cardId: "LK-37", name: "Minou" },
  { cardId: "LK-38", name: "Noa" },
  { cardId: "LK-39", name: "Noah-V" },
  { cardId: "LK-40", name: "Noelia" },
  { cardId: "LK-41", name: "Nora" },
  { cardId: "LK-42", name: "Penny" },
  { cardId: "LK-43", name: "Mia" },
  { cardId: "LK-44", name: "Sveva" },
  { cardId: "LK-45", name: "Tage" },
  { cardId: "LK-46", name: "Talya" },
  { cardId: "LK-47", name: "Theo" },
  { cardId: "LK-48", name: "Vaani" },
  { cardId: "LK-49", name: "Viggo" },
  { cardId: "LK-50", name: "Yohan" },
  { cardId: "LK-51", name: "Jhanvi" }
];

// ======== SPEL ========
const gamesData = [
  { gameId: "kalleha", title: "Kalleha" },
  { gameId: "tre_i_rad_1", title: "Tre i rad (1)" },
  { gameId: "tre_i_rad_2", title: "Tre i rad (2)" },
  { gameId: "tre_i_rad_3", title: "Tre i rad (3)" },
  { gameId: "fyra_i_rad_1", title: "Fyra i rad (1)" },
  { gameId: "fyra_i_rad_2", title: "Fyra i rad (2)" },
  { gameId: "fia_med_knuff", title: "Fia med knuff" },
  { gameId: "alphaphet", title: "Alphaphet" },
  { gameId: "skipo", title: "Skipo" },
  { gameId: "kortlek_1", title: "Kortlek (1)" },
  { gameId: "kortlek_2", title: "Kortlek (2)" },
  { gameId: "rush_hour_1", title: "Rush Hour (1)" },
  { gameId: "rush_hour_2", title: "Rush Hour (2)" },
  { gameId: "rush_hour_3", title: "Rush Hour (3)" },
  { gameId: "vemdar", title: "Vem där" },
  { gameId: "othello", title: "Othello" },
  { gameId: "twister", title: "Twister" },
  { gameId: "shut_the_box", title: "Shut the box" },
  { gameId: "lusen", title: "Lusen" },
  { gameId: "skipbo", title: "Skipbo" },
  { gameId: "uno", title: "Uno" },
  { gameId: "rattfallan", title: "Råttfällan" },
  { gameId: "kortlek", title: "Kortlek" }
];

// ======== INIT DATA ========
async function initData() {
  for (const c of cardsData) {
    await db.collection("cards").doc(c.cardId).set(
      { name: c.name },
      { merge: true }
    );
  }
  for (const g of gamesData) {
    await db.collection("games").doc(g.gameId).set(
      { title: g.title, isLoaned: false },
      { merge: true }
    );
  }
}
initData();

// ======== VIEWS ========
async function showView(view) {
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
    const snap = await db.collection("activeLoans").get();
    let html = "<h2>Aktiva lån</h2><ul>";
    snap.forEach(d => {
      const l = d.data();
      html += `<li>${l.name} – ${l.gameTitle}</li>`;
    });
    html += "</ul>";
    container.innerHTML = html;
  }

  if (view === "cards") {
    const snap = await db.collection("cards").get();
    let html = "<h2>Lånekort</h2><ul>";
    snap.forEach(d => {
      html += `<li>${d.data().name} (${d.id})</li>`;
    });
    html += "</ul>";
    container.innerHTML = html;
  }

  if (view === "games") {
    const snap = await db.collection("games").get();
    let html = "<h2>Spel</h2><ul>";
    snap.forEach(d => {
      html += `<li>${d.data().title} – ${d.data().isLoaned ? "Utlånad" : "Ledig"}</li>`;
    });
    html += "</ul>";
    container.innerHTML = html;
  }

  if (view === "history") {
    const snap = await db.collection("history").orderBy("timestamp", "desc").get();
    let html = "<h2>Historik</h2><ul>";
    snap.forEach(d => {
      const h = d.data();
      html += `<li>${h.name} ${h.action === "loan" ? "lånade" : "lämnade"} ${h.gameTitle}</li>`;
    });
    html += "</ul>";
    container.innerHTML = html;
  }
}

// ======== SCANNER ========
function startScanner() {
  if (qrScanner) qrScanner.stop().catch(() => {});
  qrScanner = new Html5Qrcode("reader");
  qrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    msg => handleCardScan(msg),
    () => {}
  );
}

// ======== CARD ========
async function handleCardScan(cardId) {
  const doc = await db.collection("cards").doc(cardId).get();
  if (!doc.exists) {
    alert("Kort finns inte");
    return;
  }

  document.getElementById("view").innerHTML = `
    <h2>${doc.data().name}</h2>
    <button onclick="showBorrow('${cardId}')">Låna spel</button>
    <button onclick="showReturn('${cardId}')">Lämna tillbaka</button>
  `;
}

// ======== BORROW ========
async function showBorrow(cardId) {
  const loan = await db.collection("activeLoans").doc(cardId).get();
  if (loan.exists) {
    alert("Du har redan ett lån");
    showView("scan");
    return;
  }

  const games = await db.collection("games").where("isLoaned", "==", false).get();
  let html = "<h2>Välj spel</h2><ul>";
  games.forEach(g => {
    html += `<li>${g.data().title}
      <button onclick="borrowGame('${cardId}','${g.id}','${g.data().title}')">Låna</button>
    </li>`;
  });
  html += "</ul>";
  document.getElementById("view").innerHTML = html;
}

async function borrowGame(cardId, gameId, gameTitle) {
  await db.collection("games").doc(gameId).update({ isLoaned: true });

  const name = (await db.collection("cards").doc(cardId).get()).data().name;

  await db.collection("activeLoans").doc(cardId).set({
    cardId,
    gameId,
    gameTitle,
    name,
    loanedAt: new Date().toLocaleString()
  });

  await db.collection("history").add({
    cardId,
    gameId,
    gameTitle,
    name,
    action: "loan",
    timestamp: firebase.firestore.Timestamp.now()
  });

  alert(`${name} lånade ${gameTitle}`);
  showView("scan");
}

// ======== RETURN ========
async function showReturn(cardId) {
  const loan = await db.collection("activeLoans").doc(cardId).get();
  if (!loan.exists) {
    alert("Inget aktivt lån");
    showView("scan");
    return;
  }

  const l = loan.data();
  document.getElementById("view").innerHTML = `
    <h2>Lämna tillbaka ${l.gameTitle}?</h2>
    <button onclick="returnGame('${cardId}','${l.gameId}','${l.gameTitle}')">Ja</button>
  `;
}

async function returnGame(cardId, gameId, gameTitle) {
  await db.collection("games").doc(gameId).update({ isLoaned: false });
  await db.collection("activeLoans").doc(cardId).delete();

  const name = (await db.collection("cards").doc(cardId).get()).data().name;

  await db.collection("history").add({
    cardId,
    gameId,
    gameTitle,
    name,
    action: "return",
    timestamp: firebase.firestore.Timestamp.now()
  });

  alert(`${name} lämnade tillbaka ${gameTitle}`);
  showView("scan");
}

// ======== SIDOMENY ========
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("hidden");
}
