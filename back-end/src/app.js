import express from "express";

const app = express();

app.use(express.static("../public"));
app.use(express.urlencoded());

app.listen(process.env.PORT ?? 3000);
