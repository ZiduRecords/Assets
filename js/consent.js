function acceptConsent() {
  document.getElementById("consent-dialog").style.display = "none";

  document.querySelectorAll(".button").forEach(btn => {
    btn.classList.remove("disabled");
    btn.style.pointerEvents = "auto";
    btn.style.opacity = "1";
  });

  loadMetaPixel(META_PIXEL_ID);
  loadTikTokPixel(TIKTOK_PIXEL_ID);
}

async function checkEU() {
  if (!PIXEL_MODE) {
    document.querySelectorAll(".button").forEach(btn => {
      btn.classList.remove("disabled");
      btn.style.pointerEvents = "auto";
      btn.style.opacity = "1";
    });
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
      document.getElementById('consent-dialog').style.display = 'block';
    } else {
      loadMetaPixel(META_PIXEL_ID);
      loadTikTokPixel(TIKTOK_PIXEL_ID);

      document.querySelectorAll(".button").forEach(btn => {
        btn.classList.remove("disabled");
        btn.style.pointerEvents = "auto";
        btn.style.opacity = "1";
      });
    }
  } catch (e) {
    document.getElementById('consent-dialog').style.display = 'block';
  }
}
