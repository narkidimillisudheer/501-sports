"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Sports, {
        through: "UserHasJoined",
        foreignKey: "userId",
        as: "joinedSessions",
      });
    }
    static addUser({ firstname, lastname, email, password }) {
      return this.create({
        firstName: firstname,
        lastname: lastname,
        email: email,
        password: password,
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "First name is required.",
          },
        },
      },
      lastname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Invalid email address.",
          },
        },
      },
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
