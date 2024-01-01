import axios from "axios";
import {
  templatesWithSimpleText,
  templatesWithImage,
  templatesWithVideo,
  templatesWithDocuments,
  templatesWithVariables,
} from "../templates/template.js";

// Function to send a message using axios
const sendMessage = async (
  phoneNoId,
  from,
  responseText,
  shouldIncludeImage,
  shouldIncludeVideo,
  shouldIncludeDocuments,
  shouldIncludeVariables,
  shouldIncludeTemplateWithSimpleText,
  userName
) => {
  try {
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/v17.0/${phoneNoId}/messages?access_token=${process.env.TOKEN}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: from,
        type: "template",
        template: {
          name: responseText,
          language: {
            code: "en_US",
          },
          components: [
            // Modify components based on your requirements
            {
              type: "header",
              parameters: [
                {
                  type: shouldIncludeImage ? "image" : "text",
                  image: shouldIncludeImage
                    ? {
                        link: "https://www.shutterstock.com/shutterstock/photos/2111828198/display_1500/stock-photo-digital-technology-software-development-concept-coding-programmer-software-engineer-working-on-2111828198.jpg",
                      }
                    : undefined,
                  text: shouldIncludeTemplateWithSimpleText
                    ? responseText
                    : undefined,
                },
              ],
            },
          ],
        },
        text: {
          body: shouldIncludeTemplateWithSimpleText ? undefined : responseText,
        },
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error sending message. Status: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Error sending message: ${error.message}`);
  }
};

// Controller for handling GET requests
export const handleWebhookGetController = (req, res) => {
  // Extract parameters from the query string
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  // Check if required parameters are present
  if (mode && token) {
    // Check the mode and token for subscription verification
    if (mode === "subscribe" && token === process.env.MYTOKEN) {
      // Respond with the challenge to complete the subscription
      res.status(200).send(challenge);
    } else {
      // Respond with Forbidden if the mode or token is incorrect
      res.status(403).send("Forbidden");
    }
  } else {
    // Respond with Bad Request if the required parameters are missing
    res.status(400).send("Bad Request");
  }
};

// Controller for handling POST requests
export const handleWebhookPostController = async (req, res) => {
  // Extract the request body
  const bodyParam = req.body;

  // Check if the object property is present in the request body
  if (bodyParam.object) {
    // Check if the required message details are present
    if (
      bodyParam.entry &&
      bodyParam.entry[0].changes &&
      bodyParam.entry[0].changes[0].value.messages &&
      bodyParam.entry[0].changes[0].value.messages[0]
    ) {
      // Extract relevant information from the message
      const phoneNoId =
        bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
      const from = bodyParam.entry[0].changes[0].value.messages[0].from;
      const msgBody = bodyParam.entry[0].changes[0].value.messages[0].text.body;
      let responseText = "";

      // Get the user's name from the webhook event
      const userName =
        bodyParam.entry[0].changes[0].value.contacts[0].profile.name;

      // Check for matching templates
      const lowerCaseMsgBody = msgBody.toLowerCase();
      const matchedTemplate = Object.keys(templates).find((template) =>
        lowerCaseMsgBody.includes(template)
      );

      // Handle the matched template
      if (matchedTemplate) {
        responseText = matchedTemplate;
        try {
          // Determine additional components based on the template
          const shouldIncludeImage = templatesWithImage.includes(responseText);
          const shouldIncludeVideo = templatesWithVideo.includes(responseText);
          const shouldIncludeDocuments =
            templatesWithDocuments.includes(responseText);
          const shouldIncludeVariables =
            templatesWithVariables.includes(responseText);
          const shouldIncludeTemplateWithSimpleText =
            templatesWithSimpleText.includes(responseText);

          // Send the message using the locally defined sendMessage function
          await sendMessage(
            phoneNoId,
            from,
            responseText,
            shouldIncludeImage,
            shouldIncludeVideo,
            shouldIncludeDocuments,
            shouldIncludeVariables,
            shouldIncludeTemplateWithSimpleText,
            userName
          );

          // Respond with a success status
          res.sendStatus(200);
        } catch (error) {
          // Handle errors and respond with a server error status
          console.error("Error sending message", error);
          res.sendStatus(500);
        }
      } else {
        // Handle the case when no matching template is found
        responseText =
          "I'm sorry, I couldn't comprehend your query. Could you please rephrase or ask a different question?";

        try {
          // Send a default response using the locally defined sendMessage function
          await sendMessage(
            phoneNoId,
            from,
            responseText,
            false,
            shouldIncludeVideo, // Include the missing parameters here
            shouldIncludeDocuments,
            shouldIncludeVariables,
            true, // Include the missing parameter here
            userName
          );
          // Respond with a success status
          res.sendStatus(200);
        } catch (error) {
          // Handle errors and respond with a server error status
          console.error("Error sending message", error);
          res.sendStatus(500);
        }
      }
    } else {
      // Respond with a not found status if message details are missing
      res.sendStatus(404);
    }
  } else {
    // Respond with a bad request status if the object property is missing
    res.sendStatus(400);
  }
};
