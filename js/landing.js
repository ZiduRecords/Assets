/* Logging-Hook (Proxy später nötig) */
function sendLogEvent(eventObj) {
  const line = [
    eventObj.timestamp,
    eventObj.song,
    eventObj.platform,
    eventObj.event,
    eventObj.source,
    eventObj.medium,
    eventObj.campaign,
    eventObj.destination
  ].join(";");

  fetch("https://log-proxy.esha2025x1.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ line })
  });

}

/* Init */
document.getElementById("song-title").innerText = SONG_TITLE;

const coverImg = document.getElementById("cover-img");
coverImg.src = COVER_IMG;
coverImg.style.width = COVER_SIZE + "px";

extractColors(COVER_IMG);

const container = document.getElementById("platforms");

const platforms = [
  { logo: "https://zidurecords.github.io/Assets/img/SPOTIFYLOGO.png",   text: "Spotify",     link: SPOTIFY_LINK,    show: SHOW_SPOTIFY },
  { logo: "https://zidurecords.github.io/Assets/img/APPLELOGO.png",     text: "Apple Music", link: APPLE_LINK,      show: SHOW_APPLE },
  { logo: "https://zidurecords.github.io/Assets/img/INSTAGRAMLOGO.png", text: "Instagram",   link: INSTAGRAM_LINK,  show: SHOW_INSTAGRAM },
  { logo: "https://zidurecords.github.io/Assets/img/TIKTOKLOGO.png",    text: "TikTok",      link: TIKTOK_LINK,     show: SHOW_TIKTOK }
  { logo: "https://zidurecords.github.io/Assets/img/PRESAVELOGO.png",   text: "Presave",     link: PRESAVE_LINK,    show: SHOW_PRESAVE },
];


platforms.forEach(p => {

  // Sichtbarkeit prüfen
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
  btn.className = `button ${cls} disabled`;
  btn.style.fontSize = BUTTON_SIZE + "px";
  btn.innerText = p.text;

btn.onclick = function(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('utm_source') || "organic";
  const medium = urlParams.get('utm_medium') || "";
  const campaign = urlParams.get('utm_campaign') || "";

  // Name des Events automatisch erzeugen
  const eventName = p.text.replace(/\s+/g, '') + 'Click';  
  // Spotify → SpotifyClick
  // Apple Music → AppleMusicClick
  // Instagram → InstagramClick
  // TikTok → TikTokClick
  // Presave → PresaveClick

  /* META EVENTS */
  fbq('track', 'OutboundClick');
  fbq('track', eventName);

  /* TIKTOK EVENTS */
  ttq.track('ClickButton', {
    button_name: p.text,
    destination: p.link
  });

  /* Logging to Worker */
  sendLogEvent({
    timestamp: new Date().toISOString(),
    song: SONG_TITLE,
    platform: p.text,
    event: eventName,
    source,
    medium,
    campaign,
    destination: p.link
  });

  /* Delay so Pixel can send events */
  setTimeout(() => {
    window.location.href = p.link;
  }, 180);
};



  row.appendChild(logo);
  row.appendChild(btn);
  container.appendChild(row);
});

checkEU();
