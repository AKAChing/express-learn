/**
 * 
 * @param {error}  
 * @returns {错误信息对象} 
 */
const ERROR_CODE = {
  11000: '键值重复'
}
module.exports = function (error) {
  // console.log(String(error));
  let errorInfo = {}
  if (!error) return {}

  if (error && error.name === 'ValidationError') {
    Object.keys(error.errors).forEach(key => {
      errorInfo[key] = error.errors[key].message
    })
    console.log('ValidationErrorHandler', errorInfo);
    return
  }
  errorInfo = error.message

  return errorInfo
}