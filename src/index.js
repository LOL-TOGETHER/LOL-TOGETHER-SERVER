const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const knex = require("knex");
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
  /**
   * ////////////////////////////////////////////////////완료!!!!!!!!!!!////////문제점1. email이 중복될 수 있다 ,,, 중복된 회원이 있을 수 있다 중복되는 사용자가 없게끔.
   * 문제점2. 비밀번호 입력한 게 그대로 들어간다... 암호화!!!!!!!!!
   */
  db.raw(`SELECT email FROM member WHERE email = "${email}"`)
    .then((response) => {
      if (response[0].length == 0) {
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
      } else {
        res.status(409).send("중복된 이메일이 있다구요!!!!!!!!!!!!!!");
      }
    })
    .catch((err) => {
      res.status(500).send("에러다!!!!!");
    });
});

app.listen(7000, () => {
  console.log("서버가 켜 있어요...");
});
