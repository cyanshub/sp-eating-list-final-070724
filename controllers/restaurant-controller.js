// 載入資料表 model
const { Restaurant } = require('../models')

// 載入所需工具
const { Op, literal } = require('sequelize') // 引入 sequelize 查詢符、啟用 SQL 語法

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
      order: [['id', 'ASC']]
    })
      .then(restaurants => {
        const data = restaurants.rows
        return res.render('restaurants', {
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
      .then(restaurant => res.render('restaurant', { restaurant }))
      .catch(err => next(err))
  }
}

module.exports = restaurantController
