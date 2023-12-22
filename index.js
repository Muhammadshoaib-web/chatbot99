// require('dotenv').config();
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// client.messages
//       .create({
//          from: 'whatsapp:+14155238886',
//          body: 'Hello Awais!',
//          to: 'whatsapp:+923309225386'
//        })
//       .then(message => console.log(message.sid));

import express from 'express'
import bodyParser from 'body-parser';
import {config} from 'dotenv'
import axios from 'axios' 
import twilio from 'twilio';
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

import dialogflow from '@google-cloud/dialogflow';


const app = express();
app.use(bodyParser.json());
app.use(express.json());

config();
// Replace with your project details
const projectId = 'w99techbot-xqhb';
const privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxfgQB94xrNJ2n\nPM4utHLgpBYlx8NVP+/hJD5foRCQCUR4N8jqCH9jEMr0bHPlPj6UR4B1eULTBfGD\nDlUGksM5L1aBEMeiLQm/sRq/8LDI5jQ3C5Bk04gPg8oBLPakoufnwV7K2a4BJGwG\n9BeTDtsui032237piEiAYi7Ert/Yp3dpKl3SrAw218Vrp7j+PlqrUgcPskIkcH1F\n6GDLyCKQ6d3B+xVQdtfojt4oBhTZc+1kriCR8tq4DplmH2fQQ1SwZMFxrfST0y9w\nsDr7xQAIBjo7TxHa41vFosc1Oz3uAnpw9bRDgxb7ph24oAwWrp3eCn2p7/tc7dso\nWQVCNZMtAgMBAAECggEAHYxHQgWSSpGckkgI4hUXz8Z5SmpWXiWR+2bjfFuNrJDi\nZWoSCEYIYPdddjHs3FPPqrM5kzTv9z30zhbPeFPr7KPxEHT46wp45kDnXV9GKvfJ\n5wUFkYd2jfCoaygvWkqldTtHmtkAwv9rfX/awdhWDEpUHR2+48VUnozZ0NP0/3Xg\nrZRGuJuudErX+GqUGdD1Hovd1ZxCDSpnIUytZ7uqzGAbkNbENLfU/cgzK/jMsdiD\nHzj3T9/48t2Ieawi83Nbd2tbCW26Rmes7wL37v9jdI3HA/rfeezirMytQLe8Bbk7\n+tsEo9Oswe2RyXKMl0GWT94wjjD7AyTEuAJY+o7+WQKBgQDWNxHSOn+BxYHJZBrd\n7xYrTYr25IXjg3Cx5OHoxLK6v87i286yULHHGnbY8w+xyreH8ZNms5ueJh7iO5z+\nDiIVTogyvev6u5lW1JQbhCRBJikG6JIJwfQo7Ch62EAwkEXSWPr5bUzENiTezdS4\nEoHCl2tANOWPAU440qnh59RZOQKBgQDUHSw7BWtq3c3DT3v/DMMjWMGv0cXMTuAr\nZsFKquumehW4OJbguHMVMK+Qlf5L3BzsO+ujdUX0GVG5JNoYiPhDc+LezVzXMNhu\nuqya17xILapdHNsFFkTApSH0Vv9jL/bLytRKLVtLhkdiSfyDmbDMw6se39rKxlsC\nsI8voIPNlQKBgQCjoUtGqBKwATujp4jyUGhByajF8Ufow4V5DdoW4PGZv1x8Y+Ue\nxo8WBLwV+ozZhXzuJfUvdTEA/COJMno4gnk8h1F4WSUB0P1Pm3BLGIRNE6YxNcQg\nGfy0qbg+JiPaNMpw5DFKCFikZKuDWf0MYm6mQt3VHNLhiuDCfQDxpBHL2QKBgEug\n5y9YHFerI/1absSegUkuEUkmC1dwXB89cPe1f3YJG4tmqe0P9wB8Lmzn/haAMdPM\n/ZR3cOy6xle0GwsacyJhxGdaY5racKDycC55c0ls9sxiSHlE2lixyCx9hGuSI3XA\nKPcVuvJvuy4BYUZu2wn3TiEhAbrBBJwt5a++lKANAoGBAM7Qc+PDhVSxfYZPp/rc\nNtaRUqFWPm9kgaADsIDUwEHnYQ413UH3f8t83ijS6xy7HsroGsndaSscP6Rp9TVF\n9y9MIlOQ5sSPUTEVJjSi4ktVJgbTK8UvexdXbWPPyMCMTDgFdd61o5q8Q78mZMkQ\n/SWivrjJQLCgOt0UfYWcqUnw\n-----END PRIVATE KEY-----\n'; // Replace with your actual private key
const clientEmail = 'id-9tech@w99techbot-xqhb.iam.gserviceaccount.com';

// config = {
//   credentials: {
//     private_key: privateKey,
//     client_email: clientEmail,
//   },
// };

// Create a Dialogflow session client
const sessionClient = new dialogflow.SessionsClient(config);

// Create a session path with a random session ID
// const sessionPath = sessionClient.projectAgentSessionPath(projectId, generateRandomSessionID());

// Function to generate a random session ID
function generateRandomSessionID() {
  return Math.random().toString(36).substring(7);
}

// Handle incoming messages

const twilioClient = twilio('ACbd383e1378e7c224ca910c9237391359', '79074b7280f6d70c5423a77e0064e682');




// app.post('/webhook', async (req, res) => {
//   const userMessage = req.body.Body;
//   const sessionPath = sessionClient.projectAgentSessionPath(projectId,  generateRandomSessionID());
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: userMessage,
//         languageCode: 'en-US',
//       },
//     },
//   };

//   try {
//     const [response] = await sessionClient.detectIntent(request);
//     const fulfillmentText = response.queryResult.fulfillmentText;

//     const twilioResponse = await twilioClient.messages.create({
//       body: fulfillmentText,
//       from: '+14155238886',
//       to: '+923309225386',
//     });

//     console.log('Response sent via WhatsApp:', twilioResponse.sid);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error processing message:', error);
//     res.sendStatus(500);
//   }
// });


// Rest of your code...

app.listen( process.env.PORT , () => {
  console.log(`webhook is listening on port ${process.env.PORT}`);
});
app.get("/webhook", (req, res) => {
  let mode = req.query("hub.mode");
  let challenge = req.query("hub.challenge");
  let token = req.query("hub.verify_token");

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));
  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let form = body_param.entry[0].changes[0].value.messages[0].form;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v17.0/" +
          phon_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: form,
          text: {
            body: "Hello I am 99 chatbot How can I help you?",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});
