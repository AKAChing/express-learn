const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, //必填项
    // unique: true //唯一值
  },
  author: {
    type: String,
    required: true, //必填项
    // default: "匿名", //默认值
  },
  style: {
    type: String,
    enum: ["言情", "城市", "逆袭", "动作"], //枚举值
  },
  price: Number, //数字
  is_hot: Boolean, //布尔值
  tags: Array, //数组
  pub_time: Date, //日期
});

const BookModel = mongoose.model('books', BookSchema)

module.exports = BookModel;
