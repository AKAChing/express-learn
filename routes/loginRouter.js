const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const session = require("express-session");
const jwt = require('jsonwebtoken')
const MongoStore = require("connect-mongo");
const UserModel = require("../db/models/user");
const ErrorHandler = require("../db/errorHandler");
const md5 = require("md5");
const { DBHOST, DBPORT, DBNAME, SECRETKEY } = require("../db/config");
const checkLoginMiddleware = require("../db/middleware/checkLogin");
const app = express();
const router = express.Router();

router.use(
  session({
    name: "youngoldman", //设置cookie的name, 默认值是: connect.sid
    secret: "hester", //加密字符串(签名), 加盐
    saveUninitialized: false, //是否为每次请求都设置一个cookie用来储存session的id
    resave: true, //是否在每次请求时重新保存session
    store: MongoStore.create({
      //数据库的连接配置
      mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DBNAME}`,
    }),
    cookie: {
      httpOnly: true, //开启后前端无法通过JS操作
      maxAge: 1000 * 60 * 60, //控制sessionID过期时间
    },
  })
);

router.post("/login", jsonParser, async (req, res) => {
  const { username, password } = req.body;

  // 先判断账户是否存在, 如果存在则进行下一步操作, 不存在提示账户不存在
  const account = await UserModel.findOne({ username: username });
  if (!account) {
    res.json({
      code: "1001",
      msg: "账号不存在",
      data: null
    });
    console.log("account", account);
    return
  }
  // 如果账号存在的情况下查找对应密码信息并进行比对, 如果错误进行提示
  const fullAccount = await UserModel.findOne({ username: username, password: md5(password) })
  if (!fullAccount) {
    res.json({
      code: "1002",
      msg: "账号密码错误",
      data: null
    });
    console.log('fullAccount', fullAccount)
    return
  }

  // 账号密码完全正确提示登录成功
  // console.log('登录成功', fullAccount)
  let token = jwt.sign({
    username: fullAccount.username,
    _id: fullAccount._id
  }, SECRETKEY, {
    expiresIn: 60 * 60
  })
  // req.session.username = fullAccount.username
  // req.session._id = fullAccount._id
  res.json({
    code: "0000",
    msg: "登录成功",
    data: token,
  });
});

router.post("/register", jsonParser, (req, res) => {
  UserModel.create({
    ...req.body,
    password: md5(req.body.password),
  })
    .then((data) => {
      res.send(`注册成功`);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.json({
          code: 11000,
          msg: "用户名重复",
          data: null,
        });
      } else {
        res.json({
          code: err.code,
          msg: err.message,
          data: null,
        });
      }
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send(`退出登录成功!`);
  });
});

router.get("/cart", checkLoginMiddleware, (req, res) => {
  // 判断是否存在session数据
  if (req?.session?.username) {
    res.send(`欢迎光临${req.session.username}`);
  } else {
    res.send(`您还没有登录`);
  }
});

module.exports = router;
