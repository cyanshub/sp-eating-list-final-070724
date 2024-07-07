const express = require('express')
const router = express.Router()

// 載入 controllers
const userController = require('../../controllers/user-controller')
const restaurantController = require('../../controllers/restaurant-controller')

// 載入 middleware
const passport = require('../../config/passport') // 負責使用者登入與驗證相關
const { authenticated } = require('../../middlewares/auth')
const { generalErrorHandler } = require('../../middlewares/error-handler')

// 設計路由
// 設計路由: 使用者登入相關
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 直接使用passport提供的方法進行登入驗證
router.get('/logout', userController.logOut)

// 設計路由: 餐廳相關
router.get('/restaurants', authenticated, restaurantController.getRestaurants)

// 設計路由: 應用程式報錯
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
