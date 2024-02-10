"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sports extends Model {
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through: "UserHasJoined",
        foreignKey: "sessionId",
        as: "joinedUsers",
      });
    }
  }
  Sports.init(
    {
      SportsName: DataTypes.STRING,
      team1Players: DataTypes.STRING,
      team2players: DataTypes.STRING,
      addPlayers: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      time: DataTypes.STRING,
      venue: DataTypes.STRING,
      isCancelled: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
      isAvailable: DataTypes.BOOLEAN,
      cancelReason: DataTypes.STRING,
      addUserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Sports",
    }
  );
  return Sports;
};
