const express = require("express");
const body_parser = require("body-parser");
// const fetch = require("node-fetch");
const axios = require("axios"); // Import axios
require("dotenv").config();
 
const app = express().use(body_parser.json());
 
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN; //prasath_token
const port = process.env.PORT || 8000;
const templates = {
  hi: "Hi there! How can I assist you today?",
  hello: "Hello! How can I be of service?",
  hey: "Hey! What can I help you with?",
  "need help": "Sure, I'm here to assist you. What do you need?",
  "how are you":
    "I'm just a chatbot, but thanks for asking! How can I assist you?",
  "what's up": "Not much, I'm here to help. How can I assist you?",
  "can you help me": "Of course! Please let me know what you need help with.",
  thanks: "You're welcome! Is there anything else I can help you with?",
  "thank you": "No problem! How else can I assist you?",
  "good morning": "Good morning! What can I do for you today?",
  "good afternoon": "Good afternoon! How can I assist you?",
  "good evening": "Good evening! How can I help you?",
  "how can I contact support":
    "You can reach our support team at hello@99technologies.com",
  "can I ask a question": "Absolutely! Feel free to ask anything you'd like.",
  "what do you do":
    "I'm a chatbot designed to assist and provide information. How can I help you today?",
  "who created you":
    "I was created by developers who wanted to build a helpful chatbot. How can I assist you?",
  "where are you located":
    "I exist in the digital realm, ready to assist you wherever you are!",
  "tell me a joke": "Sure, here's one: Focus on work not waste your time.",
  "do you understand me":
    "Yes, I'm here to understand and help you. How can I assist?",
  "can you explain that":
    "Of course! I'll do my best to explain. What specifically would you like to know?",
  "how do I get started":
    "To get started, you can [mention steps or actions to begin]. Need more help?",
  "I don't understand":
    "No worries! I'll try explaining it differently. What specifically confuses you?",
  "can I change settings":
    "Yes, you can typically change settings in the [settings/options/preferences] menu. Need guidance?",
  "can I speak to a human":
    "Certainly! You can reach a human representative at hello@99technologies.com",
  "what are your capabilities":
    "I'm equipped to assist with various tasks. What do you need help with?",
  "how long have you existed":
    "I've been around for a while, here to help users like you. How can I assist you?",
  "are you a robot":
    "Yes, I'm a chatbot designed to assist users. How can I help you today?",
  "where can I find more information":
    "You can find more information [provide relevant sources/websites]. Need specific details?",
  "why are you here":
    "I'm here to assist and make things easier for users. How can I assist you?",
  "I'm lost":
    "No problem! Let's work together to figure things out. What are you having trouble with?",
  "how do I do this":
    "To do that, you can [mention steps or instructions]. Need more guidance?",
  "can I trust you":
    "Yes, I prioritize privacy and aim to assist. How can I earn your trust?",
  "is this confidential":
    "Yes, your privacy is important. How can I assist you today?",
  "what's your purpose":
    "My purpose is to help users like you. How can I assist you?",
  "where can I find help":
    "You can find assistance at https://www.99technologies.com. Need specific guidance?",
  "I'm sorry": "No need to apologize! How can I assist you today?",
  "are you human":
    "I'm not human, but I'm here to help. What do you need assistance with?",
  "tell me about yourself":
    "I'm a chatbot designed to assist users. How can I assist you today?",
  "can I trust the information you provide":
    "I strive to provide accurate information. Is there something specific you're concerned about?",
  "what languages do you speak":
    "I communicate in the language you're using now. How can I assist you?",
  "can you recommend something":
    "Sure, what kind of thing are you looking for recommendations on?",
  "are you intelligent":
    "I'm programmed to assist and learn from interactions. How can I help you?",
  "how can I improve":
    "Improvement depends on what you're looking to enhance. Can you specify?",
  "can I talk to you": "Absolutely! What would you like to talk about?",
  "can I tell you a secret":
    "Sure, I'm here to listen. Your secret's safe with me!",
  "are you free": "Yes, I'm here and available to help. What do you need?",
  "what's on your mind": "I'm here to assist you. What's on your mind?",
  "can we chat": "Sure thing! What would you like to chat about?",
  "I need advice": "I'm here to offer advice. What do you need guidance on?",
  "what should I do":
    "It depends on the situation. Can you provide more details?",
  "can you do something for me": "Of course! Please let me know what you need.",
  "tell me a story":
    "Once upon a time, there was a chatbot named 99... Just kidding! What kind of story are you looking for?",
  "how do I fix this":
    "To fix that issue, you can contact us with our customer support team at hello@99technologies.com . Need more help?",
  "can I share something with you":
    "Yes, I'm here to listen. What would you like to share?",
  "do you have feelings":
    "I don't have feelings, but I'm here to assist you. How can I help?",
  "what's your favorite thing":
    "I don't have personal preferences, but I'm here to assist you. What can I help you with?",
  "are you real":
    "I'm a real chatbot here to assist you. How can I assist you today?",
  "can I ask you a question":
    "Absolutely! Feel free to ask anything you'd like.",
  // Add more templates as needed
};
 
const templateNames = [
  "hello_world",
  "tesing",
  "testing",
  "new_trends",
  "pc_mart",
  "99tech_video",
  "99tech_workforhome_policy",
  // Add more template names as needed
];
const templatesWithImage = ["new_trends", "pc_mart"];
const templatesWithVideo =["99tech_video",]
const templatesWithDocuments =["99tech_workforhome_policy",]
//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
  console.log("insid eweebhook");
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  console.log(mode, challenge, token);
 
  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});
 
app.post("/webhook", async (req, res) => {
  let body_param = req.body;
 
  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
      let responseText = "";
 
      // Check for matching templates
      const lowerCaseMsgBody = msg_body.toLowerCase();
      const matchedTemplate = templateNames.find((template) =>
        lowerCaseMsgBody.includes(template)
      );
 
      if (matchedTemplate) {
        responseText = matchedTemplate;
        try {
          const shouldIncludeImage = templatesWithImage.includes(responseText);
          const shouldIncludeVideo = templatesWithVideo.includes(responseText);
          const shouldIncludeDocuments = templatesWithDocuments.includes(responseText);
          if (shouldIncludeImage) {
            const response1 = await axios({
              method: "POST",
              url:
                "https://graph.facebook.com/v17.0/" +
                phon_no_id +
                "/messages?access_token=" +
                token,
 
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
                  // Add more components if required
                  components: [
                    {
                      type: "header",
                      parameters: [
                        {
                          type: "image",
                          image: {
                            link: "https://www.shutterstock.com/shutterstock/photos/2111828198/display_1500/stock-photo-digital-technology-software-development-concept-coding-programmer-software-engineer-working-on-2111828198.jpg",
                          },
                        },
                      ],
                    },
                  ],
                },
                text: {
                  body: responseText, // Add the text message here
                },
              },
            });
 
            if (response1.status === 200) {
              res.sendStatus(200);
            } else {
              res.sendStatus(response1.status);
            }
          }
          else if (shouldIncludeVideo) {
            const response1 = await axios({
              method: "POST",
              url:
                "https://graph.facebook.com/v17.0/" +
                phon_no_id +
                "/messages?access_token=" +
                token,
 
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
                  // Add more components if required
                  components: [
                    {
                      type: "header",
                      parameters: [
                        {
                          type: "video",
                          video: {
                            link: "https://www.99technologies.com/assets/videos/99-banner-main-video.mp4",
                          },
                        },
                      ],
                    },
                  ],
                },
                text: {
                  body: responseText, // Add the text message here
                },
              },
            });
 
            if (response1.status === 200) {
              res.sendStatus(200);
            } else {
              res.sendStatus(response1.status);
            }
          }
          else if (shouldIncludeDocuments) {
            const response1 = await axios({
              method: "POST",
              url:
                "https://graph.facebook.com/v17.0/" +
                phon_no_id +
                "/messages?access_token=" +
                token,
 
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
                  // Add more components if required
                  components: [
                    {
                      type: "header",
                      parameters: [
                        {
                          type: "document",
                          document: {
                            link: "https://drive.google.com/file/d/1voQqEneH1D3y85JutWCtJUb0T3_6GKGb/view?usp=sharing",
                          },
                        },
                      ],
                    },
                  ],
                },
                text: {
                  body: responseText, // Add the text message here
                },
              },
            });
 
            if (response1.status === 200) {
              res.sendStatus(200);
            } else {
              res.sendStatus(response1.status);
            }
          }
          else
           {
            const response2 = await axios({
              method: "POST",
              url:
                "https://graph.facebook.com/v17.0/" +
                phon_no_id +
                "/messages?access_token=" +
                token,
 
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
                },
                text: {
                  body: responseText, // Add the text message here
                },
              },
            });
 
            if (response2.status === 200) {
              res.sendStatus(200);
            } else {
              res.sendStatus(response2.status);
            }
          }
        } catch (error) {
          console.error("Error sending message", error);
          res.sendStatus(500);
        }
      }
      else {
        responseText =
          "Sorry, I didn't understand that. Please try asking a different question.";
        // Check for matching templates
        for (const [keyword, template] of Object.entries(templates)) {
          if (msg_body.toLowerCase().includes(keyword)) {
            responseText = template;
            break;
          } else {
            responseText =
              "Sorry, I didn't understand that. Please try asking a different question.";
          }
        }
 
        try {
          const response = await axios({
            method: "POST",
            url:
              "https://graph.facebook.com/v17.0/" +
              phon_no_id +
              "/messages?access_token=" +
              token,
 
            data: {
              messaging_product: "whatsapp",
              to: from,
              text: {
                body: responseText,
              },
            },
 
            headers: {
              "Content-Type": "application/json",
            },
          });
 
          if (response.status === 200) {
            res.sendStatus(200);
          } else {
            res.sendStatus(response.status);
          }
        } catch (error) {
          console.error("Error sending message", error);
          res.sendStatus(500);
        }
      }
    } else {
      res.sendStatus(404);
    }
  }
});
 
app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});
app.listen(port, () => {
  console.log("webhook is listening", port);
});