const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const knex = require("knex");
const { response } = require("express");
const db = knex({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    database: "loltogether",
    password: "0217", // .gitignore 처리 해야함.
  },
});

// Health Check (서버가 살아있는지 용도....)
app.get("/", (request, response) => {
  response.status(200).send("OK");
});

app.post("/signup", (req, res) => {
  const { email, password, name } = req.body;
  db.raw(
    `INSERT INTO member (email, password, name) VALUES("${email}", "${password}", "${name}")`
  )
    .then(() => {
      res.status(200).send("ok!");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생하였습니다.....");
    });
});

app.listen(7000, () => {
  console.log("서버가 켜 있어요...");
});
