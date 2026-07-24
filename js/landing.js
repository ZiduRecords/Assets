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

  console.log("LogEvent:", line);
}

/* Init */
document.getElementById("song-title").innerText = SONG_TITLE;

const coverImg = document.getElementById("cover-img");
coverImg.src = COVER_IMG;
coverImg.style.width = "260px";

extractColors(COVER_IMG);

const container = document.getElementById("platforms");

const platforms = [
  { logo: "https://zidurecords.github.io/Assets/img/PRESAVELOGO.png",   text: "Presave",    link: PRESAVE_LINK },
  { logo: "https://zidurecords.github.io/Assets/img/SPOTIFYLOGO.png",   text: "Spotify",    link: SPOTIFY_LINK },
  { logo: "https://zidurecords.github.io/Assets/img/APPLELOGO.png",     text: "Apple Music",link: APPLE_LINK },
  { logo: "https://zidurecords.github.io/Assets/img/INSTAGRAMLOGO.png", text: "Instagram",  link: INSTAGRAM_LINK },
  { logo: "https://zidurecords.github.io/Assets/img/TIKTOKLOGO.png",    text: "TikTok",     link: TIKTOK_LINK }
];

platforms.forEach(p => {
  const row = document.createElement("div");
  row.className = "platform-row";

  const logo = document.createElement("img");
  logo.src = p.logo;
  logo.className = "platform-logo";

  const btn = document.createElement("a");
  btn.href = p.link;
  btn.className = `button ${p.text.toLowerCase().replace(" ", "")} disabled`;
  btn.innerText = p.text;

  btn.onclick = function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source') || "organic";
    const medium = urlParams.get('utm_medium') || "";
    const campaign = urlParams.get('utm_campaign') || "";

    sendLogEvent({
      timestamp: new Date().toISOString(),
      song: SONG_TITLE,
      platform: p.text,
      event: p.text.replace(" ", "") + "Click",
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
