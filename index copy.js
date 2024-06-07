const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
// 解析json
const jsonParser = bodyParser.json()

// 解析querystring格式请求体
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// const { singers } = require('./singer.json')
const app = express()

// app.get('/singer/:id.html', (req, res) => {
//   console.log('req.method', req.method)
//   console.log('req.url', req.url)
//   console.log('req.httpVersion', req.httpVersion)
//   console.log('req.headers', req.headers)
//   console.log('req.path', req.path)
//   console.log('req.query', req.query)
//   console.log('req.ip', req.ip)
//   console.log(req.get('host'))
//   let { id } = req.params
//   let singer = singers.find(item => Number(item.id) === Number(id))
//   if (!singer) {
//     // 原生
//     res.statusCode = 404
//     res.statusMessage = 'love'
//     res.setHeader('xxx', 'yyy')
//     res.end('404 NOT FOUND')

//     express
//     res.status(500)
//     res.set('aaa', 'bbb')
//     res.send('404')

//     // 重定向
//     res.redirect('http://baidu.com')

//     // 下载相应
//     res.download('./index.js')

//     // 响应JSON
//     res.json({
//       name: 'akaching',
//       age: 18
//     })

//     // 响应文件
//     res.sendFile(__dirname + '/index.html')
//     return
//   }
//   console.log(singer);
//   res.send(singer.singer_name)
// })


// 全局中间件
function globalMiddleware (req, res, next) {
  let { url, ip } = req
  fs.appendFileSync(path.resolve(__dirname, './access.log'), `${url} ${ip}\r\n`)
  next()
}


// 特定路径中间件
function routeMiddleware (req, res, next) {
  let { query } = req
  if (query.code === '520') {
    next()
  } else {
    res.send('code错误')
  }
}

// 静态资源中间件
function assetsMiddleware () {
  return express.static(__dirname + '/public')
}

app.use(globalMiddleware)
app.use(assetsMiddleware())

// 防盗链
app.use((req, res, next) => {
  let referer = req.get('referer')
  if (referer) {
    let url = new URL(referer)
    let hostname = url.hostname
    console.log(hostname !== '127.0.0.1')
    if (hostname !== '127.0.0.1') {
      res.status(404).send('图片无法显示')
      return
    }
  }
  next()
})

app.get('/', (req, res) => {
  res.send('/主页1')
})

app.get('/home', (req, res) => {
  res.send('前台主页')
})

app.get('/admin', routeMiddleware, (req, res) => {
  res.send('后台主页')
})

app.get('/setting', (req, res) => {
  res.send('后台设置')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/login', urlencodedParser, (req, res) => {
  res.send('获取登录数据')
})

app.all('*', (req, res) => {
  res.send('404')
})

app.listen(3000, () => {
  console.log('服务启动成功! 端口3000, 正在监听中~')
})