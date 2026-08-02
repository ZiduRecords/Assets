document.addEventListener("DOMContentLoaded", function () {
  // 1. FOOTER IN DIE SEITE EINFÜGEN
  const footer = document.createElement("footer");
  footer.style.cssText = "margin-top: 40px; padding: 20px; text-align: center; font-size: 13px; opacity: 0.8;";
  footer.innerHTML = `
    <a href="#" id="open-impressum" style="color: inherit; margin-right: 15px; text-decoration: underline;">Impressum</a>
    <a href="#" id="open-datenschutz" style="color: inherit; text-decoration: underline;">Datenschutzerklärung</a>
  `;
  document.body.appendChild(footer);

  // 2. MODAL HTML IN DEN BODY INJIZIEREN
  const modalsHTML = `
    <!-- IMPRESSUM MODAL -->
    <div id="modal-impressum" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; overflow-y:auto; padding:20px; box-sizing:border-box;">
      <div style="background:#1e1e1e; color:#fff; max-width:600px; margin:40px auto; padding:25px; border-radius:10px; position:relative; text-align:left; font-family:sans-serif; line-height:1.6;">
        <span id="close-impressum" style="position:absolute; top:15px; right:20px; font-size:24px; cursor:pointer; font-weight:bold;">&times;</span>
        <h2 style="margin-top:0;">Impressum</h2>
        <p><strong>Angaben gemäß § 5 DDG:</strong></p>
        <p>
          Arno Schnelle<br>
          Hoher Weg 4<br>
          61381 Friedrichsdorf
        </p>
        <p><strong>Kontakt:</strong><br>
          arno.schnelle@proton.me<br>
        </p>
        <p><strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong><br>
          Arno Schnelle<br>
          Hoher Weg 4<br>
          61381 Friedrichsdorf
        </p>
      </div>
    </div>

    <!-- DATENSCHUTZ MODAL -->
    <div id="modal-datenschutz" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; overflow-y:auto; padding:20px; box-sizing:border-box;">
      <div style="background:#1e1e1e; color:#fff; max-width:600px; margin:40px auto; padding:25px; border-radius:10px; position:relative; text-align:left; font-family:sans-serif; line-height:1.5; font-size:14px;">
        <span id="close-datenschutz" style="position:absolute; top:15px; right:20px; font-size:24px; cursor:pointer; font-weight:bold;">&times;</span>
        <h2 style="margin-top:0;">Datenschutzerklärung</h2>
        <h3>1. Datenschutz auf einen Blick</h3>
        <p>Diese Website erfasst Daten zur Weiterleitung auf Musikplattformen.</p>
        <h3>2. Erfassung von Daten (Meta Pixel & Conversions API)</h3>
        <p>Sofern Sie über unser Consent-Banner zugestimmt haben, nutzen wir den <strong>Meta Pixel</strong> sowie die <strong>Meta Conversions API (CAPI)</strong> der Meta Platforms Ireland Limited. Dabei werden Ereignisse (wie Klicks auf Musik-Links), IP-Adresse, User-Agent sowie Cookie-Kennungen (z. B. <code>_fbp</code>, <code>_fbc</code>) serverseitig übermittelt.</p>
        <p>Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.</p>
        <h3>3. TikTok Pixel</h3>
        <p>Bei erteilter Einwilligung nutzen wir Zudem den TikTok Pixel zur Messung von Klick-Events.</p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalsHTML);

  // 3. EVENT LISTENER FÜR DIE MODALS
  const modalImp = document.getElementById("modal-impressum");
  const modalDat = document.getElementById("modal-datenschutz");

  document.getElementById("open-impressum").addEventListener("click", function(e) {
    e.preventDefault();
    modalImp.style.display = "block";
  });

  document.getElementById("open-datenschutz").addEventListener("click", function(e) {
    e.preventDefault();
    modalDat.style.display = "block";
  });

  document.getElementById("close-impressum").addEventListener("click", function() {
    modalImp.style.display = "none";
  });

  document.getElementById("close-datenschutz").addEventListener("click", function() {
    modalDat.style.display = "none";
  });

  window.addEventListener("click", function(e) {
    if (e.target === modalImp) modalImp.style.display = "none";
    if (e.target === modalDat) modalDat.style.display = "none";
  });
});
