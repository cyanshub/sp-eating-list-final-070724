const express = require('express')
const router = express.Router()

// 載入 controllers
const restaurantController = require('../../controllers/restaurant-controller')

// 設計路由
router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
