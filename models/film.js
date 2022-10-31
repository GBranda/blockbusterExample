'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      film.belongsToMany(models.rent, { through: "rent" })
    }
  }
  film.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    title: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    rentals: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'film',
  });
  return film;
};