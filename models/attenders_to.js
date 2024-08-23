"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attenders_to extends Model {
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Attenders_to.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        references: {
          model: "Events",
          key: "id",
          onDelete: "cascade",
        },
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        references: {
          model: "Users",
          key: "id",
          onDelete: "cascade",
        },
      },
    },
    {
      sequelize,
      modelName: "Attenders_to",
      freezeTableName: true,
    }
  );

  Attenders_to.associations = (models) => {
    Attenders_to.belongsToMany(models.User, {
      as: "user",
      foreignKey: "userId",
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
      Attenders_to.belongsTo(models.Event, {
        as: "event",
        foreignKey: "eventId",
        onDelete: "cascade",
        onUpdate: "cascade",
      });
  };

  return Attenders_to;
};
