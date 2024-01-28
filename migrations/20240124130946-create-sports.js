'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SportsName: {
        type: Sequelize.STRING
      },
      team1Players: {
        type: Sequelize.STRING
      },
      team2players: {
        type: Sequelize.STRING
      },
      addPlayers: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      time: {
        type: Sequelize.STRING
      },
      venue: {
        type: Sequelize.STRING
      },
      isCancelled: {
        type: Sequelize.BOOLEAN
      },
      userId: {
        type: Sequelize.INTEGER
      },
      isAvailable: {
        type: Sequelize.BOOLEAN
      },
      addUserId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sports');
  }
};