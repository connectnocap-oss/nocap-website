// Google Analytics 4 for itsnocap.com. Loads nothing until GA_ID is set.
// Conversion events (sent from the site): generate_lead, click_whatsapp, click_phone, click_email.
(function () {
  var GA_ID = ""; // e.g. "G-XXXXXXXXXX"
  if (!GA_ID || /^(localhost|127\.)/.test(location.hostname)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
  document.head.appendChild(s);

  // Static pages (about/contact/...): track contact-link clicks without extra code.
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.closest("#root")) return; // the React app tracks its own clicks
    var h = a.getAttribute("href") || "";
    var ev = h.indexOf("wa.me") > -1 ? "click_whatsapp" : h.indexOf("tel:") === 0 ? "click_phone" : h.indexOf("mailto:") === 0 ? "click_email" : null;
    if (ev) window.gtag("event", ev, { location: location.pathname });
  });
})();
