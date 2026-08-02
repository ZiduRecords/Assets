document.addEventListener("DOMContentLoaded", function () {
  // 1. FOOTER IN DIE SEITE EINFÜGEN
  const footer = document.createElement("footer");
  footer.style.cssText = "margin-top: 40px; padding: 20px; text-align: center; font-size: 13px; opacity: 0.8;";
  footer.innerHTML = `
    <a href="#" id="open-impressum" style="color: inherit; margin-right: 15px; text-decoration: underline;">Legal Notice</a>
    <a href="#" id="open-datenschutz" style="color: inherit; text-decoration: underline;">Privacy Policy</a>
  `;
  document.body.appendChild(footer);

  // 2. MODAL HTML IN DEN BODY INJIZIEREN
  const modalsHTML = `
    <!-- IMPRESSUM MODAL -->
    <div id="modal-impressum" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; overflow-y:auto; padding:20px; box-sizing:border-box;">
      <div style="background:#1e1e1e; color:#fff; max-width:600px; margin:40px auto; padding:25px; border-radius:10px; position:relative; text-align:left; font-family:sans-serif; line-height:1.6;">
        <span id="close-impressum" style="position:absolute; top:15px; right:20px; font-size:24px; cursor:pointer; font-weight:bold;">&times;</span>
        <h2>Legal Notice</h2>
        <p><strong>Information according to § 5 DDG (German Telecommunications-Telemedia Data Protection Act):</strong></p>
        <p>
          Arno Schnelle<br>
          Hoher Weg 4<br>
          61381 Friedrichsdorf
        </p>
        <p><strong>Contact Information:</strong><br>
          arno.schnelle@proton.me<br>
        </p>
        <p><strong>Responsible for content pursuant to § 18 Abs. 2 MStV:</strong><br>
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
        <h2>Privacy Policy</h2>
        <h3>1. Overview</h3>
        <p>This website processes data to redirect visitors to music platforms and analyze campaign efficiency.</p>
        
        <h3>2. Data Collection (Meta Pixel & Conversions API)</h3>
        <p>If you grant consent via our banner, we use the <strong>Meta Pixel</strong> and <strong>Meta Conversions API (CAPI)</strong> operated by Meta Platforms Ireland Limited. Events (such as clicks on music links), IP addresses, user agent details, and cookie identifiers (e.g., <code>_fbp</code>, <code>_fbc</code>) are transmitted to measure ad performance.</p>
        <p>The legal basis for this processing is your consent pursuant to Art. 6(1)(a) GDPR.</p>
        
        <h3>3. TikTok Pixel</h3>
        <p>Upon your consent, we also utilize the TikTok Pixel to measure button interaction events.</p>
        
        <h3>4. Server Logs / Cloudflare Worker</h3>
        <p>To provide redirects and prevent abuse, request data is routed through Cloudflare Workers (Art. 6(1)(f) GDPR / legitimate interest).</p>
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
