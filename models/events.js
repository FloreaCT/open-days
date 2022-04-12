'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Event extends Model {}
    Event.init({

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        begin_at: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }

        },
        ends_at: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Event'

    });

    Event.associate = (models) => {

        Event.belongsTo(models.User, {
                as: "user",
                foreignKey: "userId"
            }),

            Event.belongsToMany(models.Attenders_to, {
                as: 'attenders',
                foreignKey: 'eventId',
                through: 'userId',
                onDelete: 'cascade'
            })
    }

    return Event
};