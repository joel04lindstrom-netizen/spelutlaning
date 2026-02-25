// ======== FIREBASE ========
const firebaseConfig = {
  apiKey: "AIzaSyCzeXAjl3OCpwWdjB7WGvtbEM2WPN9fzXQ",
  authDomain: "lanesystem-f6016.firebaseapp.com",
  projectId: "lanesystem-f6016",
  storageBucket: "lanesystem-f6016.appspot.com",
  messagingSenderId: "448843925064",
  appId: "1:448843925064:web:489c79f301772d83cb3a7d"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ======== GLOBAL VARS ========
let qrScanner;

// ================== INITIAL DATA ==================
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
  { cardId: "LK-51", name: "Jhanvi"}
];

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
  { gameId: "rush hour", title: "Rush hour (1)" },
  { gameId: "rush hour_2", title: "Rush hour (2)" },
  { gameId: "rush hour_3", title: "Rush hour (3)" },
  { gameId: "vemdär", title: "Vem där" },
  { gameId: "othello", title: "Othello" },
  { gameId: "twister", title: "Twister" },
  { gameId: "shut_the_box", title: "Shut the box" },
  { gameId: "lusen", title: "Lusen" },
  { gameId: "skipbo", title: "Skipbo" },
  { gameId: "uno", title: "Uno" },
  { gameId: "rattfällan", title: "Råttfällan" },
  { gameId: "kortlek", title: "Kortlek" }
];

// ================== INIT FIRESTORE ==================
async function initData() {
  for (const c of cardsData) {
    await db.collection("cards").doc(c.cardId).set({
      name: c.name,
      activeLoan: false
    }, { merge: true });
  }
  for (const g of gamesData) {
    await db.collection("games").doc(g.gameId).set({
      title: g.title,
      isLoaned: false
    }, { merge: true });
  }
}
initData();

// ================== APP LOGIC ==================
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
    const loansSnap = await db.collection("activeLoans").get();
    let html = "<h2>Aktiva lån</h2><ul>";
    loansSnap.forEach(doc => {
      const l = doc.data();
      html += `<li>${l.name} har lånat ${l.gameTitle} (${l.loanedAt})</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }

  if (view === "cards") {
    const cardsSnap = await db.collection("cards").get();
    let html = "<h2>Lånekort</h2><ul>";
    cardsSnap.forEach(doc => {
      const c = doc.data();
      html += `<li>${c.name} (${doc.id}) - ${c.activeLoan ? "Har lån" : "Inget lån"}</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }

  if (view === "games") {
    const gamesSnap = await db.collection("games").get();
    let html = "<h2>Spel</h2><ul>";
    gamesSnap.forEach(doc => {
      const g = doc.data();
      html += `<li>${g.title} - ${g.isLoaned ? "Utlånad" : "Tillgänglig"}</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }

  if (view === "history") {
    const histSnap = await db.collection("history").orderBy("timestamp", "desc").get();
    let html = "<h2>Historik</h2><ul>";
    histSnap.forEach(doc => {
      const h = doc.data();
      html += `<li>${h.timestamp.toDate().toLocaleString()}: ${h.name} ${h.action === "loan" ? "lånade" : "lämnade tillbaka"} ${h.gameTitle}</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }

  if (view === "stats") {
    const histSnap = await db.collection("history").get();
    let html = "<h2>Statistik</h2><ul>";
    gamesData.forEach(g => {
      const count = histSnap.docs.filter(h => h.data().gameTitle === g.title && h.data().action === "loan").length;
      html += `<li>${g.title}: ${count} lån totalt</li>`;
    });
    html += "</ul><button onclick='showView(\"scan\")'>Tillbaka</button>";
    container.innerHTML = html;
  }
}

// ================== QR-SCANNER ==================
function startScanner() {
  if (qrScanner) qrScanner.stop().catch(() => {});

  qrScanner = new Html5Qrcode("reader");
  qrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      document.getElementById("scanResult").innerText =
        "Skannad QR-kod: " + qrCodeMessage;
      handleCardScan(qrCodeMessage);
    },
    errorMessage => {}
  );
}

// ================== HANTERA KORT ==================
async function handleCardScan(cardId) {
  const doc = await db.collection("cards").doc(cardId).get();
  if (!doc.exists) {
    alert("Kortet finns inte!");
    return;
  }
  const card = doc.data();
  const container = document.getElementById("view");
  container.innerHTML = `
    <h2>Kort identifierat</h2>
    <p><strong>Kort-ID:</strong> ${cardId}</p>
    <button onclick="showBorrow('${cardId}')">Låna spel</button>
    <button onclick="showReturn('${cardId}')">Lämna tillbaka</button>
  `;
}

// ================== LÅNA SPEL ==================
async function showBorrow(cardId) {
  const cardRef = db.collection("cards").doc(cardId);
  const cardDoc = await cardRef.get();
  const card = cardDoc.data();
  const container = document.getElementById("view");

  if (card.activeLoan) {
    container.innerHTML = `<h2>${card.name} har redan ett lån. Måste lämna tillbaka först.</h2>
                           <button onclick="showView('scan')">Tillbaka</button>`;
    return;
  }

  const gamesSnap = await db.collection("games").where("isLoaned", "==", false).get();
  if (gamesSnap.empty) {
    container.innerHTML = `<h2>Inga spel är tillgängliga just nu</h2>
                           <button onclick="showView('scan')">Tillbaka</button>`;
    return;
  }

  let html = `<h2>Välj spel att låna för ${card.name}</h2><ul>`;
  gamesSnap.forEach(g => {
    html += `<li>${g.data().title} <button onclick="borrowGame('${cardId}','${g.id}','${g.data().title}')">Låna</button></li>`;
  });
  html += "</ul><button onclick='showView(\"scan\")'>Avbryt</button>";
  container.innerHTML = html;
}

async function borrowGame(cardId, gameId, gameTitle) {
  const cardRef = db.collection("cards").doc(cardId);
  const gameRef = db.collection("games").doc(gameId);

  await cardRef.update({ activeLoan: true });
  await gameRef.update({ isLoaned: true });

  await db.collection("activeLoans").doc(cardId).set({
    cardId,
    gameId,
    gameTitle,
    name: (await cardRef.get()).data().name,
    loanedAt: new Date().toLocaleString()
  });

  await db.collection("history").add({
    cardId,
    gameId,
    gameTitle,
    name: (await cardRef.get()).data().name,
    action: "loan",
    timestamp: firebase.firestore.Timestamp.now()
  });

  alert(`Spelet ${gameTitle} har lånats av ${(await cardRef.get()).data().name}`);
  showView("scan");
}

// ================== ÅTERLÄMNA ==================
async function showReturn(cardId) {
  const cardRef = db.collection("cards").doc(cardId);
  const cardDoc = await cardRef.get();
  const card = cardDoc.data();
  const container = document.getElementById("view");

  if (!card.activeLoan) {
    container.innerHTML = `<h2>${card.name} har inga aktiva lån.</h2>
                           <button onclick="showView('scan')">Tillbaka</button>`;
    return;
  }

  const loanDoc = await db.collection("activeLoans").doc(cardId).get();
  const loan = loanDoc.data();

  container.innerHTML = `<h2>Återlämna ${loan.gameTitle} för ${card.name}?</h2>
                         <button onclick="returnGame('${cardId}','${loan.gameId}','${loan.gameTitle}')">Återlämna</button>
                         <button onclick="showView('scan')">Avbryt</button>`;
}

async function returnGame(cardId, gameId, gameTitle) {
  await db.collection("cards").doc(cardId).update({ activeLoan: false });
  await db.collection("games").doc(gameId).update({ isLoaned: false });
  await db.collection("activeLoans").doc(cardId).delete();

  await db.collection("history").add({
    cardId,
    gameId,
    gameTitle,
    name: (await db.collection("cards").doc(cardId).get()).data().name,
    action: "return",
    timestamp: firebase.firestore.Timestamp.now()
  });

  alert(`${(await db.collection("cards").doc(cardId).get()).data().name} har lämnat tillbaka ${gameTitle}`);
  showView("scan");
}

// ================== SIDOMENY ==================
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  sidebar.classList.toggle('hidden');
  content.classList.toggle('sidebar-hidden');
}


