const { addLink } = require("./controllers/add-link.controller");
const { paramsValidator } = require("./utils/params.validator");

const commandes = ["/addLink"];

exports.handler = async (req, res) => {
  const paramsIsValid = paramsValidator(req.body);
  if (!paramsIsValid) {
    return res.json({
      text: "❌ Requête invalide. Veuillez vérifier les données envoyées.",
    });
  }

  const messages = req.body.message.text.split(" ");
  const [commande] = messages;

  if (!commandes.includes(commande)) {
    return res.json({
      text: "❌ commande non reconnu",
    });
  }

  let result;

  switch (commande) {
    case "/addLink":
      result = await addLink(req.body);
      break;
    default:
      break;
  }

  return res.json(result);
};
