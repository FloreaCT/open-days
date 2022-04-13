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
            defaultValue: "/images/banner_uni.jpg"
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
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

            Event.hasMany(models.Attenders_to, {
                as: 'attenders',
                foreignKey: 'eventId',
            })
    }

    return Event
};