import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

bootstrap(app, express);
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
