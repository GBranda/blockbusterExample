'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      rent.belongsTo(models.user), {
        targetKey: 'idUser'
      };
      rent.belongsTo(models.film), {
        targetKey: 'filmId'
      };
    }
  }
  rent.init({
    idRent: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    filmId: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
    },
    rentDate: {
      type: DataTypes.DATE,
        allowNull: false
    },
    refundDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userRefundDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'rent',
  });
  return rent;
};