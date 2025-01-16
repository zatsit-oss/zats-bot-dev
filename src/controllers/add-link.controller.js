const { saveLinkToSheet } = require("../services/google-sheet.service");
const { checkUrl } = require("../services/url.service");

async function addLink(params) {
  const message = params.message.text;
  const user = params.message.sender.displayName;

  const messages = message.split(" ");
  const [commande, extractedLink, ...labels] = messages;
  const label = labels.join(" ");

  if (commande !== "/addLink") {
    return {
      text: "❌ Utilisez la commande /addLink pour enregistrer un lien.",
    };
  }
  if (!extractedLink || !label) {
    return { text: "🚨 Utilisation : /addLink [URL] [label] " };
  }

  const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([\/\w .-]*)*\/?$/i;
  if (!urlRegex.test(extractedLink)) {
    return {
      text: ` ❌ URL invalide: ${extractedLink}, utilisation : /addLink [URL] [label]`,
    };
  }

  const isUrlValid = await checkUrl(extractedLink);
  if (!isUrlValid) {
    return { text: "L'URL est injoignable ou retourne une erreur" };
  }

  const resutl = await saveLinkToSheet(extractedLink, user, label);
  const text =
    resutl === null
      ? `🚨 Lien déjà présent`
      : `✅ Lien ajouté avec succès : ${extractedLink}`;

  return { text };
}

module.exports = { addLink };
