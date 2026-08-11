/* Globaler Status für die Einwilligung */
window.hasConsent = false;

/* Funktion: Klick-Buttons für den Nutzer freischalten */
function enableButtons() {
  document.querySelectorAll(".button").forEach(btn => {
    btn.classList.remove("disabled");
    btn.style.pointerEvents = "auto";
    btn.style.opacity = "1";
  });
}

/* Erstellt den Consent-Dialog im HTML-DOM, falls er noch nicht existiert */
function injectConsentDialog() {
  if (document.getElementById("consent-dialog")) return;

  const dialogHTML = `
    <div id="consent-dialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.75); z-index: 99999; backdrop-filter: blur(5px);">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1e1e1e; color: #ffffff; padding: 25px 30px; border-radius: 12px; width: 90%; max-width: 420px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: sans-serif;">
        <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 18px; font-weight: 600;">Privacy Settings</h3>
        <p style="font-size: 13px; line-height: 1.5; color: #ccc; margin-bottom: 20px;">
          We use cookies and tracking technologies (Meta, TikTok) to analyze the use of our links.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button onclick="acceptConsent()" style="flex: 1; padding: 10px 16px; background-color: #1db954; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">Accept</button>
          <button onclick="declineConsent()" style="flex: 1; padding: 10px 16px; background-color: #444; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">Decline</button>
        </div>
      </div>
    </div>
  `;

  // Stellt sicher, dass document.body bereits bereitsteht
  if (document.body) {
    document.body.insertAdjacentHTML("beforeend", dialogHTML);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.insertAdjacentHTML("beforeend", dialogHTML);
    });
  }
}

/* 1. Nutzer akzeptiert Tracking */
function acceptConsent() {
  window.hasConsent = true;

  const dialog = document.getElementById("consent-dialog");
  if (dialog) dialog.style.display = "none";

  enableButtons();

  // Pixel laden, wenn PIXEL_MODE aktiv ist und Ladefunktionen existieren
  if (typeof PIXEL_MODE !== 'undefined' && PIXEL_MODE) {
    if (typeof META_PIXEL_ID !== 'undefined' && META_PIXEL_ID && typeof loadMetaPixel === 'function') {
      loadMetaPixel(META_PIXEL_ID);
    }
    if (typeof TIKTOK_PIXEL_ID !== 'undefined' && TIKTOK_PIXEL_ID && typeof loadTikTokPixel === 'function') {
      loadTikTokPixel(TIKTOK_PIXEL_ID);
    }
  }
}

/* 2. Nutzer lehnt Tracking ab */
function declineConsent() {
  window.hasConsent = false;

  const dialog = document.getElementById("consent-dialog");
  if (dialog) dialog.style.display = "none";

  // Schaltet die Klick-Buttons frei, ohne Pixel zu laden
  enableButtons();
}

/* Globale Variablen für das Logging initialisieren */
window.userCountry = "UNKNOWN";
window.isEU = false;

/* 3. EU-Geolokalisierungs-Check mit Fallback-Anbieter */
async function checkEU() {
  if (typeof PIXEL_MODE !== 'undefined' && !PIXEL_MODE) {
    window.hasConsent = false;
    enableButtons();
    return;
  }

  const euCountries = [
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR",
    "HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK",
    "SI","ES","SE"
  ];

  // Kleine Helper-Funktion mit Timeout, damit ein hängender Request
  // die Seite nicht lange blockiert (max. 3 Sekunden pro Anbieter)
  async function fetchWithTimeout(url, ms = 3000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, { signal: controller.signal });
      return await res.json();
    } finally {
      clearTimeout(id);
    }
  }

  let data = null;

  // 1. Versuch: ipwho.is
  try {
    const d = await fetchWithTimeout("https://ipwho.is/");
    if (d && d.success) data = { country: d.country_code, isEU: d.is_eu };
  } catch (e) { /* weiter zum Fallback */ }

  // 2. Versuch: Fallback-Anbieter, falls ipwho.is fehlschlägt
  if (!data) {
    try {
      const d = await fetchWithTimeout("https://ipapi.co/json/");
      if (d && d.country_code) {
        data = { country: d.country_code, isEU: euCountries.includes(d.country_code) };
      }
    } catch (e) { /* beide fehlgeschlagen */ }
  }

  if (data) {
    window.userCountry = data.country || "UNKNOWN";
    window.isEU = !!data.isEU || euCountries.includes(window.userCountry);
  } else {
    // Beide Anbieter fehlgeschlagen: sicherheitshalber EU annehmen
    window.userCountry = "UNKNOWN";
    window.isEU = true;
  }

  if (window.isEU) {
    injectConsentDialog();
    const dialog = document.getElementById('consent-dialog');
    if (dialog) dialog.style.display = 'block';
  } else {
    acceptConsent();
  }
}

/* Automatisch beim Laden der Seite ausführen */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkEU);
} else {
  checkEU();
}
