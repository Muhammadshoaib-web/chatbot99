import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import webhookRouter from "./routes/webhookRouter.js";

config();

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use("/webhook", webhookRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
