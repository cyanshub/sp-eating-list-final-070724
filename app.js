// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入需要使用的工具
const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')

const { pages } = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers.js')

// 設定應用程式
const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

// 設計 middleware
app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(express.urlencoded({ extended: true })) // 啟用 req.body
app.use(methodOverride('_method')) // 遵循RESTful 精神撰寫路由

app.use(pages)

// 啟動並監聽網站
app.listen(port, () => {
  console.info(`Eating-list application listening on port: http://localhost:${port}`)
})
