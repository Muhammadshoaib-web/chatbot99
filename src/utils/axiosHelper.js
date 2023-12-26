import axios from "axios";

export async function sendWhatsAppMessage(phoneNoId, form) {
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNoId}/messages?access_token=${process.env.TOKEN}`,
      {
        messaging_product: "whatsapp",
        to: form,
        text: {
          body: "Hello! I am 99 chatbot. How can I help you?",
        },
      }
    );

    console.log("WhatsApp message sent successfully");
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
}
