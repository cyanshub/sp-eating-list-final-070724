// 載入資料表 model
const { Restaurant, User } = require('../models')

// 載入所需工具
const { Op, literal } = require('sequelize') // 引入 sequelize 查詢符、啟用 SQL 語法
const { localCoverHandler } = require('../helpers/file-helpers') // 負責上傳餐廳封面照片

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const sorts = [
      { id: 1, name: '序號(升序)', orderClause: [['id', 'ASC']] },
      { id: 2, name: '序號(降序)', orderClause: [['id', 'DESC']] },
      { id: 3, name: '類別', orderClause: [['category', 'ASC']] },
      { id: 4, name: '地區', orderClause: [['location', 'ASC']] },
      { id: 5, name: '店名(升序)', orderClause: [['name', 'ASC']] },
      { id: 6, name: '店名(降序)', orderClause: [['name', 'DESC']] }]

    const sort = Number(req.query.sort) // 拿取排序變數, 判斷要依什麼進行sort排序
    const orderClause = sorts.find(s => s.id === sort)?.orderClause // 找出排序條件
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
      order: sort ? orderClause : [['id', 'DESC']]
    })
      .then(restaurants => {
        const data = restaurants.rows

        return res.render('restaurants/restaurants', {
          restaurants: data,
          isSearched: '/restaurants', // 決定搜尋表單發送位置
          keyword,
          sorts,
          sort
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
  },
  getOwnerships: (req, res, next) => {
    const userAuthId = req.user.id
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

    return User.findByPk(userAuthId, {
      // 不可用raw:true和nest:true整理資料, 當關聯資料目標是陣列的時候, 前面的語法會導致結果變成單一物件; 要在後面用toJSON
      attributes: { exclude: ['password'] }, // 避免密碼外洩
      include: [{
        model: Restaurant,
        as: 'ownedRestaurants',
        order: [['id', 'DESC']],
        where: whereClause
      }]
    })
      .then(user => {
        const data = user?.ownedRestaurants?.map(item => ({ ...item.toJSON() })) || []

        return res.render('restaurants/ownerships', {
          restaurants: data,
          isSearched: '/restaurants/ownerships', // 決定搜尋表單發送位置
          keyword
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
