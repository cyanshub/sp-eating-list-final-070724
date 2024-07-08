// 載入資料表 model
const { Restaurant } = require('../models')

// 載入所需工具
const { Op, literal } = require('sequelize') // 引入 sequelize 查詢符、啟用 SQL 語法
const { localCoverHandler } = require('../helpers/file-helpers') // 負責上傳餐廳封面照片

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : '' // 取得並修剪關鍵字
    const whereClause = {
      ...keyword.length > 0
        ? {
            [Op.or]: [
              literal(`LOWER(Restaurant.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Restaurant.category) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Restaurant.location) LIKE '%${keyword.toLowerCase()}%'`)
            ]
          }
        : {}
    }
    return Restaurant.findAndCountAll({
      raw: true,
      where: whereClause,
      order: [['id', 'DESC']]
    })
      .then(restaurants => {
        const data = restaurants.rows
        return res.render('restaurants/restaurants', {
          restaurants: data,
          isSearched: '/restaurants', // 決定搜尋表單發送位置
          keyword
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    const restaurantId = req.params.id
    return Restaurant.findByPk(restaurantId, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('店家不存在!')
        return res.render('restaurants/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  newRestaurant: (req, res, next) => {
    return res.render('restaurants/new-restaurant')
  },
  postRestaurant: (req, res, next) => {
    // 拿到表單變數
    const { name, category, location, googleMap, phone, rating, description } = req.body
    const file = req.file

    // 檢驗必填欄位是否存在
    if (!name) throw new Error('店家名稱為必填欄位!')
    // 把取出的檔案 file 傳給 file-helper 處理
    return localCoverHandler(file)
      .then(filePath => {
        return Restaurant.create({
          name,
          category,
          location,
          googleMap,
          phone,
          rating,
          description,
          image: filePath || null
        })
      })
      .then(newRestaurant => {
        req.flash('success_messages', '成功新增店家資訊!')
        res.redirect('/restaurants')
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    const restaurantId = req.params.id
    return Restaurant.findByPk(restaurantId, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('店家不存在!')
        return res.render('restaurants/edit-restaurant', { restaurant })
      })

      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const RestaurantId = req.params.id // 拿到路由變數

    // 拿到表單變數
    const { name, category, location, googleMap, phone, rating, description } = req.body
    const file = req.file

    // 檢驗必填欄位是否存在
    if (!name) throw new Error('店家名稱為必填欄位!')

    return Promise.all([
      Restaurant.findByPk(RestaurantId),
      localCoverHandler(file) // 把取出的檔案 file 傳給 file-helper 處理
    ])

      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error('店家不存在!')
        return restaurant.update({
          name,
          category,
          location,
          googleMap,
          phone,
          rating,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(newRestaurant => {
        req.flash('success_messages', '成功修改店家資訊!')
        res.redirect(`/restaurants/${newRestaurant.id}`)
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    const RestaurantId = req.params.id // 拿到路由變數
    return Restaurant.findByPk(RestaurantId)
      .then(restaurant => {
        if (!restaurant) throw new Error('店家不存在!')
        return restaurant.destroy()
      })
      .then(deletedRestaurant => {
        req.flash('success_messages', '成功刪除店家!')
        return res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
