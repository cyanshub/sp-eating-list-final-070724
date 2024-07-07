'use strict'
// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bcrypt = require('bcryptjs')
const salt = 10 // 產生加鹽密碼
const counts = 2 // 生成用戶數量

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(process.env.USER_PASSWORD, salt)

    // 建立 root 使用者
    await queryInterface.bulkInsert('users', [{
      name: 'root',
      email: 'root@example.com',
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    }])

    // 建立一般使用者
    await queryInterface.bulkInsert('users',
      Array.from({ length: counts }, (_, index) => ({
        name: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null)
  }
}
