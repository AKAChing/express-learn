const express = require('express')
const router = express.Router()

router.get('/home', (req, res) => {
  res.send('前台主页')
})

module.exports = router