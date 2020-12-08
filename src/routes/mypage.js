const express = require("express");
const router = express.Router();
const db = require("../config");
const jwt = require("jsonwebtoken");

router.put("/mypage/username", (req, res) => {
  const { name } = req.body;
  const { id } = req.query;
  db.raw(`SELECT name FROM member WHERE name = "${name}"`)
    .then((response) => {
      if (response[0].length !== 0) {
        return res.send("중복된 닉네임이 있습니다.");
      }
      db.raw(`UPDATE member SET name = "${name}" WHERE id = "${id}"`)
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

router.put("/mypage/profileUrl", (req, res) => {
  const { profileUrl } = req.body;
  const token = req.headers.authorization;
  const { memberId } = jwt.verify(token, process.env.TOKEN_SECRET);

  db.raw(
    `UPDATE member SET profileUrl = "${profileUrl}" WHERE id = "${memberId}"`
  )
    .then(() => {
      console.log(memberId);
      res.status(200).send("사진이 등록되었습니다.");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("에러입니다.");
    });
});

//아직 수정중
router.post("/mypage/champ", (req, res) => {
  const token = req.headers.authorization;
  const { memberId } = jwt.verify(token, process.env.TOKEN_SECRET);
  const { name } = req.body;
  db.raw(
    `INSERT INTO champ(member_id, name) VALUES ("${memberId}", "${name}"), ("${memberId}", "${name}"), ("${memberId}", "${name}")`
  )
    .then(() => {
      res.status(200).send("입력되었습니다");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생하였습니다.");
    });
});

module.exports = router;
