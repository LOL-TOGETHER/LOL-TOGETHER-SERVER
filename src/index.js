const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { upload } = require("./utils/upload");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const boardRouter = require("./routes/board");
app.use("/", boardRouter);

const authRouter = require("./routes/auth");
app.use("/", authRouter);

const mypageRouter = require("./routes/mypage");
app.use("/", mypageRouter);

app.post("/upload", upload.single("img"), (req, res) => {
  res.status(200).send(req.file.location);
});

app.get("/", (request, response) => {
  response.status(200).send("OK");
});

app.listen(7000, () => {
  console.log("서버가 켜 있어요...");
});
