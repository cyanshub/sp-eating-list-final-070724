const restaurantController = {
  getRestaurants: (req, res, next) => {
    res.render('restaurants')
  }
}

module.exports = restaurantController
