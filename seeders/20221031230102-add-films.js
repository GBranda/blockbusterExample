'use strict';
const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));

module.exports = {
  async up (queryInterface, Sequelize) {
    let films = await fetch('https://ghibliapi.herokuapp.com/films');
    films = await films.json();
    let filmArray = films.map(film => ({
      id: film.id,
      title: film.title,
      stock: 5,
      rentals: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    return queryInterface.bulkInsert('films', filmArray);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('films', null, {});
  }
};