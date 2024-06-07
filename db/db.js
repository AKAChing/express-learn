/**
 *
 * @param {*} success
 * @param {*} error
 */

const errorHandler = err => {
  console.log(`操作失败${err}`);
}

module.exports = function (success, error) {
  // 引入依赖
  const mongoose = require("mongoose");

  const { DBHOST, DBPORT, DBNAME } = require('./config')

  // 连接数据库
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

  // 连接成功回调
  mongoose.connection.once("open", () => {
    success()
  });

  // 连接失败回调
  mongoose.connection.on("error", () => {
    errorHandler()
  });

  // 连接关闭回调
  mongoose.connection.on("close", () => {
    console.log("关闭mongodba");
  });

  // setTimeout(() => {
  //   mongoose.disconnect()
  // }, 3000)
  // console.log(mongoose.model());
};
