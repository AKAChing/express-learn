const express = require("express");
const router = express.Router();
const app = express();
const jwt = require("jsonwebtoken");
const moment = require("moment");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const BookModel = require("../db/models/book");
const ErrorHandler = require("../db/errorHandler");
const checkTokenMiddleware = require("../db/middleware/checkToken");

// 获取列表
router.get("/books", (req, res) => {
  console.log('/books', req);
  
  BookModel.find()
    .sort({ time: -1 })
    .limit(10)
    .then((data) => {
      res.json({
        code: "0000",
        msg: "读取成功",
        data,
      });
    })
    .catch((err) => {
      res.json({
        code: "1001",
        msg: "读取失败",
        data: ErrorHandler(err),
      });
    });
});

// 根据id获取详细信息
router.get("/books/:id", checkTokenMiddleware, (req, res) => {
  BookModel.findById(req.params.id)
    .then((data) => {
      if (!data || (data && data.length === 0)) {
        res.json({
          code: "1001",
          msg: "目标不存在",
          data,
        });
      } else {
        res.json({
          code: "0000",
          msg: "获取成功",
          data,
        });
      }
    })
    .catch((err) => {
      res.json({
        code: "1001",
        msg: "获取失败",
        data: ErrorHandler(err),
      });
    });
});

// 创建
router.post("/books", [jsonParser], (req, res) => {
  BookModel.create({
    ...req.body,
  })
    .then((data) => {
      res.json({
        code: "0000",
        msg: "创建成功",
        data,
      });
    })
    .catch((err) => {
      res.json({
        code: "1001",
        msg: "创建失败",
        data: ErrorHandler(err),
      });
    });
});

// 删除
router.delete("/books/:id", checkTokenMiddleware, (req, res) => {
  BookModel.findByIdAndDelete(req.params.id)
    .then((data) => {
      console.log(data);
      if (!data || (data && data.deletedCount === 0)) {
        res.json({
          code: "1001",
          msg: "目标不存在",
          data,
        });
      } else {
        res.json({
          code: "0000",
          msg: "删除成功",
          data,
        });
      }
    })
    .catch((err) => {
      res.json({
        code: "1001",
        msg: "删除失败",
        data: ErrorHandler(err),
      });
    });
});

// 更新
router.patch("/books/:id", jsonParser, (req, res) => {
  BookModel.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  })
    .then((data) => {
      if (!data) {
        res.json({
          code: "1001",
          msg: "目标不存在",
          data,
        });
      } else {
        res.json({
          code: "0000",
          msg: "修改成功",
          data,
        });
      }
    })
    .catch((err) => {
      res.json({
        code: "1001",
        msg: "修改失败",
        data: ErrorHandler(err),
      });
    });
});

module.exports = router;
