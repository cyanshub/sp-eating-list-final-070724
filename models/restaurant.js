'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // 定義使用者與店家的多對多關係
      Restaurant.belongsToMany(models.User, {
        through: models.Ownership,
        foreignKey: 'restaurantId',
        as: 'ownedUsers'
      })
    }
  }
  Restaurant.init({
    name: DataTypes.STRING,
    nameEn: DataTypes.STRING,
    category: DataTypes.STRING,
    image: DataTypes.STRING,
    location: DataTypes.STRING,
    phone: DataTypes.STRING,
    googleMap: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'restaurants',
    underscored: true
  })
  return Restaurant
}
