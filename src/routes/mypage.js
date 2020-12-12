const express = require("express");
const router = express.Router();
const db = require("../config");
const checkToken = require("../middlewares/tokenValidator");

router.put("/mypage", (req, res) => {
  const { name, profileUrl, champions, line } = req.body;
  const memberId = checkToken(res, req.headers.authorization);

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
  const memberId = checkToken(res, req.headers.authorization);
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

router.get("/mypage/partner", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).send("필드를 빠짐없이 입력해주세요!");
  }
  checkToken(res, req.headers.authorization);
  db.raw(`SELECT id, name, line, champions FROM member WHERE id = ${userId}`)
    .then((response) => {
      res.status(200).send(response[0]);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("에러입니다.");
    });
});

module.exports = router;
