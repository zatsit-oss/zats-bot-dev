const axios = require("axios");

async function checkUrl(url) {
  const ishttp = /^http:\/\//.test(url);
  if (ishttp) {
    return false;
  }
  url = /^https:\/\//.test(url) ? url : `https://${url}`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.log(
      `Erreur lors de la vérification de l'URL : ${url}`,
      error.message
    );
    return false;
  }
}

module.exports = { checkUrl };
