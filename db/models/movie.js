const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, //必填项
    // unique: true //唯一值
  },
  director: {
    type: String,
    default: "匿名", //默认值
  },
  style: {
    type: String,
    enum: ["言情", "城市", "逆袭", "动作"], //枚举值
  },
  is_hot: Boolean, //布尔值
  tags: Array, //数组
  pub_time: Date, //日期
});

const MovieModel = mongoose.model('movies', MovieSchema)

module.exports = MovieModel;
