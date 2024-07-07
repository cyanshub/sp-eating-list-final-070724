// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入需要使用的工具
const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport.js')
const { getUser } = require('./helpers/auth-helpers.js')

const { pages } = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers.js')

// 設定應用程式
const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

// middleware
// middleware: 綜合
app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(express.urlencoded({ extended: true })) // 啟用 req.body
app.use(methodOverride('_method')) // 遵循RESTful 精神撰寫路由

// middleware: 設定 passport
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { secure: false } }))

app.use(passport.initialize()) // 令 passport 初始化
app.use(passport.session()) // 啟動 passport 的 session 功能; 必須放在原本的session之後

// middleware: 設定所有路由都會經過的 middleware
app.use((req, res, next) => {
  res.locals.userAuth = getUser(req)
  next()
})

app.use(pages)

// 啟動並監聽網站
app.listen(port, () => {
  console.info(`Eating-list application listening on port: http://localhost:${port}`)
})
