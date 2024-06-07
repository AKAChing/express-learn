const jwt = require("jsonwebtoken");
const { SECRETKEY } = require('../config')
module.exports = (req, res, next) => {
  let token = req.get("token");
  if (!token) {
    res.json({
      code: "1004",
      msg: "token缺失",
      data: null,
    });
    return;
  }
  jwt.verify(token, SECRETKEY, (err, data) => {
    if (err) {
      res.json({
        code: "1005",
        msg: "token校验失败",
        data: null,
      });
      return;
    }
    req.user = data
    // console.log("token", data, token);
    next();
  });
};
