const jwt = require("jsonwebtoken");

const checkToken = (res, token) => {
  try {
    token = token.replace("Bearer ", "");
    const { memberId } = jwt.verify(token, process.env.TOKEN_SECRET);
    return memberId;
  } catch (error) {
    return res.status(401).send("토큰이 만료되었습니다 다시 로그인 해주세요.");
  }
};

module.exports = checkToken;
