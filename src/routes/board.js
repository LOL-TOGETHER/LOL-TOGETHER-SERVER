const express = require("express");
const router = express.Router();
const db = require("../config");

router.post("/board", (req, res) => {
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

router.get("/board/list", (req, res) => {
  db.raw(`SELECT * FROM board`)
    .then((response) => {
      res.send(response[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생하였습니다ㅠㅠ");
    });
});

router.get("/board", (req, res) => {
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

router.delete("/board", (req, res) => {
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

router.put("/board", (req, res) => {
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
router.post("/board/comment", (req, res) => {
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

router.delete("/board/comment", (req, res) => {
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

router.get("/board/comment", (req, res) => {
  const { boardId } = req.query;
  db.raw(`SELECT * FROM comment where board_Id = "${boardId}"`)
    .then((response) => {
      res.status(200).send(response[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
