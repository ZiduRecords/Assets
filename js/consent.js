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

/* 1. Nutzer akzeptiert Tracking */
function acceptConsent() {
  window.hasConsent = true;

  const dialog = document.getElementById("consent-dialog");
  if (dialog) dialog.style.display = "none";

  enableButtons();

  // Pixel laden, wenn PIXEL_MODE aktiv ist
  if (typeof PIXEL_MODE !== 'undefined' && PIXEL_MODE) {
    if (typeof META_PIXEL_ID !== 'undefined' && META_PIXEL_ID) loadMetaPixel(META_PIXEL_ID);
    if (typeof TIKTOK_PIXEL_ID !== 'undefined' && TIKTOK_PIXEL_ID) loadTikTokPixel(TIKTOK_PIXEL_ID);
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

/* 3. EU-Geolokalisierungs-Check */
async function checkEU() {
  // Wenn Pixel-Mode generell aus ist: Direkt freischalten
  if (typeof PIXEL_MODE !== 'undefined' && !PIXEL_MODE) {
    window.hasConsent = false;
    enableButtons();
    return;
  }

  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    const euCountries = [
      "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR",
      "HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK",
      "SI","ES","SE"
    ];

    if (euCountries.includes(data.country)) {
      // EU-Bürger: Banner anzeigen
      const dialog = document.getElementById('consent-dialog');
      if (dialog) dialog.style.display = 'block';
    } else {
      // Nicht-EU-Bürger: Automatisch Consent annehmen & Pixel laden
      acceptConsent();
    }
  } catch (e) {
    // Fallback bei Fehler/AdBlocker: Banner zur Sicherheit anzeigen
    const dialog = document.getElementById('consent-dialog');
    if (dialog) dialog.style.display = 'block';
  }
}
