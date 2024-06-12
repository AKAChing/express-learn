const express = require("express");
const path = require("path");
const app = express();
const homeRouter = require("./routes/homeRouter");
const adminRouter = require("./routes/adminRouter");
const booksRouter = require("./routes/booksRouter");
const loginRouter = require("./routes/loginRouter");
const db = require("./db/db");

db(async () => {
  app.use("/api", [booksRouter, loginRouter]);
  app.use("/", homeRouter);
  app.use("/", adminRouter);
  app.set('host', '192.1681.1.7')
  app.listen(3000, () => {
    console.log("服务启动成功! 端口3000, 正在监听中~");
  });
});
app.use(express.static(path.join(__dirname, "views")));
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Lengh, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  next()
});
// app.use(function(req, res, next) {
//   res.send('404')
//   next()
// });
