const express = require("express");
const router = express.Router();
const db = require("../config");
const checkToken = require("../middlewares/tokenValidator");

router.post("/board", (req, res) => {
  const { title, line, content } = req.body;
  if (!title || !line || !content) {
    res.status(400).send("필드를 빠짐없이 입력해주세요!");
  }
  const memberId = checkToken(res, req.headers.authorization);
  db.raw(
    `INSERT INTO board (title, line, content, member_id) VALUES("${title}", "${line}", "${content}", ${memberId})`
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
  db.raw(
    `SELECT distinct board.id, board.title, board.line, board.content, board.created_data_time, member.id AS memberId, member.name FROM board INNER JOIN member ON board.member_id = member.id`
  )
    .then((response) => {
      res.send(response[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생하였습니다ㅠㅠ");
    });
});

router.get("/board/mylist", (req, res) => {
  const memberId = checkToken(res, req.headers.authorization);
  db.raw(`SELECT * FROM board where member_id = ${memberId}`)
    .then((response) => {
      res.status(200).send(response[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가발생함");
    });
});

router.get("/board", (req, res) => {
  const boardId = req.query.boardId;
  if (!boardId) {
    res.status(400).send("필드를 빠짐없이 입력해주세요!");
  }

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
  if (!boardId) {
    res.status(400).send("필드를 빠짐없이 입력해주세요!");
  }
  const memberId = checkToken(res, req.headers.authorization);

  db.raw(
    `SELECT * FROM board where id = "${boardId}" and member_id = ${memberId}`
  )
    .then((response) => {
      if (response[0].length == 0) {
        console.log("글이 없어요");
        return res.status(404).send("글이 없습니다.");
      }
      db.raw(
        `DELETE FROM board where id = "${boardId}" and member_id = ${memberId}`
      )
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
  const { title, line, content } = req.body;
  if (!title || !content || !line) {
    res.status(400).send("필드를 빠짐없이 입력해주세요!");
  }
  const memberId = checkToken(res, req.headers.authorization);

  db.raw(
    `UPDATE board SET title = "${title}", line = "${line}", content = "${content}" WHERE id = "${boardId}" and member_id = ${memberId}`
  )
    .then(() => {
      res.status(200).send("수정완료!!!");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("에러가 발생함");
    });
});

//댓글 관련 api 누가 댓글 달았는지 확인하기!
router.post("/board/comment", (req, res) => {
  const { boardId } = req.query;
  const { content } = req.body;
  if (!boardId || !content) {
    res.status(400).send("필드를 빠짐없이 입력해주세요!");
  }
  const memberId = checkToken(res, req.headers.authorization);

  db.raw(
    `INSERT INTO comment(member_id, board_id, content) VALUES("${memberId}", ${boardId}, "${content}")`
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
  const { boardId } = req.query;
  if (!boardId) {
    res.status(400).send("필드를 빠짐없이 입력해주세요!");
  }

  const memberId = checkToken(res, req.authorization.token);

  db.raw(
    `DELETE FROM comment WHERE member_Id = ${memberId} AND board_id = "${boardId}"`
  )
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
  if (!boardId) {
    res.status(400).send("필드를 빠짐없이 입력해주세요!");
  }

  db.raw(`SELECT * FROM comment where board_Id = "${boardId}"`)
    .then((response) => {
      res.status(200).send(response[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
