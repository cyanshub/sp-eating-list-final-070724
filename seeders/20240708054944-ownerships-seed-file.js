'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 設定使用者與餐廳的關係：user1
    await queryInterface.bulkInsert('ownerships',
      [1, 2, 3]
        .map(restaurantId => {
          return {
            user_id: 2,
            restaurant_id: restaurantId,
            created_at: new Date(),
            updated_at: new Date()
          }
        })
    )

    // 設定使用者與餐廳的關係：user2
    await queryInterface.bulkInsert('ownerships',
      [4, 5, 6]
        .map(restaurantId => {
          return {
            userId: 3,
            restaurant_id: restaurantId,
            created_at: new Date(),
            updated_at: new Date()
          }
        })
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ownerships', null)
  }
}
