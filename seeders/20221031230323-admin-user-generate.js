'use strict';
require('dotenv').config()
const bcrypt = require('bcrypt')
const date = new Date()

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users',[{
      email: 'admin@admin.com',
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      dni: '00000000',
      isAdmin: true,
      createdAt: date,
      updatedAt: date
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
