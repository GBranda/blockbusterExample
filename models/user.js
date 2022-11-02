'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.rent, {
        foreignKey: 'userId'
      })
    }
  }
  user.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      dni: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};