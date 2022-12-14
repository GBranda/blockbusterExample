'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favouriteFilms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      favouriteFilms.hasMany(models.film, {
        foreignKey: "id",
        target_key: "idFilm",
      });
      favouriteFilms.hasMany(models.user, {
        foreignKey: "id",
        target_key: "idUser",
      });
    }
  }
  favouriteFilms.init({
    idFilm: {
      type: DataTypes.STRING,
      unique: true,
        references: {
          model: 'film',
          key: "id",
        },
    },
    idUser: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: "id",
      },
    }, 
    review: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'favouriteFilms',
  });
  return favouriteFilms;
};