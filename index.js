import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import axios from "axios";

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

const app = express();
app.use(bodyParser.json());
app.use(express.json());

config();


// Rest of your code...

app.listen(process.env.PORT, () => {
  console.log(`webhook is listening on port ${process.env.PORT}`);
});
app.get("/webhook", (req, res) => {
  let mode = req.query("hub.mode");
  let challenge = req.query("hub.challenge");
  let token = req.query("hub.verify_token");

  if (mode && token) {
    if (mode == "subscribe" && token === mytoken) {
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
      let phone_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let form = body_param.entry[0].changes[0].value.messages[0].form;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v17.0/" +
          phone_no_id +
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
