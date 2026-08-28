// --- OS-Erkennung direkt im Browser ---
function detectOS() {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac os|macintosh/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/windows/i.test(ua)) return "Windows";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown";
}

const currentOS = detectOS();
const isAppleDevice = (currentOS === "iOS" || currentOS === "macOS");

function sendLogEvent(eventObj) {
  // Datum (YYYY-MM-DD) und Stunde (0-23) aus dem ISO-Timestamp extrahieren
  const eventDate = new Date(eventObj.timestamp);
  const dateOnly = eventObj.timestamp.split("T")[0];         // z.B. "2026-08-06"
  const hourOnly = eventDate.getUTCHours();                   // z.B. 1 (für 01 Uhr UTC)

  // 1. CSV-Zeile für dein GitHub-Log erstellen (inkl. OS am Ende)
  const line = [
    eventObj.timestamp,
    eventObj.song,
    eventObj.platform,
    eventObj.event,
    eventObj.source,
    eventObj.medium,
    eventObj.campaign,
    eventObj.destination,
    window.userCountry || "UNKNOWN",
    window.isEU ? "YES" : "NO",
    window.hasConsent ? "TRUE" : "FALSE",
    dateOnly,
    hourOnly,
    currentOS // <--- Das erkannte OS wird hier direkt für die CSV mitgeliefert
  ].join(";");

  // 2. An Cloudflare Worker senden
  fetch("https://worker.uyimbaya.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      line: line,
      event_id: eventObj.event_id,
      pixel_id: (typeof META_PIXEL_ID !== 'undefined') ? META_PIXEL_ID : ((typeof PIXEL_ID !== 'undefined') ? PIXEL_ID : null),
      pixel_mode: (typeof PIXEL_MODE !== 'undefined' && PIXEL_MODE) ? window.hasConsent : false,
      timestamp: eventObj.timestamp,
      song: eventObj.song,
      platform: eventObj.platform,
      event: eventObj.event,
      source: eventObj.source,
      medium: eventObj.medium,
      campaign: eventObj.campaign,
      destination: eventObj.destination,
      url: window.location.href,
      fbp: (typeof getCookie === 'function') ? getCookie('_fbp') : null,
      fbc: (typeof getCookie === 'function') ? getCookie('_fbc') : null,
      country: window.userCountry || "UNKNOWN",
      is_eu: window.isEU ? "YES" : "NO",
      consent: window.hasConsent ? "TRUE" : "FALSE",
      date: dateOnly,
      hour: hourOnly,
      os: currentOS
    })
  }).catch(err => console.error("Worker Log Error:", err));
}

/* Init */
document.getElementById("song-title").innerText = SONG_TITLE;

const descEl = document.getElementById("album-description");
if (descEl && typeof ALBUM_DESCRIPTION !== "undefined" && ALBUM_DESCRIPTION) {
  descEl.textContent = ALBUM_DESCRIPTION;
}

const coverImg = document.getElementById("cover-img");
coverImg.src = COVER_IMG;
coverImg.style.width = COVER_SIZE + "px";

extractColors(COVER_IMG);

const container = document.getElementById("platforms");

/* Plattformen – Hier steuern wir Apple dynamisch über isAppleDevice! */
const platforms = [
  { logo: "https://zidurecords.github.io/Assets/img/PRESAVELOGO.png",    text: "Presave",     link: PRESAVE_LINK,     show: SHOW_PRESAVE },
  { logo: "https://zidurecords.github.io/Assets/img/SPOTIFYLOGO.png",    text: "Spotify",     link: SPOTIFY_LINK,     show: SHOW_SPOTIFY },
  // Apple Music wird nur angezeigt, wenn SHOW_APPLE true ist UND der Nutzer ein Apple-Gerät hat!
  { logo: "https://zidurecords.github.io/Assets/img/APPLELOGO.png",      text: "Apple Music", link: APPLE_LINK,       show: SHOW_APPLE && isAppleDevice },
  { logo: "https://zidurecords.github.io/Assets/img/INSTAGRAMLOGO.png", text: "Instagram",    link: INSTAGRAM_LINK,   show: SHOW_INSTAGRAM },
  { logo: "https://zidurecords.github.io/Assets/img/TIKTOKLOGO.png",     text: "TikTok",      link: TIKTOK_LINK,      show: SHOW_TIKTOK }
];

/* Rendern */
platforms.forEach(p => {

  if (!p.show) return;

  const row = document.createElement("div");
  row.className = "platform-row";

  const logo = document.createElement("img");
  logo.src = p.logo;
  logo.className = "platform-logo";
  logo.style.width = LOGO_SIZE + "px";
  logo.style.height = LOGO_SIZE + "px";

  const btn = document.createElement("a");
  btn.href = p.link;
  const cls = (p.text === "Apple Music") ? "apple" : p.text.toLowerCase().replace(" ", "");
  btn.className = `button ${cls} disabled`;
  btn.style.fontSize = BUTTON_SIZE + "px";
  btn.innerText = p.text;

  btn.onclick = function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source') || "organic";
    const medium = urlParams.get('utm_medium') || "";
    const campaign = urlParams.get('utm_campaign') || "";

    const eventName = p.text.replace(/\s+/g, '') + 'Click';
    const eventId = "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

    if (window.hasConsent && typeof fbq === 'function') {
      fbq('track', 'OutboundClick', {}, { eventID: eventId });
      fbq('track', eventName, {}, { eventID: eventId });
    }
    
    if (window.hasConsent && typeof ttq === 'object') {
      ttq.track('ClickButton', {
        button_name: p.text,
        destination: p.link
      });
    }

    sendLogEvent({
      event_id: eventId,
      timestamp: new Date().toISOString(),
      song: SONG_TITLE,
      platform: p.text,
      event: eventName,
      source,
      medium,
      campaign,
      destination: p.link
    });

    setTimeout(() => {
      window.location.href = p.link;
    }, 180);
  };

     row.appendChild(logo);
     row.appendChild(btn);
     container.appendChild(row);
});

checkEU();
