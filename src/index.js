const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");

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

function endcodePassword(password, salt) {
  return crypto
    .createHash("sha512")
    .update(password + salt)
    .digest("hex");
}

app.post("/signup", (req, res) => {
  const { email, password, name } = req.body;
  /**
   * ////////////////////////////////////////////////////완료!!!!!!!!!!!////////문제점1. email이 중복될 수 있다 ,,, 중복된 회원이 있을 수 있다 중복되는 사용자가 없게끔.
   * 문제점2. 비밀번호 입력한 게 그대로 들어간다... 암호화!!!!!!!!!
   */
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
          res.status(200).send("ok!");
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
app.post("/comment/boardId", (req, res) => {
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

app.listen(7000, () => {
  console.log("서버가 켜 있어요...");
});
