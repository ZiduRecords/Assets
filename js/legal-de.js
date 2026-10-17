document.addEventListener("DOMContentLoaded", function () {
  // 1. FOOTER IN DIE SEITE EINFÜGEN (Nur Impressum)
  const footer = document.createElement("footer");
  footer.style.cssText = "margin-top: 40px; padding: 20px; text-align: center; font-size: 13px; opacity: 0.8;";
  footer.innerHTML = `
    <a href="#" id="open-impressum" style="color: inherit; text-decoration: underline;">Impressum</a>
  `;
  document.body.appendChild(footer);

  // 2. MODAL HTML IN DEN BODY INJIZIEREN (Nur Impressum)
  const modalsHTML = `
    <!-- IMPRESSUM MODAL -->
    <div id="modal-impressum" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; overflow-y:auto; padding:20px; box-sizing:border-box;">
      <div style="background:#1e1e1e; color:#fff; max-width:600px; margin:40px auto; padding:25px; border-radius:10px; position:relative; text-align:left; font-family:sans-serif; line-height:1.6;">
        <span id="close-impressum" style="position:absolute; top:15px; right:20px; font-size:24px; cursor:pointer; font-weight:bold;">&times;</span>
        <h2>Impressum</h2>
        <p><strong>Angaben gemäß § 5 DDG:</strong></p>
        <p>
          Arno Schnelle<br>
          Hoher Weg 4<br>
          61381 Friedrichsdorf
        </p>
        <p><strong>Kontakt:</strong><br>
          E-Mail: arno.schnelle@proton.me
        </p>
        <p><strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong><br>
          Arno Schnelle<br>
          Hoher Weg 4<br>
          61381 Friedrichsdorf
        </p>
        <p><em>Hinweis: Kleinunternehmer nach § 19 UStG.</em></p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalsHTML);

  // 3. EVENT LISTENER FÜR DAS MODAL
  const modalImp = document.getElementById("modal-impressum");

  document.getElementById("open-impressum").addEventListener("click", function(e) {
    e.preventDefault();
    modalImp.style.display = "block";
  });

  document.getElementById("close-impressum").addEventListener("click", function() {
    modalImp.style.display = "none";
  });

  window.addEventListener("click", function(e) {
    if (e.target === modalImp) modalImp.style.display = "none";
  });
});
