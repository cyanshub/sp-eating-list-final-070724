const express = require('express')
const router = express.Router()

// 載入 controllers
const userController = require('../../controllers/user-controller')
const restaurantController = require('../../controllers/restaurant-controller')

// 載入 middleware
const passport = require('../../config/passport') // 負責使用者登入與驗證相關
const { authenticated } = require('../../middlewares/auth')
const { generalErrorHandler } = require('../../middlewares/error-handler')
const upload = require('../../middlewares/multer') // 負責上傳圖片

// 設計路由
// 設計路由: 使用者登入相關
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 直接使用passport提供的方法進行登入驗證
router.get('/logout', userController.logOut)

// 設計路由: 餐廳相關
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.get('/restaurants/new', authenticated, restaurantController.newRestaurant)
router.post('/restaurants', authenticated, upload.single('image'), restaurantController.postRestaurant)
router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
router.get('/restaurants/:id/edit', authenticated, restaurantController.editRestaurant)
router.put('/restaurants/:id', authenticated, upload.single('image'), restaurantController.putRestaurant)
router.delete('/restaurants/:id', authenticated, restaurantController.deleteRestaurant)

// 設計路由: 應用程式報錯
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
