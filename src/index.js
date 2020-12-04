const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

require("dotenv").config();

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
    password: process.env.DB_PASSWORD,
  },
});

// Health Check (서버가 살아있는지 용도....)
app.get("/", (request, response) => {
  response.status(200).send("OK");
});

function endcodePassword(password, salt) {
  return crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");
}

app.post("/signup", (req, res) => {
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

app.post("/signup/check", (req, res) => {
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

/// 게시판 ..

app.post("/board", (req, res) => {
  const { title, line, content, userName } = req.body;
  db.raw(
    `INSERT INTO board (title, line, content, userName) VALUES("${title}", "${line}", "${content}", "${userName}")`
  )
    .then(() => {
      res.status(200).send("ok!!!!!!!!!!!!!!!!!!!");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생하였습니다....");
    });
});

app.get("/board/list", (req, res) => {
  db.raw(`SELECT * FROM board`)
    .then((response) => {
      res.send(response[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생하였습니다ㅠㅠ");
    });
});

app.get("/board", (req, res) => {
  const boardId = req.query.boardId;

  db.raw(`SELECT * FROM board where id = "${boardId}"`)
    .then((response) => {
      res.send(response[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생함");
    });
});

app.delete("/board", (req, res) => {
  const boardId = req.query.boardId;
  db.raw(`SELECT * FROM board where id = "${boardId}"`)
    .then((response) => {
      if (response[0].length == 0) {
        console.log("글이 없어요");
        return res.status(404).send("글이 없습니다.");
      }
      db.raw(`DELETE FROM board where id = "${boardId}"`)
        .then(() => {
          res.status(200).send("ok!!!!!!!!!");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("에러가 발생함");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생했어요.");
    });
});

app.put("/board", (req, res) => {
  const boardId = req.query.boardId;
  const { title, line, content, userName } = req.body;

  db.raw(
    `UPDATE board SET title = "${title}", line = "${line}", content = "${content}", userName = "${userName}" WHERE id = "${boardId}"`
  )
    .then(() => {
      res.status(200).send("수정완료!!!");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생함");
    });
});

//댓글 관련 api
app.post("/board/comment", (req, res) => {
  const boardId = req.query.boardId;
  const { userName, content } = req.body;
  db.raw(
    `INSERT INTO comment(board_id, userName, content) VALUES ("${boardId}", "${userName}", "${content}")`
  )
    .then(() => {
      res.status(200).send("작성되었습니다.");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생함");
    });
});

app.delete("/board/comment", (req, res) => {
  const { board_Id, id } = req.query;

  db.raw(`DELETE FROM comment WHERE id = "${id}" AND board_Id = "${board_Id}"`)
    .then(() => {
      res.status(200).send("삭제되었습니다.");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생하였습니다.");
    });
});

app.get("/board/comment", (req, res) => {
  const { boardId } = req.query;
  db.raw(`SELECT * FROM comment where board_Id = "${boardId}"`)
    .then((response) => {
      res.status(200).send(response[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(7000, () => {
  console.log("서버가 켜 있어요...");
});
