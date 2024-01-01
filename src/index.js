import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import webhookRouter from "./routes/webhookRouter.js";

config();
const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:$(process.env.PORT)`);
});

app.use("/api/v1", webhookRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello, this is the webhook setup");
});
