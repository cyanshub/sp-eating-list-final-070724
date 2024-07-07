'use strict'

const { restaurants } = require('../restaurant.json')
console.log('讀取 Json 資料:', restaurants)

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants',
      Array.from({ length: restaurants.length }, (_, index) => ({
        name: restaurants[index].name,
        name_en: restaurants[index].name_en,
        category: restaurants[index].category,
        image: restaurants[index].image,
        location: restaurants[index].location,
        phone: restaurants[index].phone,
        google_map: restaurants[index].google_map,
        rating: restaurants[index].rating,
        description: restaurants[index].description,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null)
  }
}
