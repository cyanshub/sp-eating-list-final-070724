'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 網路上的大頭貼素材
    const results = [
      { avatar: null },
      { avatar: 'https://png.pngtree.com/element_our/20190529/ourmid/pngtree-user-cartoon-avatar-pattern-flat-avatar-image_1200091.jpg' },
      { avatar: 'https://png.pngtree.com/element_our/20190529/ourmid/pngtree-flat-pattern-user-pattern-image_1200088.jpg' }
    ]

    // 獲取所有的 users id
    const users = await queryInterface.sequelize.query(
      'SELECT id, name FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    )

    // 加入avater: 遍歷每個 user 並更新 avatar
    for (let i = 0; i < users.length; i++) {
      // 更新 users 資料表
      await queryInterface.sequelize.query(
        'UPDATE users SET avatar = :avatar WHERE id = :id',
        { replacements: { avatar: results[i].avatar, id: users[i].id } })

      console.log('更新使用者', users[i].name, '使用圖像:', results[i].avatar)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('users', {
      avatar: null
    })
  }
}
