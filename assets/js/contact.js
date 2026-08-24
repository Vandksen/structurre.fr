/* Structurre — envoi du formulaire de contact sans rechargement de page.
 *
 * ┌───────────────────────────────────────────────────────────────────┐
 * │ CONFIGURATION — une seule ligne à changer                        │
 * └───────────────────────────────────────────────────────────────────┘
 * Option A (par défaut) — WEB3FORMS : créez une clé gratuite sur
 *   https://web3forms.com (aucun compte : la clé arrive par e-mail),
 *   puis collez-la dans ENDPOINT ci-dessous via ACCESS_KEY.
 *
 * Option B — FORMSPREE : créez un formulaire sur https://formspree.io,
 *   récupérez l'URL https://formspree.io/f/xxxxxxxx et remplacez
 *   PROVIDER par "formspree" + ENDPOINT par cette URL.
 */
(function () {
  "use strict";

  var PROVIDER = "web3forms"; // "web3forms" | "formspree"
  var ACCESS_KEY = "VOTRE_CLE_WEB3FORMS"; // ← à remplacer (Web3Forms)
  var ENDPOINT =
    PROVIDER === "formspree"
      ? "https://formspree.io/f/VOTRE_ID_FORMSPREE" // ← à remplacer (Formspree)
      : "https://api.web3forms.com/submit";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector("[data-form-status]");
  var submit = form.querySelector("[data-form-submit]");
  var submitLabel = submit ? submit.textContent : "";

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className =
      "mt-4 rounded-lg border px-4 py-3 text-sm " +
      (type === "error"
        ? "border-red-200 bg-red-50 text-red-800"
        : type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-slate-200 bg-slate-50 text-slate-700");
    status.hidden = false;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    // Pot de miel : si rempli, c'est un robot — on fait semblant d'accepter.
    var honey = form.querySelector('input[name="botcheck"]');
    if (honey && honey.value) {
      setStatus("Merci, votre message a bien été envoyé.", "success");
      form.reset();
      return;
    }

    if (ACCESS_KEY.indexOf("VOTRE_") === 0 && PROVIDER === "web3forms") {
      setStatus(
        "Formulaire non configuré : ajoutez votre clé Web3Forms dans assets/js/contact.js.",
        "error"
      );
      return;
    }

    var data = new FormData(form);
    if (PROVIDER === "web3forms") {
      data.append("access_key", ACCESS_KEY);
      data.append("subject", "Nouveau message depuis structurre.fr");
      data.append("from_name", "Site structurre.fr");
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Envoi en cours…";
    }
    setStatus("Envoi de votre message…", "info");

    fetch(ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (json) {
          return { ok: response.ok, json: json };
        });
      })
      .then(function (result) {
        var ok = result.ok && result.json.success !== false && !result.json.errors;
        if (!ok) throw new Error(result.json.message || "Échec de l'envoi");
        form.reset();
        setStatus(
          "Merci, votre message a bien été envoyé. Nous revenons vers vous sous 48 h ouvrées.",
          "success"
        );
      })
      .catch(function (error) {
        console.error(error);
        setStatus(
          "L'envoi a échoué. Réessayez ou écrivez-nous directement à contact@structurre.fr.",
          "error"
        );
      })
      .finally(function () {
        if (submit) {
          submit.disabled = false;
          submit.textContent = submitLabel;
        }
      });
  });
})();
