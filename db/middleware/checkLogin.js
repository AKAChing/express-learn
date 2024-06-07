module.exports = (req, res, next) => {
  console.log(req.session);
  if (!req.session.username) {
    res.send('未登录, 正在前往登录页')
    // return res.redirect('/login')
  }
  next()
}