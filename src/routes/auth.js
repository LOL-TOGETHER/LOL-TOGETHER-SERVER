const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../config");

function endcodePassword(password, salt) {
  return crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");
}

router.post("/signup", (req, res) => {
  const { email, password, name } = req.body;
  db.raw(`SELECT email FROM member WHERE email = "${email}"`)
    .then((response) => {
      if (response[0].length !== 0) {
        return res.status(409).send("중복된 이메일이 있다구요!!!!!!!!!!!!!!");
      }
      const salt = Math.round(new Date().valueOf() * Math.random() + "");
      const hashPassword = endcodePassword(password, salt);
      db.raw(
        `INSERT INTO member (email, password, salt, name) VALUES("${email}", "${hashPassword}", "${salt}", "${name}")`
      )
        .then(() => {
          res.status(200).send("가입 완료되었습니다!");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("에러가 발생하였습니다.....");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러다!!!!!");
    });
});

function checkPassword(res, email, hashPassword) {
  db.raw(
    `SELECT id FROM member WHERE email = "${email}" AND password = "${hashPassword}"`
  )
    .then((response) => {
      if (response[0].length == 0) {
        return res.status(404).send("해당하는 회원이 없습니다.2");
      }
      const memberId = response[0][0].id;
      const token = jwt.sign({ memberId: memberId }, process.env.TOKEN_SECRET, {
        expiresIn: "60m",
      });
      return res.status(200).send(token);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("에러다...");
    });
}

router.post("/signup/check", (req, res) => {
  const { email, password } = req.body;

  db.raw(`SELECT salt FROM member where email = "${email}"`)
    .then((response) => {
      if (response[0].length == 0) {
        return res.status(404).send("해당하는 회원이 없습니다.1");
      }
      const salt = response[0][0].salt;
      const hashPassword = endcodePassword(password, salt);
      checkPassword(res, email, hashPassword);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러다!!!");
    });
});

module.exports = router;
