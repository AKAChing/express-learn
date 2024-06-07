const express = require('express')
const router = express.Router()

router.get('/admin', (req, res) => {
  res.send('后台主页')
})

module.exports = router