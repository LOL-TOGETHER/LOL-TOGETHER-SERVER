const express = require("express");
const router = express.Router();
const db = require("../config");
const jwt = require("jsonwebtoken");

router.put("/mypage", (req, res) => {
  const token = req.headers.authorization;
  const { memberId } = jwt.verify(token, process.env.TOKEN_SECRET);
  const { name, profileUrl, champions, line } = req.body;
  db.raw(`SELECT name FROM member WHERE name = "${name}"`)
    .then((response) => {
      if (response[0].length !== 0) {
        return res.send("중복된 닉네임이 있습니다.");
      }
      db.raw(
        `UPDATE member SET name = "${name}", profileUrl = "${profileUrl}", champions = "${champions}", line = "${line}" WHERE id = "${memberId}"`
      )
        .then(() => {
          res.status(200).send("수정되었습니다.");
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("에러입니다ㅡ,.ㅡ");
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("에러입니다");
    });
});

router.get("/mypage", (req, res) => {
  const token = req.headers.authorization;
  const { memberId } = jwt.verify(token, process.env.TOKEN_SECRET);
  db.raw(
    `SELECT id, email, name, line, profileUrl, champions FROM member WHERE id = ${memberId}`
  )
    .then((response) => {
      res.status(200).send(response[0]);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("에러입니다!");
    });
});

module.exports = router;
