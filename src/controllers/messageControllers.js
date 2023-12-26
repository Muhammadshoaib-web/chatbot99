import { sendWhatsAppMessage } from "../utils/axiosHelper.js";
import { isValidWebhookPayload } from "../utils/helpers.js";

export async function handleVerification(req, res) {
  const mode = req.query("hub.mode");
  const challenge = req.query("hub.challenge");
  const verifyToken = req.query("hub.verify_token");

  if (mode && verifyToken) {
    if (mode === "subscribe" && verifyToken === process.env.MYTOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send("Forbidden");
    }
  } else {
    res.status(400).send("Bad Request");
  }
}

export async function handleWebhookPost(req, res) {
  const bodyParam = req.body;
  console.log(JSON.stringify(bodyParam, null, 2));

  if (bodyParam.object && isValidWebhookPayload(bodyParam)) {
    const phoneNoId =
      bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
    const form = bodyParam.entry[0].changes[0].value.messages[0].form;

    try {
      await sendWhatsAppMessage(phoneNoId, form);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
}
